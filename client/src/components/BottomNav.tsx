import { useLocation } from "wouter";
import { Home, Calendar, BarChart3, User, Sparkles } from "lucide-react";

const navItems = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/plano", icon: Calendar, label: "Plano" },
  { path: "/ai", icon: Sparkles, label: "AI", isCenter: true },
  { path: "/evolucao", icon: BarChart3, label: "Evolução" },
  { path: "/perfil", icon: User, label: "Perfil" },
];

export function BottomNav() {
  const [location, setLocation] = useLocation();

  return (
    <nav
      data-testid="bottom-nav"
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-end justify-around px-2 pb-4 pt-2 z-50"
      style={{ maxWidth: "100%", margin: "0 auto" }}
    >
      {navItems.map((item) => {
        const isActive = location === item.path || (item.path === "/home" && location === "/home");
        if (item.isCenter) {
          return (
            <button
              key={item.path}
              data-testid="nav-ai"
              onClick={() => setLocation(item.path)}
              className="flex flex-col items-center -mt-5"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                isActive ? "bg-[#2b54ff]" : "bg-[#2b54ff]"
              } shadow-lg`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
            </button>
          );
        }
        return (
          <button
            key={item.path}
            data-testid={`nav-${item.label.toLowerCase()}`}
            onClick={() => setLocation(item.path)}
            className="flex flex-col items-center gap-1 py-1 px-3"
          >
            <item.icon
              className={`w-6 h-6 ${isActive ? "text-[#2b54ff]" : "text-gray-400"}`}
              strokeWidth={isActive ? 2.5 : 1.5}
            />
          </button>
        );
      })}
    </nav>
  );
}
