import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { BottomNav } from "@/components/BottomNav";
import { CoachAIChat } from "@/components/CoachAIChat";
import { ChevronLeft, Clock, Dumbbell, HelpCircle, Calendar } from "lucide-react";
const loginBg = "/figmaAssets/login.png";

const dayNames: Record<string, { label: string; tag: string; muscle: string }> = {
  segunda: { label: "Segunda", tag: "SEGUNDA", muscle: "Inferiores" },
  terca: { label: "Terça", tag: "TERÇA", muscle: "Superiores" },
  quinta: { label: "Quinta", tag: "QUINTA", muscle: "Inferiores" },
  sexta: { label: "Sexta", tag: "SEXTA", muscle: "Superiores" },
};

const exercises = [
  { id: 1, name: "Supino Inclinado", series: 3, reps: 12, rest: 60 },
  { id: 2, name: "Supino Reto", series: 3, reps: 12, rest: 60 },
  { id: 3, name: "Crucifixo", series: 3, reps: 12, rest: 60 },
  { id: 4, name: "Desenvolvimento", series: 3, reps: 12, rest: 60 },
  { id: 5, name: "Elevação Lateral", series: 3, reps: 12, rest: 60 },
];

export function DayWorkout() {
  const [, setLocation] = useLocation();
  const params = useParams<{ day: string }>();
  const [chatOpen, setChatOpen] = useState(false);
  const day = dayNames[params.day || "segunda"] || dayNames.segunda;

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[430px] mx-auto" data-testid="day-workout-page">
      <div className="flex items-center justify-between px-4 py-3 pt-12">
        <button data-testid="button-back" onClick={() => setLocation("/plano")} className="p-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-semibold text-lg" data-testid="text-page-title">{day.label}</h1>
        <div className="w-6" />
      </div>

      <div className="px-5 pb-24">
        <div className="rounded-2xl overflow-hidden bg-black relative h-[180px] mb-4">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{ backgroundImage: `url(${loginBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="relative z-10 p-5 h-full flex flex-col justify-between">
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 w-fit">
              <Calendar className="w-3.5 h-3.5 text-white" />
              <span className="text-white text-xs font-medium">{day.tag}</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-white text-2xl font-bold" data-testid="text-muscle-group">{day.muscle}</h3>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-300" />
                    <span className="text-gray-300 text-xs">45min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Dumbbell className="w-3.5 h-3.5 text-gray-300" />
                    <span className="text-gray-300 text-xs">4 exercícios</span>
                  </div>
                </div>
              </div>
              <button
                data-testid="button-iniciar-treino"
                onClick={() => setLocation("/treino-hoje")}
                className="px-4 py-2 bg-[#2b54ff] text-white text-sm font-semibold rounded-full"
              >
                Iniciar Treino
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-0 divide-y divide-gray-100">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              data-testid={`exercise-card-${ex.id}`}
              className="flex items-center justify-between py-4"
            >
              <div>
                <p className="font-medium text-base">{ex.name}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium">
                    {ex.series} SÉRIES
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium">
                    {ex.reps} REPS
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-0.5">
                    {ex.rest}S
                  </span>
                </div>
              </div>
              <button
                data-testid={`button-help-${ex.id}`}
                onClick={() => setChatOpen(true)}
                className="p-1 text-gray-400"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <CoachAIChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <BottomNav />
    </div>
  );
}
