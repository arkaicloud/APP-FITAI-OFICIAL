import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserProfile } from "@shared/schema";

export const Login = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile | null>({
    queryKey: ["/api/profile"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated && !profileLoading) {
      if (profile?.onboardingCompleted) {
        setLocation("/home");
      } else {
        setLocation("/onboarding");
      }
    }
  }, [isLoading, isAuthenticated, profileLoading, profile, setLocation]);

  const handleGoogleLogin = () => {
    window.location.href = "/api/login";
  };

  if (isLoading || (isAuthenticated && profileLoading)) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[430px] mx-auto min-h-screen flex flex-col justify-between items-center bg-black" data-testid="login-page">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/figmaAssets/login.png)" }}
      />

      <div className="relative z-10 w-full flex flex-col justify-between items-center flex-1">
        <img
          className="h-[38.41px] w-[84.63px] mt-[48.1px]"
          alt="Fit ai"
          src="/figmaAssets/fit-ai.svg"
          data-testid="img-logo"
        />

        <Card className="w-full mb-0 bg-[#2b54ff] border-0 rounded-[20px_20px_0px_0px] shadow-none">
          <CardContent className="pt-12 pb-10 px-5 flex flex-col items-center gap-[60px]">
            <div className="w-full flex flex-col items-center gap-6">
              <div className="w-full flex flex-col items-center justify-center gap-3">
                <h1
                  data-testid="text-login-title"
                  className="w-full font-semibold text-white text-[32px] text-center tracking-[0] leading-[33.6px]"
                  style={{ fontFamily: "'Inter Tight', Helvetica" }}
                >
                  O app que vai transformar a forma como voce treina.
                </h1>
              </div>

              <Button
                data-testid="button-login-google"
                variant="secondary"
                onClick={handleGoogleLogin}
                className="h-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-[100px]"
              >
                <img
                  className="w-4 h-4"
                  alt="Google"
                  src="/figmaAssets/material-icon-theme-google.svg"
                />
                <span className="font-semibold text-black text-sm tracking-[0] leading-[14px] whitespace-nowrap">
                  Fazer login com Google
                </span>
              </Button>
            </div>

            <p className="font-normal text-[#ffffffb2] text-xs tracking-[0] leading-[16.8px] whitespace-nowrap">
              ©2026 Copyright FIT.AI. Todos os direitos reservados
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
