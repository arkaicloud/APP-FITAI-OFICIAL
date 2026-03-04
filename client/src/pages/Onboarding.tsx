import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowUp, Sparkles } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const onboardingMessages: Message[] = [
  { id: 1, text: "Bem-vindo ao FIT.AI!", isUser: false },
  {
    id: 2,
    text: "O app que vai transformar a forma como você treina. Aqui você monta seu plano de treino personalizado, acompanha sua evolução com estatísticas detalhadas e conta com uma IA disponível 24h para te guiar em cada exercício.",
    isUser: false,
  },
  {
    id: 3,
    text: "Tudo pensado para você alcançar seus objetivos de forma inteligente e consistente.",
    isUser: false,
  },
  { id: 4, text: "Vamos configurar seu perfil?", isUser: false },
];

export function Onboarding() {
  const [, setLocation] = useLocation();
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [showStart, setShowStart] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onboardingMessages.forEach((msg, i) => {
      setTimeout(() => {
        setVisibleMessages((prev) => [...prev, msg]);
        if (i === onboardingMessages.length - 1) {
          setTimeout(() => setShowStart(true), 500);
        }
      }, (i + 1) * 800);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages, showStart]);

  const handleStart = () => {
    setLocation("/home");
  };

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
        {visibleMessages.map((msg) => (
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

        {showStart && (
          <div className="flex justify-end animate-fade-up">
            <button
              data-testid="button-start"
              onClick={handleStart}
              className="px-6 py-3 bg-[#2b54ff] text-white rounded-full text-sm font-semibold transition-colors"
            >
              Começar!
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            data-testid="input-onboarding-message"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem"
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm outline-none"
          />
          <button
            data-testid="button-send-onboarding"
            className="w-10 h-10 rounded-full bg-[#2b54ff] flex items-center justify-center shrink-0"
          >
            <ArrowUp className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
