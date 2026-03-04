import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Login = (): JSX.Element => {
  return (
    <div className="relative w-full min-w-[402px] min-h-[801px] flex flex-col justify-between items-center bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/figmaAssets/login.png)" }}
      />

      <div className="relative z-10 w-full flex flex-col justify-between items-center min-h-[801px]">
        <img
          className="h-[38.41px] w-[84.63px] mt-[48.1px]"
          alt="Fit ai"
          src="/figmaAssets/fit-ai.svg"
        />

        <Card className="w-full max-w-[402px] mb-0 bg-[#2b54ff] border-0 rounded-[20px_20px_0px_0px] shadow-none">
          <CardContent className="pt-12 pb-10 px-5 flex flex-col items-center gap-[60px]">
            <div className="w-full flex flex-col items-center gap-6">
              <div className="w-full flex flex-col items-center justify-center gap-3">
                <h1 className="w-full [font-family:'Inter_Tight',Helvetica] font-semibold text-white text-[32px] text-center tracking-[0] leading-[33.6px]">
                  O app que vai transformar a forma como você treina.
                </h1>
              </div>

              <Button
                variant="secondary"
                className="h-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-[100px] hover:bg-white/90"
              >
                <img
                  className="w-4 h-4"
                  alt="Material icon theme"
                  src="/figmaAssets/material-icon-theme-google.svg"
                />
                <span className="[font-family:'Inter',Helvetica] font-semibold text-black text-sm tracking-[0] leading-[14px] whitespace-nowrap">
                  Fazer login com Google
                </span>
              </Button>
            </div>

            <p className="[font-family:'Inter_Tight',Helvetica] font-normal text-[#ffffffb2] text-xs tracking-[0] leading-[16.8px] whitespace-nowrap">
              ©2026 Copyright FIT.AI. Todos os direitos reservados
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
