import { BottomNav } from "@/components/BottomNav";
import { Flame, CheckCircle2, Target, Timer } from "lucide-react";

const months = ["Jan", "Fev", "Mar", "Abril", "Maio"];

function generateHeatmap() {
  const rows = 7;
  const cols = months.length * 5;
  const data: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      row.push(Math.random() > 0.35 ? (Math.random() > 0.5 ? 2 : 1) : 0);
    }
    data.push(row);
  }
  return data;
}

const heatmapData = generateHeatmap();

export function Evolution() {
  const streakDays = 15;

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[430px] mx-auto" data-testid="evolution-page">
      <div className="p-5 pt-12">
        <p className="font-bold text-lg tracking-wide" data-testid="text-logo">FIT.AI</p>
      </div>

      <div className="px-5 pb-24">
        <div
          className="rounded-2xl p-6 mb-6 relative overflow-hidden h-[160px] flex flex-col items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #e74c3c 50%, #f39c12 100%)",
          }}
        >
          <Flame className="w-10 h-10 text-orange-400 mb-2" />
          <h2 className="text-white text-5xl font-bold" data-testid="text-streak-days">
            {streakDays} dias
          </h2>
          <p className="text-white/70 text-sm mt-1">Sequência Atual</p>
        </div>

        <h3 className="font-semibold text-base mb-3" data-testid="text-consistencia">Consistência</h3>

        <div className="bg-gray-50 rounded-2xl p-4 mb-6 overflow-x-auto">
          <div className="flex gap-6 mb-3 min-w-[300px]">
            {months.map((m) => (
              <span key={m} className="text-xs text-gray-500 font-medium">{m}</span>
            ))}
          </div>
          <div className="space-y-1 min-w-[300px]">
            {heatmapData.map((row, ri) => (
              <div key={ri} className="flex gap-1">
                {row.map((val, ci) => (
                  <div
                    key={ci}
                    data-testid={`heatmap-cell-${ri}-${ci}`}
                    className={`w-3 h-3 rounded-sm ${
                      val === 2
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
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-gray-50 rounded-2xl p-5 flex flex-col items-center">
            <CheckCircle2 className="w-6 h-6 text-[#2b54ff] mb-2" />
            <span className="text-3xl font-bold" data-testid="text-treinos-feitos">135</span>
            <span className="text-xs text-gray-500 mt-1">Treinos Feitos</span>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 flex flex-col items-center">
            <Target className="w-6 h-6 text-[#2b54ff] mb-2" />
            <span className="text-3xl font-bold" data-testid="text-taxa-conclusao">64%</span>
            <span className="text-xs text-gray-500 mt-1">Taxa de conclusão</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 flex flex-col items-center">
          <Timer className="w-6 h-6 text-[#2b54ff] mb-2" />
          <span className="text-3xl font-bold" data-testid="text-tempo-total">115h40m</span>
          <span className="text-xs text-gray-500 mt-1">Tempo Total</span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
