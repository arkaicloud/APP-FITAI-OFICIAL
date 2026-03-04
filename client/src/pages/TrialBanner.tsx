import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Crown, Check, Sparkles } from "lucide-react";

export function TrialBanner() {
  const [, setLocation] = useLocation();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [isLoading, isAuthenticated]);

  const { data: trialStatus } = useQuery<{
    isTrialActive: boolean;
    daysRemaining: number;
    isSubscribed: boolean;
  }>({
    queryKey: ["/api/trial-status"],
    enabled: isAuthenticated,
  });

  const daysRemaining = trialStatus?.daysRemaining ?? 7;

  const features = [
    "Plano de treino personalizado com IA",
    "Coach AI disponivel 24h",
    "Estatisticas detalhadas de evolucao",
    "Acompanhamento de consistencia",
    "Suporte prioritario",
  ];

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin w-8 h-8 border-2 border-[#2b54ff] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[430px] mx-auto" data-testid="trial-banner-page">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-16 h-16 rounded-full bg-[#2b54ff] flex items-center justify-center mb-6">
          <Crown className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-2" data-testid="text-trial-title">
          Experimente Gratis por {daysRemaining} dias!
        </h1>

        <p className="text-gray-500 text-center text-sm mb-8 leading-relaxed max-w-[300px]">
          Aproveite todos os recursos premium do FIT.AI. Apos o periodo de teste, o plano custa apenas:
        </p>

        <div className="bg-gradient-to-br from-[#2b54ff] to-[#1a3ad4] rounded-2xl p-6 w-full mb-8 text-center">
          <p className="text-white/70 text-sm mb-1">Plano Premium</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-white text-4xl font-bold" data-testid="text-price">R$ 17</span>
            <span className="text-white/70 text-sm">/mes</span>
          </div>
        </div>

        <div className="w-full space-y-3 mb-8">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3" data-testid={`feature-item-${i}`}>
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        <button
          data-testid="button-start-trial"
          onClick={() => setLocation("/home")}
          className="w-full py-4 bg-[#2b54ff] text-white font-semibold rounded-full text-sm flex items-center justify-center gap-2 mb-3"
        >
          <Sparkles className="w-4 h-4" />
          Comecar teste gratis
        </button>

        <button
          data-testid="button-skip-trial"
          onClick={() => setLocation("/home")}
          className="text-gray-400 text-sm py-2"
        >
          Continuar sem premium
        </button>
      </div>
    </div>
  );
}
