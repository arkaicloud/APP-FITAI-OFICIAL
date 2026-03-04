import { useState, useRef, useEffect } from "react";
import { X, ArrowUp, Sparkles } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

interface CoachAIChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessages?: Message[];
}

const defaultMessages: Message[] = [
  { id: 1, text: "Ola! Sou seu Coach AI. Posso criar um plano de treino personalizado para voce ou tirar duvidas sobre seus exercicios. Como posso ajudar?", isUser: false },
];

const quickActions = [
  "Criar plano de treino",
  "Alterar plano atual",
  "Duvida sobre exercicio",
];

export function CoachAIChat({ isOpen, onClose, initialMessages }: CoachAIChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || defaultMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatHistory = useRef<{ role: string; content: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now(), text, isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    chatHistory.current.push({ role: "user", content: text });

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory.current }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const replyText = data.reply || "Desculpe, nao consegui processar sua mensagem.";

      chatHistory.current.push({ role: "assistant", content: replyText });

      const aiMsg: Message = { id: Date.now() + 1, text: replyText, isUser: false };
      setMessages((prev) => [...prev, aiMsg]);

      if (data.savedPlan) {
        queryClient.invalidateQueries({ queryKey: ["/api/workout-plans"] });
        queryClient.invalidateQueries({ queryKey: ["/api/workout-plans/today"] });
      }
    } catch {
      const errorMsg: Message = {
        id: Date.now() + 1,
        text: "Erro ao conectar com o Coach AI. Tente novamente.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
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
                <div className={`w-2 h-2 rounded-full ${isLoading ? "bg-yellow-400" : "bg-green-500"}`} />
                <span className={`text-xs ${isLoading ? "text-yellow-600" : "text-green-600"}`}>
                  {isLoading ? "Pensando..." : "Online"}
                </span>
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
                  msg.isUser ? "bg-[#2b54ff] text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-3 border-t border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {quickActions.map((action) => (
              <button
                key={action}
                data-testid={`button-quick-${action.toLowerCase().replace(/ /g, "-")}`}
                onClick={() => sendMessage(action)}
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
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Digite sua mensagem"
              className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm outline-none"
            />
            <button
              data-testid="button-send-message"
              onClick={() => sendMessage(input)}
              disabled={isLoading}
              className="w-10 h-10 rounded-full bg-[#2b54ff] flex items-center justify-center shrink-0 disabled:opacity-50"
            >
              <ArrowUp className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
