import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, Clock, CheckCircle } from "lucide-react";
import type { MRFRequest, OnboardingRequest } from "@shared/schema";

export default function Reports() {
  const { data: mrfRequests = [] } = useQuery<MRFRequest[]>({
    queryKey: ["/api/mrf"],
  });

  const { data: onboardingRequests = [] } = useQuery<OnboardingRequest[]>({
    queryKey: ["/api/onboarding"],
  });

  const mrfStats = {
    total: mrfRequests.length,
    pending: mrfRequests.filter(mrf => mrf.status === "pending").length,
    approved: mrfRequests.filter(mrf => mrf.status === "approved").length,
    escalated: mrfRequests.filter(mrf => mrf.status === "escalated").length,
    rejected: mrfRequests.filter(mrf => mrf.status === "rejected").length,
  };

  const onboardingStats = {
    total: onboardingRequests.length,
    pending: onboardingRequests.filter(req => req.status === "pending").length,
    approved: onboardingRequests.filter(req => req.status === "approved").length,
    rejected: onboardingRequests.filter(req => req.status === "rejected").length,
  };

  const departments = Array.from(new Set(mrfRequests.map(mrf => mrf.department)));
  const departmentStats = departments.map(dept => ({
    name: dept,
    count: mrfRequests.filter(mrf => mrf.department === dept).length,
  }));

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2" data-testid="text-reports-title">
          Reports & Analytics
        </h2>
        <p className="text-muted-foreground">
          Overview of approval metrics
        </p>
      </div>

      {/* MRF Overview */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">MRF Requests</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-foreground">{mrfStats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-3 bg-warning/10 rounded-lg">
            <div className="text-2xl font-bold text-warning">{mrfStats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="text-center p-3 bg-success/10 rounded-lg">
            <div className="text-2xl font-bold text-success">{mrfStats.approved}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </div>
          <div className="text-center p-3 bg-accent/10 rounded-lg">
            <div className="text-2xl font-bold text-accent">{mrfStats.escalated}</div>
            <div className="text-sm text-muted-foreground">Escalated</div>
          </div>
        </div>
      </div>

      {/* Onboarding Overview */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Onboarding</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-foreground">{onboardingStats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-3 bg-warning/10 rounded-lg">
            <div className="text-2xl font-bold text-warning">{onboardingStats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="text-center p-3 bg-success/10 rounded-lg">
            <div className="text-2xl font-bold text-success">{onboardingStats.approved}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </div>
          <div className="text-center p-3 bg-destructive/10 rounded-lg">
            <div className="text-2xl font-bold text-destructive">{onboardingStats.rejected}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Department Distribution</h3>
        </div>
        
        <div className="space-y-3">
          {departmentStats.map((dept, index) => (
            <div key={dept.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium text-foreground">{dept.name}</span>
              <div className="flex items-center gap-2">
                <div 
                  className="h-2 bg-primary rounded-full"
                  style={{ 
                    width: `${Math.max(20, (dept.count / Math.max(...departmentStats.map(d => d.count))) * 60)}px` 
                  }}
                ></div>
                <span className="text-sm font-semibold text-foreground min-w-[20px]">
                  {dept.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-warning" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Quick Insights</h3>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Approval Rate</span>
            <span className="font-medium text-foreground">
              {mrfStats.total > 0 ? Math.round((mrfStats.approved / mrfStats.total) * 100) : 0}%
            </span>
          </div>
          <div className="flex justify-between p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Escalation Rate</span>
            <span className="font-medium text-foreground">
              {mrfStats.total > 0 ? Math.round((mrfStats.escalated / mrfStats.total) * 100) : 0}%
            </span>
          </div>
          <div className="flex justify-between p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Active Departments</span>
            <span className="font-medium text-foreground">{departments.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}