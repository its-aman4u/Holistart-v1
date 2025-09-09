import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { FileText, Users, ChevronRight, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ManagerDashboard from "./ManagerDashboard";
import type { MRFRequest, OnboardingRequest } from "@shared/schema";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const { data: mrfRequests = [] } = useQuery<MRFRequest[]>({
    queryKey: ["/api/mrf"],
  });

  const { data: onboardingRequests = [] } = useQuery<OnboardingRequest[]>({
    queryKey: ["/api/onboarding"],
  });

  // Filter requests based on user role
  const filteredMRFs = user?.role === 'DIRECTOR' 
    ? mrfRequests.filter(mrf => mrf.status === "escalated")
    : mrfRequests.filter(mrf => mrf.status === "pending");
    
  const pendingOnboarding = onboardingRequests.filter(req => req.status === "pending");
  const totalApproved = mrfRequests.filter(mrf => mrf.status === "approved").length + 
                       onboardingRequests.filter(req => req.status === "approved").length;

  // Show Manager-specific dashboard
  if (user?.role === 'MANAGER') {
    return <ManagerDashboard />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2" data-testid="text-dashboard-title">
          {user?.role === 'DIRECTOR' ? 'Director Dashboard' : 'Dashboard'}
        </h2>
        <p className="text-muted-foreground" data-testid="text-dashboard-subtitle">
          {user?.role === 'DIRECTOR' ? 'Review escalated requests' : 'Review pending approvals'}
        </p>
      </div>

      {/* Main Action Cards */}
      <div className="space-y-4">
        {/* MRF Approvals Card */}
        <div 
          className="bg-card rounded-lg shadow-sm border border-border p-4 touch-target cursor-pointer glass-effect hover:glass-hover transition-all duration-300" 
          onClick={() => navigate("/mrf")}
          data-testid="card-mrf-approvals"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${user?.role === 'DIRECTOR' ? 'bg-accent/10' : 'bg-primary/10'} rounded-lg flex items-center justify-center`}>
                  {user?.role === 'DIRECTOR' ? (
                    <Crown className="w-5 h-5 text-accent" />
                  ) : (
                    <FileText className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground" data-testid="text-mrf-title">
                    {user?.role === 'DIRECTOR' ? 'Escalated Requests' : 'MRF Approvals'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {user?.role === 'DIRECTOR' ? 'High-value positions' : 'Manpower requests'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {filteredMRFs.length > 0 && (
                <span 
                  className={`${user?.role === 'DIRECTOR' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'} text-sm font-medium px-2 py-1 rounded-full min-w-[24px] text-center`}
                  data-testid="badge-mrf-count"
                >
                  {filteredMRFs.length}
                </span>
              )}
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Onboarding Approvals Card - Hide for Director */}
        {user?.role !== 'DIRECTOR' && (
          <div 
            className="bg-card rounded-lg shadow-sm border border-border p-4 touch-target cursor-pointer glass-effect hover:glass-hover transition-all duration-300" 
            onClick={() => navigate("/onboarding")}
            data-testid="card-onboarding-approvals"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground" data-testid="text-onboarding-title">
                      Onboarding Approvals
                    </h3>
                    <p className="text-sm text-muted-foreground">New joiner requests</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {pendingOnboarding.length > 0 && (
                  <span 
                    className="bg-accent text-accent-foreground text-sm font-medium px-2 py-1 rounded-full min-w-[24px] text-center"
                    data-testid="badge-onboarding-count"
                  >
                    {pendingOnboarding.length}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-muted rounded-lg p-4 glass-effect">
        <h3 className="font-medium text-foreground mb-3" data-testid="text-stats-title">
          Today's Summary
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-success" data-testid="text-stats-approved">
              {totalApproved}
            </div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-destructive" data-testid="text-stats-pending">
              {filteredMRFs.length + (user?.role === 'DIRECTOR' ? 0 : pendingOnboarding.length)}
            </div>
            <div className="text-sm text-muted-foreground">
              {user?.role === 'DIRECTOR' ? 'Escalated' : 'Pending'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
