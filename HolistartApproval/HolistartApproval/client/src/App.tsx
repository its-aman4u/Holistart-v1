import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import MRFList from "@/pages/MRFList";
import MRFDetail from "@/pages/MRFDetail";
import MRFFullDetail from "@/pages/MRFFullDetail";
import OnboardingList from "@/pages/OnboardingList";
import OnboardingDetail from "@/pages/OnboardingDetail";
import OnboardingFullDetail from "@/pages/OnboardingFullDetail";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/mrf" component={MRFList} />
        <Route path="/mrf/:id/full" component={MRFFullDetail} />
        <Route path="/mrf/:id" component={MRFDetail} />
        <Route path="/onboarding" component={OnboardingList} />
        <Route path="/onboarding/:id/full" component={OnboardingFullDetail} />
        <Route path="/onboarding/:id" component={OnboardingDetail} />
        <Route path="/reports" component={Reports} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
