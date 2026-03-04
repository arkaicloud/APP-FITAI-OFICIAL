import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Login } from "@/pages/Login";
import { Onboarding } from "@/pages/Onboarding";
import { Home } from "@/pages/Home";
import { TodayWorkout } from "@/pages/TodayWorkout";
import { TrainingPlan } from "@/pages/TrainingPlan";
import { DayWorkout } from "@/pages/DayWorkout";
import { Evolution } from "@/pages/Evolution";
import { AICoach } from "@/pages/AICoach";
import { Profile } from "@/pages/Profile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/home" component={Home} />
      <Route path="/treino-hoje" component={TodayWorkout} />
      <Route path="/plano" component={TrainingPlan} />
      <Route path="/dia/:day" component={DayWorkout} />
      <Route path="/evolucao" component={Evolution} />
      <Route path="/ai" component={AICoach} />
      <Route path="/perfil" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
