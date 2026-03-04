import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { ArrowUp, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

type OnboardingStep = "welcome" | "goal" | "gender" | "weight" | "height" | "age" | "bodyFat" | "done";

const goalOptions = [
  { label: "Hipertrofia & Forca", value: "hipertrofia" },
  { label: "Emagrecimento", value: "emagrecimento" },
  { label: "Condicionamento", value: "condicionamento" },
  { label: "Saude Geral", value: "saude" },
];

const genderOptions = [
  { label: "Masculino", value: "masculino" },
  { label: "Feminino", value: "feminino" },
];

export function Onboarding() {
  const [, setLocation] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [input, setInput] = useState("");
  const [profileData, setProfileData] = useState({ goal: "", gender: "", weight: 0, height: 0, age: 0, bodyFat: "" });
  const [saving, setSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [isLoading, isAuthenticated]);

  const firstName = user?.firstName || "Atleta";

  const addBotMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), text, isUser: false }]);
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), text, isUser: true }]);
  };

  useEffect(() => {
    if (initRef.current || !isAuthenticated) return;
    initRef.current = true;

    const msgs: string[] = [
      `Bem-vindo ao FIT.AI, ${firstName}!`,
      "O app que vai transformar a forma como voce treina. Aqui voce monta seu plano de treino personalizado, acompanha sua evolucao com estatisticas detalhadas e conta com uma IA disponivel 24h para te guiar em cada exercicio.",
      "Tudo pensado para voce alcancar seus objetivos de forma inteligente e consistente.",
      "Vamos configurar seu perfil? Qual e o seu objetivo principal?",
    ];

    msgs.forEach((msg, i) => {
      setTimeout(() => {
        addBotMessage(msg);
        if (i === msgs.length - 1) {
          setTimeout(() => setStep("goal"), 300);
        }
      }, (i + 1) * 700);
    });
  }, [firstName, isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, step]);

  const handleGoalSelect = (goal: typeof goalOptions[0]) => {
    addUserMessage(goal.label);
    setProfileData((prev) => ({ ...prev, goal: goal.value }));
    setTimeout(() => {
      addBotMessage("Qual e o seu sexo biologico? Isso nos ajuda a personalizar as imagens e os treinos para voce.");
      setStep("gender");
    }, 500);
  };

  const handleGenderSelect = (gender: typeof genderOptions[0]) => {
    addUserMessage(gender.label);
    setProfileData((prev) => ({ ...prev, gender: gender.value }));
    setTimeout(() => {
      addBotMessage("Qual e o seu peso atual? (em kg)");
      setStep("weight");
    }, 500);
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    const value = input.trim();
    addUserMessage(value);
    setInput("");

    if (step === "weight") {
      const w = parseFloat(value.replace(",", "."));
      if (isNaN(w)) {
        setTimeout(() => addBotMessage("Por favor, informe um numero valido para o peso."), 300);
        return;
      }
      setProfileData((prev) => ({ ...prev, weight: w }));
      setTimeout(() => {
        addBotMessage("Qual e a sua altura? (em cm)");
        setStep("height");
      }, 500);
    } else if (step === "height") {
      const h = parseInt(value);
      if (isNaN(h)) {
        setTimeout(() => addBotMessage("Por favor, informe um numero valido para a altura."), 300);
        return;
      }
      setProfileData((prev) => ({ ...prev, height: h }));
      setTimeout(() => {
        addBotMessage("Quantos anos voce tem?");
        setStep("age");
      }, 500);
    } else if (step === "age") {
      const a = parseInt(value);
      if (isNaN(a)) {
        setTimeout(() => addBotMessage("Por favor, informe um numero valido para a idade."), 300);
        return;
      }
      setProfileData((prev) => ({ ...prev, age: a }));
      setTimeout(() => {
        addBotMessage("Qual e o seu percentual de gordura corporal estimado? (ex: 12-15%)");
        setStep("bodyFat");
      }, 500);
    } else if (step === "bodyFat") {
      const updatedProfile = { ...profileData, bodyFat: value };
      setProfileData(updatedProfile);
      setTimeout(() => {
        addBotMessage("Perfeito! Seu perfil esta configurado. Vamos comecar!");
        setStep("done");
      }, 500);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await apiRequest("POST", "/api/profile", profileData);
      setLocation("/trial");
    } catch (e: any) {
      if (e.message?.includes("401")) {
        window.location.href = "/api/login";
        return;
      }
      addBotMessage("Houve um erro ao salvar seu perfil. Tente novamente.");
    }
    setSaving(false);
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin w-8 h-8 border-2 border-[#2b54ff] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto" data-testid="onboarding-page">
      <div className="flex items-center gap-3 p-4 pt-12">
        <div className="w-10 h-10 rounded-full bg-[#e8edff] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-[#2b54ff]" />
        </div>
        <div>
          <p className="font-semibold text-base" data-testid="text-coach-name">Coach AI</p>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-green-600">Online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isUser ? "justify-end" : "justify-start"} animate-fade-up`}
          >
            <div
              data-testid={`onboard-message-${msg.id}`}
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.isUser
                  ? "bg-[#2b54ff] text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {step === "goal" && (
          <div className="flex flex-col gap-2 animate-fade-up">
            {goalOptions.map((goal) => (
              <button
                key={goal.value}
                data-testid={`button-goal-${goal.value}`}
                onClick={() => handleGoalSelect(goal)}
                className="px-4 py-3 bg-gray-100 rounded-2xl text-sm text-left text-gray-800 transition-colors"
              >
                {goal.label}
              </button>
            ))}
          </div>
        )}

        {step === "gender" && (
          <div className="flex flex-col gap-2 animate-fade-up">
            {genderOptions.map((g) => (
              <button
                key={g.value}
                data-testid={`button-gender-${g.value}`}
                onClick={() => handleGenderSelect(g)}
                className="px-4 py-3 bg-gray-100 rounded-2xl text-sm text-left text-gray-800 transition-colors"
              >
                {g.label}
              </button>
            ))}
          </div>
        )}

        {step === "done" && (
          <div className="flex justify-end animate-fade-up">
            <button
              data-testid="button-start"
              onClick={handleFinish}
              disabled={saving}
              className="px-6 py-3 bg-[#2b54ff] text-white rounded-full text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Comecar!"}
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {(step === "weight" || step === "height" || step === "age" || step === "bodyFat") && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input
              data-testid="input-onboarding-value"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={
                step === "weight" ? "Ex: 78.5" :
                step === "height" ? "Ex: 178" :
                step === "age" ? "Ex: 26" :
                "Ex: 12-15%"
              }
              className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm outline-none"
            />
            <button
              data-testid="button-send-onboarding"
              onClick={handleSubmit}
              className="w-10 h-10 rounded-full bg-[#2b54ff] flex items-center justify-center shrink-0"
            >
              <ArrowUp className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
