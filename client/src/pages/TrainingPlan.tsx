import { useLocation } from "wouter";
import { BottomNav } from "@/components/BottomNav";
import { Clock, Dumbbell, Zap, Calendar } from "lucide-react";
const loginBg = "/figmaAssets/login.png";

interface WorkoutDay {
  id: string;
  dayLabel: string;
  dayTag: string;
  name: string;
  duration: string;
  exercises: number;
  isRest: boolean;
  image?: boolean;
}

const trainingDays: WorkoutDay[] = [
  { id: "segunda", dayLabel: "Segunda", dayTag: "SEGUNDA", name: "Inferiores", duration: "45min", exercises: 4, isRest: false, image: true },
  { id: "terca", dayLabel: "Terça", dayTag: "TERÇA", name: "Superiores", duration: "45min", exercises: 4, isRest: false, image: true },
  { id: "quarta", dayLabel: "Quarta", dayTag: "QUARTA", name: "Descanso", duration: "", exercises: 0, isRest: true },
  { id: "quinta", dayLabel: "Quinta", dayTag: "QUINTA", name: "Inferiores", duration: "45min", exercises: 4, isRest: false, image: true },
  { id: "sexta", dayLabel: "Sexta", dayTag: "SEXTA", name: "Superiores", duration: "45min", exercises: 4, isRest: false, image: true },
  { id: "sabado", dayLabel: "Sábado", dayTag: "SÁBADO", name: "Descanso", duration: "", exercises: 0, isRest: true },
  { id: "domingo", dayLabel: "Domingo", dayTag: "DOMINGO", name: "Descanso", duration: "", exercises: 0, isRest: true },
];

export function TrainingPlan() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[430px] mx-auto" data-testid="training-plan-page">
      <div className="relative h-[200px] w-full overflow-hidden bg-gray-100">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${loginBg})`, filter: "grayscale(100%)" }}
        />
        <div className="relative z-10 p-5 pt-12 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="font-bold text-black text-lg tracking-wide" data-testid="text-logo">FIT.AI</p>
            <Calendar className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 bg-[#2b54ff] text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
              HIPERTROFIA & FORÇA
            </div>
            <h1 className="text-2xl font-bold text-black" data-testid="text-plano-treino">Plano de Treino</h1>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 pb-24 space-y-3">
        {trainingDays.map((day) => (
          <button
            key={day.id}
            data-testid={`card-day-${day.id}`}
            onClick={() => !day.isRest && setLocation(`/dia/${day.id}`)}
            className={`w-full rounded-2xl overflow-hidden text-left ${
              day.isRest ? "bg-gray-50 cursor-default" : "bg-black"
            }`}
          >
            {day.isRest ? (
              <div className="p-5 flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-gray-200 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600">
                  <Calendar className="w-3 h-3" />
                  {day.dayTag}
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-gray-400" />
                  <span className="text-xl font-bold text-gray-800">Descanso</span>
                </div>
              </div>
            ) : (
              <div className="relative h-[140px]">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-50"
                  style={{ backgroundImage: `url(${loginBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1 w-fit">
                    <Calendar className="w-3 h-3 text-white" />
                    <span className="text-white text-xs font-medium">{day.dayTag}</span>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold" data-testid={`text-day-name-${day.id}`}>
                      {day.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-300" />
                        <span className="text-gray-300 text-xs">{day.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Dumbbell className="w-3.5 h-3.5 text-gray-300" />
                        <span className="text-gray-300 text-xs">{day.exercises} exercícios</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
