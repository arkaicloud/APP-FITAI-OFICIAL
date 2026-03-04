import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { BottomNav } from "@/components/BottomNav";
import { CoachAIChat } from "@/components/CoachAIChat";
import { Clock, Dumbbell, Zap, Calendar, Plus } from "lucide-react";
import { getWorkoutImage } from "@/lib/workoutImages";
import type { UserProfile } from "@shared/schema";
import { useState } from "react";

const WEEKDAY_PT: Record<string, string> = {
  MONDAY: "SEGUNDA", TUESDAY: "TERCA", WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA", FRIDAY: "SEXTA", SATURDAY: "SABADO", SUNDAY: "DOMINGO",
};

interface Exercise { id: string; name: string; sets: number; reps: number; restTimeInSeconds: number; order: number; }
interface WorkoutDayFull { id: string; name: string; weekDay: string; isRest: boolean; estimatedDurationInSeconds: number; coverImageUrl?: string; exercises: Exercise[]; }
interface WorkoutPlanFull { id: string; name: string; isActive: boolean; workoutDays: WorkoutDayFull[]; }

const ORDERED_WEEKDAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

export function TrainingPlan() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);

  const { data: profile } = useQuery<UserProfile>({ queryKey: ["/api/profile"], enabled: isAuthenticated });
  const { data: plans = [], isLoading } = useQuery<WorkoutPlanFull[]>({ queryKey: ["/api/workout-plans"], enabled: isAuthenticated });

  const gender = profile?.gender;
  const activePlan = plans.find(p => p.isActive) || plans[0];

  const sortedDays = activePlan
    ? [...activePlan.workoutDays].sort((a, b) => ORDERED_WEEKDAYS.indexOf(a.weekDay) - ORDERED_WEEKDAYS.indexOf(b.weekDay))
    : [];

  const heroBg = getWorkoutImage("Superiores", gender, 2);

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[430px] mx-auto" data-testid="training-plan-page">
      <div className="relative h-[200px] w-full overflow-hidden bg-gray-100">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})`, filter: "grayscale(30%) brightness(0.4)" }} />
        <div className="relative z-10 p-5 pt-12 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="font-bold text-white text-lg tracking-wide" data-testid="text-logo">FIT.AI</p>
            <Calendar className="w-5 h-5 text-white opacity-80" />
          </div>
          <div>
            {activePlan && (
              <div className="inline-flex items-center gap-1 bg-[#2b54ff] text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
                {activePlan.name}
              </div>
            )}
            <h1 className="text-2xl font-bold text-white" data-testid="text-plano-treino">Plano de Treino</h1>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 pb-24 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-[#2b54ff] border-t-transparent rounded-full" />
          </div>
        ) : !activePlan ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Dumbbell className="w-14 h-14 text-gray-200" />
            <p className="text-gray-500 text-sm text-center">Nenhum plano de treino criado ainda.</p>
            <button
              data-testid="button-criar-plano"
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-2 bg-[#2b54ff] text-white text-sm font-semibold px-5 py-3 rounded-full"
            >
              <Plus className="w-4 h-4" />
              Criar com o Coach AI
            </button>
          </div>
        ) : (
          sortedDays.map((day, index) => (
            <button
              key={day.id}
              data-testid={`card-day-${day.id}`}
              onClick={() => !day.isRest && setLocation(`/dia/${day.id}`)}
              className={`w-full rounded-2xl overflow-hidden text-left ${day.isRest ? "bg-gray-50 cursor-default" : "bg-black"}`}
            >
              {day.isRest ? (
                <div className="p-5 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-gray-200 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600">
                    <Calendar className="w-3 h-3" />
                    {WEEKDAY_PT[day.weekDay] || day.weekDay}
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-gray-400" />
                    <span className="text-xl font-bold text-gray-800">Descanso</span>
                  </div>
                </div>
              ) : (
                <div className="relative h-[140px]">
                  <div className="absolute inset-0 bg-cover bg-center opacity-55" style={{ backgroundImage: `url(${getWorkoutImage(day.name, gender, index)})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1 w-fit">
                      <Calendar className="w-3 h-3 text-white" />
                      <span className="text-white text-xs font-medium">{WEEKDAY_PT[day.weekDay] || day.weekDay}</span>
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-bold" data-testid={`text-day-name-${day.id}`}>{day.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-300" />
                          <span className="text-gray-300 text-xs">{day.estimatedDurationInSeconds ? Math.round(day.estimatedDurationInSeconds / 60) + "min" : "45min"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Dumbbell className="w-3.5 h-3.5 text-gray-300" />
                          <span className="text-gray-300 text-xs">{day.exercises.length} exercicios</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </button>
          ))
        )}
      </div>

      <CoachAIChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <BottomNav />
    </div>
  );
}
