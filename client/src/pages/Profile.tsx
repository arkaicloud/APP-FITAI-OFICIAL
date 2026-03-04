import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { BottomNav } from "@/components/BottomNav";
import { LogOut, Weight, Ruler, Percent, UserCircle } from "lucide-react";
import type { UserProfile } from "@shared/schema";

export function Profile() {
  const [, setLocation] = useLocation();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin w-8 h-8 border-2 border-[#2b54ff] border-t-transparent rounded-full" />
      </div>
    );
  }

  const displayName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Usuario" : "Usuario";

  const stats = [
    { label: "KG", value: profile?.weight?.toString() || "--", icon: Weight, color: "text-[#2b54ff]" },
    { label: "CM", value: profile?.height?.toString() || "--", icon: Ruler, color: "text-[#2b54ff]" },
    { label: "GC", value: profile?.bodyFat || "--", icon: Percent, color: "text-[#2b54ff]" },
    { label: "ANOS", value: profile?.age?.toString() || "--", icon: UserCircle, color: "text-[#2b54ff]" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-[430px] mx-auto" data-testid="profile-page">
      <div className="p-5 pt-12">
        <p className="font-bold text-lg tracking-wide" data-testid="text-logo">FIT.AI</p>
      </div>

      <div className="px-5 pb-24">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" data-testid="img-profile" />
            ) : (
              <UserCircle className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-lg" data-testid="text-user-name">{displayName}</h2>
            <p className="text-sm text-gray-500" data-testid="text-user-plan">
              {profile?.isSubscribed ? "Plano Premium" : "Plano Basico"}
            </p>
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
          onClick={() => logout()}
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
