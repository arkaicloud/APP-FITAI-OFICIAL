import { useLocation } from "wouter";
import { BottomNav } from "@/components/BottomNav";
import { LogOut, Weight, Ruler, Percent, UserCircle } from "lucide-react";

const stats = [
  { label: "KG", value: "78.5", icon: Weight, color: "text-[#2b54ff]" },
  { label: "CM", value: "178", icon: Ruler, color: "text-[#2b54ff]" },
  { label: "GC", value: "12-15%", icon: Percent, color: "text-[#2b54ff]" },
  { label: "ANOS", value: "26", icon: UserCircle, color: "text-[#2b54ff]" },
];

export function Profile() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[430px] mx-auto" data-testid="profile-page">
      <div className="p-5 pt-12">
        <p className="font-bold text-lg tracking-wide" data-testid="text-logo">FIT.AI</p>
      </div>

      <div className="px-5 pb-24">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <UserCircle className="w-10 h-10 text-gray-400" />
          </div>
          <div>
            <h2 className="font-semibold text-lg" data-testid="text-user-name">Paulo da Silva</h2>
            <p className="text-sm text-gray-500" data-testid="text-user-plan">Plano Básico</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              data-testid={`stat-card-${stat.label.toLowerCase()}`}
              className="bg-gray-50 rounded-2xl p-5 flex flex-col items-center"
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
              <span className="text-3xl font-bold">{stat.value}</span>
              <span className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>

        <button
          data-testid="button-logout"
          onClick={() => setLocation("/")}
          className="flex items-center justify-center gap-2 w-full py-3 text-red-500 font-medium text-sm rounded-xl transition-colors"
        >
          Sair da conta
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
