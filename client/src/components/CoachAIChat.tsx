import { useState } from "react";
import { X, ArrowUp, Sparkles } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  isHtml?: boolean;
}

interface CoachAIChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessages?: Message[];
}

const defaultMessages: Message[] = [
  { id: 1, text: "Olá! Sou sua IA personal. Como posso ajudar com seu treino hoje?", isUser: false },
];

const quickActions = [
  "Alterar plano de treino",
  "Mudar objetivo",
  "Atualizar perfil",
];

export function CoachAIChat({ isOpen, onClose, initialMessages }: CoachAIChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || defaultMessages);
  const [input, setInput] = useState("");

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-[100] flex items-end justify-center" data-testid="coach-ai-modal">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-[430px] h-[70vh] flex flex-col animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
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
          <button onClick={onClose} data-testid="button-close-chat" className="p-1">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
              <div
                data-testid={`chat-message-${msg.id}`}
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

        <div className="p-3 border-t border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {quickActions.map((action) => (
              <button
                key={action}
                data-testid={`button-quick-${action.toLowerCase().replace(/ /g, '-')}`}
                onClick={() => {
                  setInput(action);
                }}
                className="whitespace-nowrap px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 shrink-0"
              >
                {action}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              data-testid="input-chat-message"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Digite sua mensagem"
              className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm outline-none"
            />
            <button
              data-testid="button-send-message"
              onClick={handleSend}
              className="w-10 h-10 rounded-full bg-[#2b54ff] flex items-center justify-center shrink-0"
            >
              <ArrowUp className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
