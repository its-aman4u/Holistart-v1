import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { showLoading, hideLoading } from "@/components/LoadingOverlay";
import type { MRFRequest } from "@shared/schema";

interface MRFDetailProps {
  params: { id: string };
}

export default function MRFDetail({ params }: MRFDetailProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: mrf, isLoading } = useQuery<MRFRequest>({
    queryKey: ["/api/mrf", params.id],
  });

  const updateMRFMutation = useMutation({
    mutationFn: async (updates: { status: string; rejectionReason?: string }) => {
      showLoading();
      const response = await apiRequest("PATCH", `/api/mrf/${params.id}`, updates);
      return response.json();
    },
    onSuccess: (data) => {
      hideLoading();
      queryClient.invalidateQueries({ queryKey: ["/api/mrf"] });
      
      if (data.status === "approved") {
        toast({
          title: "Success",
          description: "MRF approved successfully!",
          variant: "default",
        });
      } else if (data.status === "escalated") {
        toast({
          title: "Auto-Escalated",
          description: "Request auto-escalated to Director due to high salary",
          variant: "default",
        });
      } else if (data.status === "rejected") {
        toast({
          title: "Success",
          description: "MRF rejected",
          variant: "destructive",
        });
      }
      
      navigate("/mrf");
    },
    onError: () => {
      hideLoading();
      toast({
        title: "Error",
        description: "Failed to update MRF request",
        variant: "destructive",
      });
    },
  });

  const handleApprove = () => {
    // Get current salary threshold from localStorage or use default
    const salaryThreshold = parseInt(localStorage.getItem('salary_threshold') || '35000');
    
    if (mrf && mrf.salaryMax > salaryThreshold) {
      // Auto-escalate high-value requests
      updateMRFMutation.mutate({ status: "escalated" });
    } else {
      // Approve normally
      updateMRFMutation.mutate({ status: "approved" });
    }
  };

  const handleReject = () => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason && reason.trim()) {
      updateMRFMutation.mutate({ status: "rejected", rejectionReason: reason });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!mrf) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-foreground mb-2">MRF Not Found</h3>
        <p className="text-muted-foreground">The requested MRF could not be found.</p>
      </div>
    );
  }

  // Get current salary threshold from localStorage or use default
  const salaryThreshold = parseInt(localStorage.getItem('salary_threshold') || '35000');
  const isHighValue = mrf.salaryMax > salaryThreshold;

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border border-border p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2" data-testid={`text-mrf-detail-title-${mrf.id}`}>
            {mrf.title}
          </h2>
          <p className="text-muted-foreground">{mrf.id}</p>
          {isHighValue && user?.role !== 'DIRECTOR' && (
            <div className="mt-3 bg-warning/10 border border-warning/20 rounded-lg p-4 glass-effect">
              <div className="flex items-center gap-3 text-warning">
                <AlertTriangle className="w-6 h-6" />
                <div>
                  <p className="font-medium">Auto-Escalation Notice</p>
                  <p className="text-sm">
                    Salary exceeds ₹{salaryThreshold.toLocaleString('en-IN')} threshold
                  </p>
                  <p className="text-xs mt-1 opacity-80">
                    This request will automatically go to Director for approval
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Department</span>
              <span className="font-medium text-foreground" data-testid={`text-department-${mrf.id}`}>
                {mrf.department}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Entity</span>
              <span className="font-medium text-foreground" data-testid={`text-entity-${mrf.id}`}>
                {mrf.entity}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Cost Center</span>
              <span className="font-medium text-foreground" data-testid={`text-cost-center-${mrf.id}`}>
                {mrf.costCenter}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Created By</span>
              <span className="font-medium text-foreground" data-testid={`text-created-by-${mrf.id}`}>
                {mrf.createdBy}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Positions</span>
              <span className="font-medium text-foreground" data-testid={`text-positions-${mrf.id}`}>
                {mrf.positions}
              </span>
            </div>
            {!isHighValue && (
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Salary Range</span>
                <span className="font-medium text-foreground" data-testid={`text-salary-${mrf.id}`}>
                  ₹{mrf.salaryMin.toLocaleString('en-IN')} - ₹{mrf.salaryMax.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3 pt-4">
          <button
            onClick={() => navigate(`/mrf/${mrf.id}/full`)}
            className="w-full bg-secondary text-secondary-foreground font-medium py-3 px-4 rounded-lg touch-target glass-effect hover:glass-hover transition-all duration-300"
            data-testid={`button-full-details-${mrf.id}`}
          >
            View Full Details
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={handleApprove}
              className="flex-1 bg-primary text-primary-foreground font-medium py-3 px-4 rounded-lg touch-target glass-effect hover:glass-hover transition-all duration-300"
              data-testid={`button-approve-${mrf.id}`}
            >
              Approve
            </button>
            <button 
              onClick={handleReject}
              className="flex-1 bg-destructive text-destructive-foreground font-medium py-3 px-4 rounded-lg touch-target glass-effect hover:glass-hover transition-all duration-300"
              data-testid={`button-reject-${mrf.id}`}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
