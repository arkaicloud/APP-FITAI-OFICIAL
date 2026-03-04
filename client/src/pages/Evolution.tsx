import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { BottomNav } from "@/components/BottomNav";
import { Flame, CheckCircle2, Target, Timer } from "lucide-react";
import type { WorkoutLog } from "@shared/schema";

const WEEKS = 20;
const DAYS = 7;

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return date;
}

function buildHeatmap(logs: WorkoutLog[]) {
  const logMap: Record<string, number> = {};
  for (const log of logs) {
    const existing = logMap[log.workoutDate] ?? 0;
    const val = log.status === "completed" ? 2 : 1;
    if (val > existing) logMap[log.workoutDate] = val;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thisMonday = getMonday(today);
  const firstMonday = addDays(thisMonday, -(WEEKS - 1) * 7);

  const grid: number[][] = [];
  for (let r = 0; r < DAYS; r++) {
    const row: number[] = [];
    for (let c = 0; c < WEEKS; c++) {
      const cellDate = addDays(firstMonday, c * 7 + r);
      if (cellDate > today) {
        row.push(-1);
      } else {
        row.push(logMap[toDateStr(cellDate)] ?? 0);
      }
    }
    grid.push(row);
  }

  const monthLabels: { label: string; col: number }[] = [];
  const seen = new Set<string>();
  for (let c = 0; c < WEEKS; c++) {
    const weekDate = addDays(firstMonday, c * 7);
    const monthKey = `${weekDate.getFullYear()}-${weekDate.getMonth()}`;
    if (!seen.has(monthKey)) {
      seen.add(monthKey);
      const label = weekDate.toLocaleDateString("pt-BR", { month: "short" });
      monthLabels.push({ label: label.replace(".", ""), col: c });
    }
  }

  return { grid, firstMonday, monthLabels };
}

function calcStats(logs: WorkoutLog[]) {
  const completed = logs.filter((l) => l.status === "completed");
  const started = logs.filter((l) => l.status === "started");
  const totalCompleted = completed.length;
  const total = logs.length;
  const completionRate = total > 0 ? Math.round((totalCompleted / total) * 100) : 0;
  const totalMinutes = completed.reduce((acc, l) => acc + (l.durationMinutes ?? 0), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const totalTime = totalMinutes > 0 ? `${hours}h${mins > 0 ? `${mins}m` : ""}` : "0h";

  const completedDates = new Set(completed.map((l) => l.workoutDate));
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 365; i++) {
    const d = addDays(today, -i);
    if (completedDates.has(toDateStr(d))) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return { totalCompleted, completionRate, totalTime, streak };
}

export function Evolution() {
  const { isAuthenticated } = useAuth();

  const { data: logs = [], isLoading } = useQuery<WorkoutLog[]>({
    queryKey: ["/api/workouts/history"],
    enabled: isAuthenticated,
  });

  const { grid, monthLabels } = useMemo(() => buildHeatmap(logs), [logs]);
  const { totalCompleted, completionRate, totalTime, streak } = useMemo(() => calcStats(logs), [logs]);

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[430px] mx-auto" data-testid="evolution-page">
      <div className="p-5 pt-12">
        <p className="font-bold text-lg tracking-wide" data-testid="text-logo">FIT.AI</p>
      </div>

      <div className="px-5 pb-24">
        <div
          className="rounded-2xl p-6 mb-6 relative overflow-hidden h-[160px] flex flex-col items-center justify-center"
          style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #e74c3c 50%, #f39c12 100%)" }}
        >
          <Flame className="w-10 h-10 text-orange-400 mb-2" />
          <h2 className="text-white text-5xl font-bold" data-testid="text-streak-days">
            {streak} {streak === 1 ? "dia" : "dias"}
          </h2>
          <p className="text-white/70 text-sm mt-1">Sequência Atual</p>
        </div>

        <h3 className="font-semibold text-base mb-3" data-testid="text-consistencia">Consistência</h3>

        <div className="bg-gray-50 rounded-2xl p-4 mb-6 overflow-x-auto">
          <div className="relative mb-2 min-w-[280px]" style={{ height: "16px" }}>
            {monthLabels.map(({ label, col }) => (
              <span
                key={label + col}
                className="absolute text-xs text-gray-500 font-medium capitalize"
                style={{ left: `${(col / WEEKS) * 100}%` }}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="space-y-1 min-w-[280px]">
            {grid.map((row, ri) => (
              <div key={ri} className="flex gap-1">
                {row.map((val, ci) => (
                  <div
                    key={ci}
                    data-testid={`heatmap-cell-${ri}-${ci}`}
                    className={`w-3 h-3 rounded-sm flex-shrink-0 ${
                      val === -1
                        ? "bg-transparent"
                        : val === 2
                          ? "bg-[#2b54ff]"
                          : val === 1
                            ? "bg-[#a8bcff]"
                            : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>

          {isLoading && (
            <p className="text-xs text-gray-400 mt-3 text-center">Carregando histórico...</p>
          )}

          <div className="flex items-center gap-3 mt-3 justify-end">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-[#2b54ff]" />
              <span className="text-xs text-gray-500">Concluído</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-[#a8bcff]" />
              <span className="text-xs text-gray-500">Iniciado</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-gray-200" />
              <span className="text-xs text-gray-500">Sem treino</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-gray-50 rounded-2xl p-5 flex flex-col items-center">
            <CheckCircle2 className="w-6 h-6 text-[#2b54ff] mb-2" />
            <span className="text-3xl font-bold" data-testid="text-treinos-feitos">{totalCompleted}</span>
            <span className="text-xs text-gray-500 mt-1">Treinos Feitos</span>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 flex flex-col items-center">
            <Target className="w-6 h-6 text-[#2b54ff] mb-2" />
            <span className="text-3xl font-bold" data-testid="text-taxa-conclusao">{completionRate}%</span>
            <span className="text-xs text-gray-500 mt-1">Taxa de conclusão</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 flex flex-col items-center">
          <Timer className="w-6 h-6 text-[#2b54ff] mb-2" />
          <span className="text-3xl font-bold" data-testid="text-tempo-total">{totalTime}</span>
          <span className="text-xs text-gray-500 mt-1">Tempo Total</span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
