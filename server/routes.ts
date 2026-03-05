import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { db } from "./db";
import { userProfiles, workoutLogs, workoutPlans, workoutDays, workoutExercises, workoutSessions } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

const WEEKDAY_MAP: Record<number, string> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
      res.json(profile || null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { weight, height, bodyFat, age, goal, gender } = req.body;
      const [existing] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
      if (existing) {
        const [updated] = await db
          .update(userProfiles)
          .set({ weight, height, bodyFat, age, goal, gender, onboardingCompleted: true })
          .where(eq(userProfiles.userId, userId))
          .returning();
        res.json(updated);
      } else {
        const [created] = await db
          .insert(userProfiles)
          .values({ userId, weight, height, bodyFat, age, goal, gender, onboardingCompleted: true, trialStartDate: new Date(), isSubscribed: false })
          .returning();
        res.json(created);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      res.status(500).json({ message: "Failed to save profile" });
    }
  });

  app.get("/api/trial-status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
      if (!profile) { res.json({ isTrialActive: true, daysRemaining: 7, isSubscribed: false }); return; }
      if (profile.isSubscribed) { res.json({ isTrialActive: false, daysRemaining: 0, isSubscribed: true }); return; }
      const trialStart = profile.trialStartDate || profile.createdAt || new Date();
      const daysSinceStart = Math.floor((Date.now() - new Date(trialStart).getTime()) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, 7 - daysSinceStart);
      res.json({ isTrialActive: daysRemaining > 0, daysRemaining, isSubscribed: false });
    } catch (error) {
      console.error("Error checking trial:", error);
      res.status(500).json({ message: "Failed to check trial status" });
    }
  });

  app.post("/api/workouts/log", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { workoutName, status, durationMinutes } = req.body;
      const today = new Date().toISOString().slice(0, 10);
      const [existing] = await db.select().from(workoutLogs).where(and(eq(workoutLogs.userId, userId), eq(workoutLogs.workoutDate, today)));
      if (existing) {
        const [updated] = await db.update(workoutLogs).set({ status, durationMinutes: durationMinutes ?? existing.durationMinutes }).where(and(eq(workoutLogs.userId, userId), eq(workoutLogs.workoutDate, today))).returning();
        res.json(updated);
      } else {
        const [created] = await db.insert(workoutLogs).values({ userId, workoutDate: today, workoutName, status, durationMinutes }).returning();
        res.json(created);
      }
    } catch (error) {
      console.error("Error logging workout:", error);
      res.status(500).json({ message: "Failed to log workout" });
    }
  });

  app.get("/api/workouts/history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const logs = await db.select().from(workoutLogs).where(eq(workoutLogs.userId, userId)).orderBy(desc(workoutLogs.workoutDate));
      res.json(logs);
    } catch (error) {
      console.error("Error fetching workout history:", error);
      res.status(500).json({ message: "Failed to fetch workout history" });
    }
  });

  app.get("/api/workout-plans", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const plans = await db.select().from(workoutPlans).where(eq(workoutPlans.userId, userId)).orderBy(desc(workoutPlans.createdAt));
      const result = [];
      for (const plan of plans) {
        const days = await db.select().from(workoutDays).where(eq(workoutDays.workoutPlanId, plan.id));
        const daysWithExercises = [];
        for (const day of days) {
          const exercises = await db.select().from(workoutExercises).where(eq(workoutExercises.workoutDayId, day.id));
          daysWithExercises.push({ ...day, exercises });
        }
        result.push({ ...plan, workoutDays: daysWithExercises });
      }
      res.json(result);
    } catch (error) {
      console.error("Error fetching workout plans:", error);
      res.status(500).json({ message: "Failed to fetch workout plans" });
    }
  });

  app.post("/api/workout-plans", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { name, workoutDays: days } = req.body;
      await db.update(workoutPlans).set({ isActive: false }).where(eq(workoutPlans.userId, userId));
      const [plan] = await db.insert(workoutPlans).values({ userId, name, isActive: true }).returning();
      const orderedWeekDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
      const sortedDays = [...days].sort((a: any, b: any) => orderedWeekDays.indexOf(a.weekDay) - orderedWeekDays.indexOf(b.weekDay));
      const createdDays = [];
      for (const day of sortedDays) {
        const [createdDay] = await db.insert(workoutDays).values({
          workoutPlanId: plan.id,
          name: day.name,
          weekDay: day.weekDay,
          isRest: day.isRest || false,
          estimatedDurationInSeconds: day.estimatedDurationInSeconds || 0,
          coverImageUrl: day.coverImageUrl,
        }).returning();
        const createdExercises = [];
        if (!day.isRest && day.exercises?.length) {
          for (const ex of day.exercises) {
            const [createdEx] = await db.insert(workoutExercises).values({
              workoutDayId: createdDay.id,
              name: ex.name,
              order: ex.order || 0,
              sets: ex.sets,
              reps: ex.reps,
              restTimeInSeconds: ex.restTimeInSeconds || 60,
            }).returning();
            createdExercises.push(createdEx);
          }
        }
        createdDays.push({ ...createdDay, exercises: createdExercises });
      }
      res.json({ ...plan, workoutDays: createdDays });
    } catch (error) {
      console.error("Error creating workout plan:", error);
      res.status(500).json({ message: "Failed to create workout plan" });
    }
  });

  app.get("/api/workout-plans/today", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const [plan] = await db.select().from(workoutPlans).where(and(eq(workoutPlans.userId, userId), eq(workoutPlans.isActive, true)));
      if (!plan) { res.json(null); return; }
      const todayWeekDay = WEEKDAY_MAP[new Date().getDay()];
      const [day] = await db.select().from(workoutDays).where(and(eq(workoutDays.workoutPlanId, plan.id), eq(workoutDays.weekDay, todayWeekDay)));
      if (!day) { res.json(null); return; }
      const exercises = await db.select().from(workoutExercises).where(eq(workoutExercises.workoutDayId, day.id));
      const today = new Date().toISOString().slice(0, 10);
      const [session] = await db.select().from(workoutSessions).where(and(eq(workoutSessions.workoutDayId, day.id), eq(workoutSessions.userId, userId)));
      res.json({ planId: plan.id, planName: plan.name, day: { ...day, exercises: exercises.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) }, session: session || null, today });
    } catch (error) {
      console.error("Error fetching today workout:", error);
      res.status(500).json({ message: "Failed to fetch today workout" });
    }
  });

  app.get("/api/workout-days/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const [day] = await db.select().from(workoutDays).where(eq(workoutDays.id, id));
      if (!day) { res.status(404).json({ message: "Workout day not found" }); return; }
      const exercises = await db.select().from(workoutExercises).where(eq(workoutExercises.workoutDayId, id));
      res.json({ ...day, exercises: exercises.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) });
    } catch (error) {
      console.error("Error fetching workout day:", error);
      res.status(500).json({ message: "Failed to fetch workout day" });
    }
  });

  app.post("/api/workout-sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { workoutDayId } = req.body;
      const [existing] = await db.select().from(workoutSessions).where(and(eq(workoutSessions.workoutDayId, workoutDayId), eq(workoutSessions.userId, userId)));
      if (existing) { res.json(existing); return; }
      const [session] = await db.insert(workoutSessions).values({ workoutDayId, userId, startedAt: new Date() }).returning();
      res.json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  app.put("/api/workout-sessions/:id/complete", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const [session] = await db.update(workoutSessions).set({ completedAt: new Date() }).where(eq(workoutSessions.id, id)).returning();
      res.json(session);
    } catch (error) {
      console.error("Error completing session:", error);
      res.status(500).json({ message: "Failed to complete session" });
    }
  });

  app.post("/api/ai/chat", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { messages } = req.body;
      const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));

      let OpenAI: any;
      try {
        const mod = await import("openai");
        OpenAI = mod.default;
      } catch {
        res.json({ reply: "O Coach AI ainda nao esta configurado. Tente novamente mais tarde." });
        return;
      }

      const openai = new OpenAI({
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      });

      const activePlan = await db.select().from(workoutPlans).where(and(eq(workoutPlans.userId, userId), eq(workoutPlans.isActive, true)));
      const existingPlans = await db.select().from(workoutPlans).where(eq(workoutPlans.userId, userId));

      const systemPrompt = `Voce e um personal trainer virtual especialista em montagem de planos de treino personalizados.

## Personalidade
- Tom amigavel, motivador e acolhedor.
- Linguagem simples e direta, sem jargoes tecnicos.
- Respostas curtas e objetivas.

## Dados do Usuario
${profile ? `- Peso: ${profile.weight ? profile.weight + "kg" : "nao informado"}
- Altura: ${profile.height ? profile.height + "cm" : "nao informado"}
- Gordura corporal: ${profile.bodyFat ? profile.bodyFat + "%" : "nao informada"}
- Idade: ${profile.age || "nao informada"}
- Objetivo: ${profile.goal || "nao informado"}
- Genero: ${profile.gender || "nao informado"}` : "Sem dados de perfil cadastrados."}

## Plano Ativo
${activePlan.length > 0 ? `Tem um plano ativo chamado "${activePlan[0].name}"` : "Nao tem plano de treino ativo."}
Total de planos: ${existingPlans.length}

## Instrucoes para criar plano
Quando o usuario quiser criar um plano, colete:
1. Objetivo do treino
2. Quantos dias por semana pode treinar
3. Se tem restricoes fisicas ou lesoes

Depois responda com o plano em formato JSON na seguinte estrutura (dentro de um bloco de codigo com a tag WORKOUT_PLAN):

\`\`\`WORKOUT_PLAN
{
  "name": "Nome do Plano",
  "workoutDays": [
    { "weekDay": "MONDAY", "name": "Superiores", "isRest": false, "estimatedDurationInSeconds": 3600, "exercises": [
      { "order": 1, "name": "Supino Reto", "sets": 3, "reps": 12, "restTimeInSeconds": 60 }
    ]},
    { "weekDay": "TUESDAY", "name": "Descanso", "isRest": true, "estimatedDurationInSeconds": 0, "exercises": [] }
  ]
}
\`\`\`

Sempre inclua todos os 7 dias (MONDAY a SUNDAY). Dias de descanso tem isRest: true e exercises: [].`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m: any) => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 2000,
      });

      const reply = response.choices[0]?.message?.content || "Desculpe, nao consegui processar.";

      const planMatch = reply.match(/```WORKOUT_PLAN\n([\s\S]*?)```/);
      let savedPlan = null;
      if (planMatch) {
        try {
          const planData = JSON.parse(planMatch[1]);
          await db.update(workoutPlans).set({ isActive: false }).where(eq(workoutPlans.userId, userId));
          const [plan] = await db.insert(workoutPlans).values({ userId, name: planData.name, isActive: true }).returning();
          const orderedWeekDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
          const sortedDays = [...planData.workoutDays].sort((a: any, b: any) => orderedWeekDays.indexOf(a.weekDay) - orderedWeekDays.indexOf(b.weekDay));
          for (const day of sortedDays) {
            const [createdDay] = await db.insert(workoutDays).values({
              workoutPlanId: plan.id, name: day.name, weekDay: day.weekDay,
              isRest: day.isRest || false, estimatedDurationInSeconds: day.estimatedDurationInSeconds || 0,
            }).returning();
            if (!day.isRest && day.exercises?.length) {
              for (const ex of day.exercises) {
                await db.insert(workoutExercises).values({
                  workoutDayId: createdDay.id, name: ex.name, order: ex.order || 0,
                  sets: ex.sets, reps: ex.reps, restTimeInSeconds: ex.restTimeInSeconds || 60,
                });
              }
            }
          }
          savedPlan = { id: plan.id, name: plan.name };
        } catch (e) {
          console.error("Failed to parse/save workout plan:", e);
        }
      }

      const cleanReply = reply.replace(/```WORKOUT_PLAN[\s\S]*?```/g, savedPlan ? `Plano "${savedPlan.name}" criado e salvo com sucesso!` : "").trim();
      res.json({ reply: cleanReply, savedPlan });
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ message: "Failed to process AI request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
