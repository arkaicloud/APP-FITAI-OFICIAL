import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { BottomNav } from "@/components/BottomNav";
import { CoachAIChat } from "@/components/CoachAIChat";
import { ChevronLeft, Clock, Dumbbell, HelpCircle, Calendar, Moon } from "lucide-react";
import { getWorkoutImage } from "@/lib/workoutImages";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { UserProfile } from "@shared/schema";

interface TodayData {
  planId: string;
  planName: string;
  day: {
    id: string;
    name: string;
    isRest: boolean;
    estimatedDurationInSeconds: number;
    weekDay: string;
    exercises: { id: string; name: string; sets: number; reps: number; restTimeInSeconds: number; order: number }[];
  };
  session: { id: string; startedAt: string; completedAt: string | null } | null;
}

export function TodayWorkout() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const sessionStarted = useRef(false);

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
    enabled: isAuthenticated,
  });

  const { data: todayData, isLoading } = useQuery<TodayData | null>({
    queryKey: ["/api/workout-plans/today"],
    enabled: isAuthenticated,
  });

  const startSession = useMutation({
    mutationFn: (workoutDayId: string) => apiRequest("POST", "/api/workout-sessions", { workoutDayId }),
    onSuccess: async (res) => {
      const data = await res.json();
      sessionIdRef.current = data.id;
      queryClient.invalidateQueries({ queryKey: ["/api/workout-plans/today"] });
    },
  });

  const completeSession = useMutation({
    mutationFn: (sessionId: string) => apiRequest("PUT", `/api/workout-sessions/${sessionId}/complete`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workout-plans/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/workouts/history"] });
    },
  });

  const logWorkout = useMutation({
    mutationFn: (data: { workoutName: string; status: string; durationMinutes?: number }) =>
      apiRequest("POST", "/api/workouts/log", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts/history"] });
    },
  });

  useEffect(() => {
    if (!isAuthenticated || !todayData?.day || todayData.day.isRest || sessionStarted.current) return;
    sessionStarted.current = true;
    startTimeRef.current = Date.now();
    if (todayData.session) {
      sessionIdRef.current = todayData.session.id;
      if (todayData.session.completedAt) setCompleted(true);
    } else {
      startSession.mutate(todayData.day.id);
      logWorkout.mutate({ workoutName: todayData.day.name, status: "started" });
    }
  }, [isAuthenticated, todayData]);

  const handleComplete = () => {
    const durationMinutes = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000));
    setCompleted(true);
    if (sessionIdRef.current) completeSession.mutate(sessionIdRef.current);
    logWorkout.mutate({ workoutName: todayData?.day?.name || "Treino", status: "completed", durationMinutes });
  };

  const workoutName = todayData?.day?.name || "Superiores";
  const workoutBg = getWorkoutImage(workoutName, profile?.gender, 3);
  const durationMin = todayData?.day?.estimatedDurationInSeconds ? Math.round(todayData.day.estimatedDurationInSeconds / 60) : 45;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin w-8 h-8 border-2 border-[#2b54ff] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[430px] mx-auto" data-testid="today-workout-page">
      <div className="flex items-center justify-between px-4 py-3 pt-12">
        <button data-testid="button-back" onClick={() => setLocation("/home")} className="p-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-semibold text-lg" data-testid="text-page-title">Treino de Hoje</h1>
        <div className="w-6" />
      </div>

      <div className="px-5 pb-24">
        {(!todayData || todayData.day.isRest) ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Moon className="w-16 h-16 text-gray-200" />
            <p className="text-gray-800 text-xl font-bold">Dia de Descanso</p>
            <p className="text-gray-400 text-sm text-center">Aproveite para recuperar o corpo para o proximo treino.</p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl overflow-hidden bg-black relative h-[180px] mb-4">
              <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${workoutBg})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 w-fit">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                  <span className="text-white text-xs font-medium">{todayData.day.weekDay}</span>
                </div>
                <div>
                  <h3 className="text-white text-2xl font-bold" data-testid="text-workout-title">{todayData.day.name}</h3>
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
            </div>

            <div className="space-y-0 divide-y divide-gray-100">
              {todayData.day.exercises.map((ex, idx) => (
                <div key={ex.id} data-testid={`exercise-card-${ex.id}`} className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-base" data-testid={`text-exercise-name-${ex.id}`}>{ex.name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium">{ex.sets} SERIES</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium">{ex.reps} REPS</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium">{ex.restTimeInSeconds}S</span>
                    </div>
                  </div>
                  <button data-testid={`button-help-${ex.id}`} onClick={() => setChatOpen(true)} className="p-1 text-gray-400">
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              data-testid="button-mark-complete"
              onClick={handleComplete}
              disabled={completed}
              className={`w-full mt-6 py-4 rounded-xl text-center font-medium text-sm border ${
                completed ? "bg-green-50 border-green-200 text-green-700" : "bg-white border-gray-200 text-gray-800"
              }`}
            >
              {completed ? "Treino concluido!" : "Marcar como concluido"}
            </button>
          </>
        )}
      </div>

      <CoachAIChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <BottomNav />
    </div>
  );
}
