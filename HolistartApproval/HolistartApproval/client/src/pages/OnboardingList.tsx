import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Users, CheckCircle } from "lucide-react";
import type { OnboardingRequest } from "@shared/schema";

export default function OnboardingList() {
  const [, navigate] = useLocation();

  const { data: onboardingRequests = [], isLoading } = useQuery<OnboardingRequest[]>({
    queryKey: ["/api/onboarding"],
  });

  const pendingRequests = onboardingRequests.filter(req => req.status === "pending");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2" data-testid="text-empty-title">
          All caught up!
        </h3>
        <p className="text-muted-foreground" data-testid="text-empty-description">
          No pending onboarding approvals
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-foreground" data-testid="text-list-title">
          Onboarding Approvals
        </h2>
        <p className="text-sm text-muted-foreground">Review new joiner requests</p>
      </div>

      <div className="space-y-3">
        {pendingRequests.map(candidate => {
          const documents = [
            candidate.aadhaarStatus,
            candidate.panStatus,
            candidate.educationStatus,
            candidate.employmentStatus
          ];
          const docsVerified = documents.filter(status => status === 'verified').length;
          const totalDocs = documents.length;
          
          return (
            <div 
              key={candidate.id}
              className="bg-card rounded-lg border border-border p-4 touch-target cursor-pointer" 
              onClick={() => navigate(`/onboarding/${candidate.id}`)}
              data-testid={`card-onboarding-${candidate.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground" data-testid={`text-candidate-name-${candidate.id}`}>
                    {candidate.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {candidate.position} • {candidate.department}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    ₹{candidate.ctc.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-muted-foreground">CTC</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <CheckCircle 
                      className={`w-4 h-4 ${docsVerified === totalDocs ? 'text-success' : 'text-warning'}`}
                    />
                    <span className="text-muted-foreground">
                      {docsVerified}/{totalDocs} docs verified
                    </span>
                  </div>
                </div>
                <span className="text-muted-foreground">
                  Joining {new Date(candidate.joiningDate).toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
