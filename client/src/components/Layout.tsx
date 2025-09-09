import { ArrowLeft, Home, BarChart3, Settings, User } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import LoadingOverlay from "./LoadingOverlay";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  
  const getPageTitle = () => {
    if (location === "/") return user?.role === 'DIRECTOR' ? "Director Dashboard" : "Dashboard";
    if (location === "/mrf") return user?.role === 'DIRECTOR' ? "Escalated Requests" : "MRF Approvals";
    if (location.includes("/mrf/") && location.includes("/full")) return "Full MRF Details";
    if (location.startsWith("/mrf/")) return "MRF Details";
    if (location === "/onboarding") return "Onboarding Approvals";
    if (location.includes("/onboarding/") && location.includes("/full")) return "Full Candidate Details";
    if (location.startsWith("/onboarding/")) return "Candidate Details";
    if (location === "/reports") return "Reports";
    if (location === "/settings") return "Settings";
    return "Holistart Mobile";
  };

  const showBackButton = location !== "/";

  const handleBack = () => {
    if (location.includes("/mrf/") && location.includes("/full")) {
      // From full detail back to regular detail
      const id = location.split("/")[2];
      navigate(`/mrf/${id}`);
    } else if (location.startsWith("/mrf/")) {
      navigate("/mrf");
    } else if (location.includes("/onboarding/") && location.includes("/full")) {
      // From full detail back to regular detail
      const id = location.split("/")[2];
      navigate(`/onboarding/${id}`);
    } else if (location.startsWith("/onboarding/")) {
      navigate("/onboarding");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen min-h-dvh flex flex-col max-w-md mx-auto bg-background">
      {/* Header */}
      <header className="bg-secondary text-secondary-foreground safe-top">
        <div className="flex items-center justify-between px-4 py-3 safe-left safe-right">
          {showBackButton ? (
            <button 
              onClick={handleBack}
              className="touch-target flex items-center justify-center"
              data-testid="button-back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : (
            <div className="touch-target" />
          )}
          <h1 className="text-lg font-semibold" data-testid="text-header-title">
            {getPageTitle()}
          </h1>
          <div className="touch-target flex items-center gap-2" data-testid="user-profile">
            <div className="text-right">
              <p className="text-sm font-medium text-secondary-foreground">{user?.name}</p>
              <p className="text-xs text-secondary-foreground/80">{user?.role.replace('_', ' ')}</p>
            </div>
            <div className="w-8 h-8 bg-secondary-foreground/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 safe-left safe-right overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-card border-t border-border safe-bottom">
        <div className="flex justify-around py-2 safe-left safe-right">
          <Link href="/">
            <button 
              className={`flex flex-col items-center py-2 px-3 touch-target ${
                location === "/" ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid="button-nav-home"
            >
              <Home className="w-5 h-5 mb-1" fill={location === "/" ? "currentColor" : "none"} />
              <span className="text-xs">Home</span>
            </button>
          </Link>
          <Link href="/reports">
            <button 
              className={`flex flex-col items-center py-2 px-3 touch-target ${
                location === "/reports" ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid="button-nav-reports"
            >
              <BarChart3 className="w-5 h-5 mb-1" fill={location === "/reports" ? "currentColor" : "none"} />
              <span className="text-xs">Reports</span>
            </button>
          </Link>
          <Link href="/settings">
            <button 
              className={`flex flex-col items-center py-2 px-3 touch-target ${
                location === "/settings" ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid="button-nav-settings"
            >
              <Settings className="w-5 h-5 mb-1" fill={location === "/settings" ? "currentColor" : "none"} />
              <span className="text-xs">Settings</span>
            </button>
          </Link>
        </div>
      </nav>

      <LoadingOverlay />
    </div>
  );
}
