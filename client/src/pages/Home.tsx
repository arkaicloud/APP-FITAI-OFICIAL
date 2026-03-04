import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { BottomNav } from "@/components/BottomNav";
import { CoachAIChat } from "@/components/CoachAIChat";
import { Clock, Dumbbell, Flame, Calendar, Moon } from "lucide-react";
import { getWorkoutImage } from "@/lib/workoutImages";
import type { UserProfile, WorkoutLog } from "@shared/schema";

const WEEKDAY_LABELS: Record<string, string> = {
  MONDAY: "S", TUESDAY: "T", WEDNESDAY: "Q",
  THURSDAY: "Q", FRIDAY: "S", SATURDAY: "S", SUNDAY: "D",
};

const ALL_WEEK_DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

function toDateStr(d: Date): string { return d.toISOString().slice(0, 10); }
function addDays(d: Date, n: number): Date { const r = new Date(d); r.setDate(r.getDate() + n); return r; }

function getWeekDates() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = today.getDay();
  const monday = addDays(today, day === 0 ? -6 : 1 - day);
  return ALL_WEEK_DAYS.map((wd, i) => ({ weekDay: wd, date: toDateStr(addDays(monday, i)), label: WEEKDAY_LABELS[wd] }));
}

interface TodayData {
  planId: string;
  planName: string;
  day: {
    id: string;
    name: string;
    isRest: boolean;
    estimatedDurationInSeconds: number;
    weekDay: string;
    exercises: { id: string; name: string; sets: number; reps: number }[];
  };
  session: { id: string; startedAt: string; completedAt: string | null } | null;
}

export function Home() {
  const [, setLocation] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
    enabled: isAuthenticated,
  });

  const { data: todayData } = useQuery<TodayData | null>({
    queryKey: ["/api/workout-plans/today"],
    enabled: isAuthenticated,
  });

  const { data: logs = [] } = useQuery<WorkoutLog[]>({
    queryKey: ["/api/workouts/history"],
    enabled: isAuthenticated,
  });

  if (!isLoading && !isAuthenticated) { setLocation("/"); return null; }

  const firstName = user?.firstName || "Atleta";
  const gender = profile?.gender;

  const workoutName = todayData?.day?.name || "Superiores";
  const heroBg = getWorkoutImage(workoutName, gender, 0);
  const cardBg = getWorkoutImage(workoutName, gender, 1);

  const logMap: Record<string, number> = {};
  for (const log of logs) {
    const val = log.status === "completed" ? 2 : 1;
    if ((logMap[log.workoutDate] ?? 0) < val) logMap[log.workoutDate] = val;
  }

  const weekDates = getWeekDates();

  const completedDates = new Set(logs.filter(l => l.status === "completed").map(l => l.workoutDate));
  let streak = 0;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 365; i++) {
    const d = addDays(today, -i);
    if (completedDates.has(toDateStr(d))) { streak++; } else if (i > 0) { break; }
  }

  const durationMin = todayData?.day?.estimatedDurationInSeconds ? Math.round(todayData.day.estimatedDurationInSeconds / 60) : 45;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin w-8 h-8 border-2 border-[#2b54ff] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[430px] mx-auto" data-testid="home-page">
      <div className="relative h-[340px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})`, filter: "brightness(0.45)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        <div className="relative z-10 p-5 pt-12">
          <p className="font-bold text-white text-lg tracking-wide" data-testid="text-logo">FIT.AI</p>
        </div>
        <div className="relative z-10 flex items-end justify-between gap-4 px-5 pb-6 mt-auto" style={{ marginTop: "120px" }}>
          <div>
            <h1 className="text-white text-2xl font-bold" data-testid="text-greeting">Ola, {firstName}</h1>
            <p className="text-gray-300 text-sm mt-1">Bora treinar hoje?</p>
          </div>
          <button
            data-testid="button-bora"
            onClick={() => setLocation("/treino-hoje")}
            className="px-5 py-2 bg-[#2b54ff] text-white text-sm font-semibold rounded-full"
          >
            Bora!
          </button>
        </div>
      </div>

      <div className="px-5 py-6 flex-1 pb-24">
        <div className="flex items-center justify-between gap-4 mb-3">
          <h2 className="font-semibold text-base" data-testid="text-consistencia">Consistencia</h2>
          <button data-testid="link-ver-historico" onClick={() => setLocation("/evolucao")} className="text-[#2b54ff] text-sm font-medium">
            Ver historico
          </button>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 mb-6">
          <div className="flex gap-2 flex-1">
            {weekDates.map((d, i) => {
              const val = logMap[d.date] ?? 0;
              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div
                    data-testid={`day-indicator-${i}`}
                    className={`w-8 h-8 rounded-lg ${val === 2 ? "bg-[#2b54ff]" : val === 1 ? "bg-[#a8bcff]" : "bg-white border border-gray-200"}`}
                  />
                  <span className="text-xs text-gray-500">{d.label}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-1 bg-white rounded-xl px-3 py-2 shadow-sm">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-lg" data-testid="text-streak">{streak}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mb-3">
          <h2 className="font-semibold text-base" data-testid="text-treino-hoje">Treino de Hoje</h2>
          <button data-testid="link-ver-treinos" onClick={() => setLocation("/plano")} className="text-[#2b54ff] text-sm font-medium">
            Ver treinos
          </button>
        </div>

        {!todayData ? (
          <button
            data-testid="card-sem-plano"
            onClick={() => setChatOpen(true)}
            className="w-full rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center gap-3"
          >
            <Dumbbell className="w-10 h-10 text-gray-300" />
            <p className="text-gray-500 text-sm font-medium">Nenhum plano ativo</p>
            <p className="text-[#2b54ff] text-sm font-semibold">Criar plano com o Coach AI</p>
          </button>
        ) : todayData.day.isRest ? (
          <div data-testid="card-descanso" className="w-full rounded-2xl bg-gray-50 p-8 flex flex-col items-center justify-center gap-3">
            <Moon className="w-10 h-10 text-gray-300" />
            <p className="text-gray-800 text-lg font-bold">Dia de Descanso</p>
            <p className="text-gray-400 text-sm">Recupere-se para o proximo treino</p>
          </div>
        ) : (
          <button
            data-testid="card-treino-hoje"
            onClick={() => setLocation("/treino-hoje")}
            className="w-full rounded-2xl overflow-hidden bg-black relative h-[200px] text-left"
          >
            <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${cardBg})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="relative z-10 p-5 h-full flex flex-col justify-between">
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 w-fit">
                <Calendar className="w-3.5 h-3.5 text-white" />
                <span className="text-white text-xs font-medium">{todayData.day.weekDay}</span>
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold" data-testid="text-workout-name">{todayData.day.name}</h3>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-300" />
                    <span className="text-gray-300 text-xs">{durationMin}min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Dumbbell className="w-3.5 h-3.5 text-gray-300" />
                    <span className="text-gray-300 text-xs">{todayData.day.exercises.length} exercicios</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        )}
      </div>

      <CoachAIChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <BottomNav />
    </div>
  );
}
