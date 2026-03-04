import { useState } from "react";
import { useLocation } from "wouter";
import { BottomNav } from "@/components/BottomNav";
import { CoachAIChat } from "@/components/CoachAIChat";
import { Clock, Dumbbell, Flame, Calendar } from "lucide-react";
const loginBg = "/figmaAssets/login.png";

const weekDays = [
  { label: "S", done: true, intensity: "high" },
  { label: "T", done: true, intensity: "high" },
  { label: "Q", done: true, intensity: "low" },
  { label: "Q", done: false, intensity: "none" },
  { label: "S", done: false, intensity: "none" },
  { label: "S", done: false, intensity: "none" },
  { label: "D", done: false, intensity: "none" },
];

export function Home() {
  const [, setLocation] = useLocation();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[430px] mx-auto" data-testid="home-page">
      <div className="relative h-[340px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${loginBg})`, filter: "grayscale(100%) brightness(0.4)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        <div className="relative z-10 p-5 pt-12">
          <p className="font-bold text-white text-lg tracking-wide" data-testid="text-logo">FIT.AI</p>
        </div>
        <div className="relative z-10 flex items-end justify-between gap-4 px-5 pb-6 mt-auto" style={{ marginTop: "120px" }}>
          <div>
            <h1 className="text-white text-2xl font-bold" data-testid="text-greeting">Olá, Paulo</h1>
            <p className="text-gray-300 text-sm mt-1">Bora treinar hoje?</p>
          </div>
          <button
            data-testid="button-bora"
            onClick={() => setLocation("/treino-hoje")}
            className="px-5 py-2 bg-[#2b54ff] text-white text-sm font-semibold rounded-full transition-colors"
          >
            Bora!
          </button>
        </div>
      </div>

      <div className="px-5 py-6 flex-1 pb-24">
        <div className="flex items-center justify-between gap-4 mb-3">
          <h2 className="font-semibold text-base" data-testid="text-consistencia">Consistência</h2>
          <button
            data-testid="link-ver-historico"
            onClick={() => setLocation("/evolucao")}
            className="text-[#2b54ff] text-sm font-medium"
          >
            Ver histórico
          </button>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 mb-6">
          <div className="flex gap-2 flex-1">
            {weekDays.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  data-testid={`day-indicator-${i}`}
                  className={`w-8 h-8 rounded-lg ${
                    day.intensity === "high"
                      ? "bg-[#2b54ff]"
                      : day.intensity === "low"
                        ? "bg-[#a8bcff]"
                        : "bg-white border border-gray-200"
                  }`}
                />
                <span className="text-xs text-gray-500">{day.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-white rounded-xl px-3 py-2 shadow-sm">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-lg" data-testid="text-streak">15</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mb-3">
          <h2 className="font-semibold text-base" data-testid="text-treino-hoje">Treino de Hoje</h2>
          <button
            data-testid="link-ver-treinos"
            onClick={() => setLocation("/plano")}
            className="text-[#2b54ff] text-sm font-medium"
          >
            Ver treinos
          </button>
        </div>

        <button
          data-testid="card-treino-hoje"
          onClick={() => setLocation("/treino-hoje")}
          className="w-full rounded-2xl overflow-hidden bg-black relative h-[200px] text-left"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: `url(${loginBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="relative z-10 p-5 h-full flex flex-col justify-between">
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 w-fit">
              <Calendar className="w-3.5 h-3.5 text-white" />
              <span className="text-white text-xs font-medium">SEXTA</span>
            </div>
            <div>
              <h3 className="text-white text-2xl font-bold" data-testid="text-workout-name">Superiores</h3>
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
          </div>
        </button>
      </div>

      <CoachAIChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <BottomNav />
    </div>
  );
}
