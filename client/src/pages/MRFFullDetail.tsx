import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { AlertTriangle, Building, MapPin, User, DollarSign, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { showLoading, hideLoading } from "@/components/LoadingOverlay";
import type { MRFRequest } from "@shared/schema";

interface MRFFullDetailProps {
  params: { id: string };
}

export default function MRFFullDetail({ params }: MRFFullDetailProps) {
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
    const salaryThreshold = parseInt(localStorage.getItem('salary_threshold') || '35000');
    
    if (mrf && mrf.salaryMax > salaryThreshold) {
      updateMRFMutation.mutate({ status: "escalated" });
    } else {
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

  const salaryThreshold = parseInt(localStorage.getItem('salary_threshold') || '35000');
  const isHighValue = mrf.salaryMax > salaryThreshold;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2" data-testid={`text-mrf-full-title-${mrf.id}`}>
            {mrf.title}
          </h2>
          <p className="text-lg text-muted-foreground">{mrf.id}</p>
          {isHighValue && user?.role !== 'DIRECTOR' && (
            <div className="mt-4 bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-center gap-3 text-warning">
                <AlertTriangle className="w-6 h-6" />
                <div className="text-left">
                  <p className="font-medium">High-Value Position</p>
                  <p className="text-sm">Will auto-escalate to Director for approval</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Department & Organization Info */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Organization Details</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Department</span>
            <span className="font-medium text-foreground" data-testid={`text-department-${mrf.id}`}>
              {mrf.department}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Business Entity</span>
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
        </div>
      </div>

      {/* Position Details */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Position Information</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Position Title</span>
            <span className="font-medium text-foreground">{mrf.title}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Number of Positions</span>
            <span className="font-medium text-foreground" data-testid={`text-positions-${mrf.id}`}>
              {mrf.positions}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Requested By</span>
            <span className="font-medium text-foreground" data-testid={`text-created-by-${mrf.id}`}>
              {mrf.createdBy}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Request Date</span>
            <span className="font-medium text-foreground">
              {mrf.createdAt ? new Date(mrf.createdAt).toLocaleDateString('en-IN') : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Compensation */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Compensation Details</h3>
        </div>
        
        {!isHighValue || user?.role === 'DIRECTOR' ? (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Minimum Salary</span>
              <span className="font-medium text-foreground">
                ₹{mrf.salaryMin.toLocaleString('en-IN')} per month
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Maximum Salary</span>
              <span className="font-medium text-foreground" data-testid={`text-salary-${mrf.id}`}>
                ₹{mrf.salaryMax.toLocaleString('en-IN')} per month
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Annual Budget Impact</span>
              <span className="font-medium text-foreground">
                ₹{((mrf.salaryMin + mrf.salaryMax) / 2 * 12 * mrf.positions).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 bg-muted rounded-lg">
            <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" />
            <p className="text-muted-foreground">
              Salary details hidden for high-value positions
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Above threshold of ₹{salaryThreshold.toLocaleString('en-IN')}
            </p>
          </div>
        )}
      </div>

      {/* Business Justification */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-warning" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Business Context</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Request Status</span>
            <span className={`font-medium capitalize ${
              mrf.status === 'pending' ? 'text-warning' :
              mrf.status === 'approved' ? 'text-success' :
              mrf.status === 'escalated' ? 'text-accent' :
              'text-destructive'
            }`}>
              {mrf.status}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Priority Level</span>
            <span className="font-medium text-foreground">
              {isHighValue ? 'High (Director Approval)' : 'Standard (LOB Approval)'}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Expected Timeline</span>
            <span className="font-medium text-foreground">
              {isHighValue ? '5-7 business days' : '2-3 business days'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button 
          onClick={handleApprove}
          className="flex-1 bg-primary text-primary-foreground font-medium py-3 px-4 rounded-lg touch-target"
          data-testid={`button-approve-full-${mrf.id}`}
        >
          Approve
        </button>
        <button 
          onClick={handleReject}
          className="flex-1 bg-destructive text-destructive-foreground font-medium py-3 px-4 rounded-lg touch-target"
          data-testid={`button-reject-full-${mrf.id}`}
        >
          Reject
        </button>
      </div>
    </div>
  );
}