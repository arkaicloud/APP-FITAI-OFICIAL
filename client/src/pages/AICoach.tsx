import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { ArrowUp, Sparkles } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const quickActions = [
  "Alterar plano de treino",
  "Mudar objetivo",
  "Atualizar perfil",
];

export function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Olá! Sou sua IA personal. Como posso ajudar com seu treino hoje?", isUser: false },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input, isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        text: "Estou processando sua solicitação. Em breve terei uma resposta personalizada para você!",
        isUser: false,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto" data-testid="ai-coach-page">
      <div className="relative h-[120px] w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/40" />
        <div className="relative z-10 p-5 pt-12">
          <p className="font-bold text-white text-lg tracking-wide" data-testid="text-logo">FIT.AI</p>
        </div>
      </div>

      <div className="bg-white rounded-t-3xl -mt-4 relative z-10 flex-1 flex flex-col">
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-[#e8edff] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#2b54ff]" />
          </div>
          <div>
            <p className="font-semibold text-sm" data-testid="text-coach-name">Coach AI</p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-green-600">Online</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
              <div
                data-testid={`ai-message-${msg.id}`}
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
        </div>

        <div className="p-3 pb-20 border-t border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {quickActions.map((action) => (
              <button
                key={action}
                data-testid={`button-quick-${action.toLowerCase().replace(/ /g, '-')}`}
                onClick={() => setInput(action)}
                className="whitespace-nowrap px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 shrink-0"
              >
                {action}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              data-testid="input-ai-message"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Digite sua mensagem"
              className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm outline-none"
            />
            <button
              data-testid="button-send-ai"
              onClick={handleSend}
              className="w-10 h-10 rounded-full bg-[#2b54ff] flex items-center justify-center shrink-0"
            >
              <ArrowUp className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
