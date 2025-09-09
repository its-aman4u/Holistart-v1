import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { FileText, Crown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { MRFRequest } from "@shared/schema";

export default function MRFList() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const { data: mrfRequests = [], isLoading } = useQuery<MRFRequest[]>({
    queryKey: ["/api/mrf"],
  });

  // Filter requests based on user role
  const filteredMRFs = user?.role === 'DIRECTOR' 
    ? mrfRequests.filter(mrf => mrf.status === "escalated")
    : mrfRequests.filter(mrf => mrf.status === "pending");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (filteredMRFs.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          {user?.role === 'DIRECTOR' ? (
            <Crown className="w-8 h-8 text-muted-foreground" />
          ) : (
            <FileText className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2" data-testid="text-empty-title">
          All caught up!
        </h3>
        <p className="text-muted-foreground" data-testid="text-empty-description">
          {user?.role === 'DIRECTOR' ? 'No escalated requests' : 'No pending MRF approvals'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-foreground" data-testid="text-list-title">
          {user?.role === 'DIRECTOR' ? 'Escalated Requests' : 'MRF Approvals'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {user?.role === 'DIRECTOR' ? 'Review high-value positions' : 'Review manpower requests'}
        </p>
      </div>

      <div className="space-y-3">
        {filteredMRFs.map(mrf => {
          const salaryThreshold = parseInt(localStorage.getItem('salary_threshold') || '35000');
          const isHighValue = mrf.salaryMax > salaryThreshold;
          
          let badgeColor, badgeText;
          if (user?.role === 'DIRECTOR') {
            badgeColor = 'bg-accent text-accent-foreground';
            badgeText = 'Director Review';
          } else if (isHighValue) {
            badgeColor = 'bg-warning text-warning-foreground';
            badgeText = 'Auto-Escalate';
          } else {
            badgeColor = 'bg-primary/10 text-primary';
            badgeText = 'Review';
          }
          
          return (
            <div 
              key={mrf.id}
              className="bg-card rounded-lg border border-border p-4 touch-target cursor-pointer" 
              onClick={() => navigate(`/mrf/${mrf.id}`)}
              data-testid={`card-mrf-${mrf.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground" data-testid={`text-mrf-title-${mrf.id}`}>
                    {mrf.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {mrf.id} • {mrf.department}
                  </p>
                </div>
                <span className={`${badgeColor} text-xs font-medium px-2 py-1 rounded-full`}>
                  {badgeText}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {mrf.positions} position{mrf.positions > 1 ? 's' : ''}
                </span>
                <span className="text-foreground font-medium">{mrf.entity}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
