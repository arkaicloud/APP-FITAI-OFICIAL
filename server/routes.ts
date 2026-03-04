import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { db } from "./db";
import { userProfiles } from "@shared/schema";
import { eq } from "drizzle-orm";

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
      const { weight, height, bodyFat, age, goal } = req.body;

      const [existing] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));

      if (existing) {
        const [updated] = await db
          .update(userProfiles)
          .set({ weight, height, bodyFat, age, goal, onboardingCompleted: true })
          .where(eq(userProfiles.userId, userId))
          .returning();
        res.json(updated);
      } else {
        const [created] = await db
          .insert(userProfiles)
          .values({
            userId,
            weight,
            height,
            bodyFat,
            age,
            goal,
            onboardingCompleted: true,
            trialStartDate: new Date(),
            isSubscribed: false,
          })
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

      if (!profile) {
        res.json({ isTrialActive: true, daysRemaining: 7, isSubscribed: false });
        return;
      }

      if (profile.isSubscribed) {
        res.json({ isTrialActive: false, daysRemaining: 0, isSubscribed: true });
        return;
      }

      const trialStart = profile.trialStartDate || profile.createdAt || new Date();
      const daysSinceStart = Math.floor((Date.now() - new Date(trialStart).getTime()) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, 7 - daysSinceStart);

      res.json({
        isTrialActive: daysRemaining > 0,
        daysRemaining,
        isSubscribed: false,
      });
    } catch (error) {
      console.error("Error checking trial:", error);
      res.status(500).json({ message: "Failed to check trial status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
