import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { User, CheckCircle, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { showLoading, hideLoading } from "@/components/LoadingOverlay";
import type { OnboardingRequest } from "@shared/schema";

interface OnboardingDetailProps {
  params: { id: string };
}

export default function OnboardingDetail({ params }: OnboardingDetailProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: candidate, isLoading } = useQuery<OnboardingRequest>({
    queryKey: ["/api/onboarding", params.id],
  });

  const updateOnboardingMutation = useMutation({
    mutationFn: async (updates: { status: string; rejectionReason?: string }) => {
      showLoading();
      const response = await apiRequest("PATCH", `/api/onboarding/${params.id}`, updates);
      return response.json();
    },
    onSuccess: (data) => {
      hideLoading();
      queryClient.invalidateQueries({ queryKey: ["/api/onboarding"] });
      
      if (data.status === "approved") {
        toast({
          title: "Success",
          description: "Onboarding approved successfully!",
          variant: "default",
        });
      } else if (data.status === "rejected") {
        toast({
          title: "Success",
          description: "Onboarding rejected",
          variant: "destructive",
        });
      }
      
      navigate("/onboarding");
    },
    onError: () => {
      hideLoading();
      toast({
        title: "Error",
        description: "Failed to update onboarding request",
        variant: "destructive",
      });
    },
  });

  const handleApprove = () => {
    updateOnboardingMutation.mutate({ status: "approved" });
  };

  const handleReject = () => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason && reason.trim()) {
      updateOnboardingMutation.mutate({ status: "rejected", rejectionReason: reason });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-foreground mb-2">Candidate Not Found</h3>
        <p className="text-muted-foreground">The requested candidate could not be found.</p>
      </div>
    );
  }

  const documents = [
    { name: "Aadhaar", status: candidate.aadhaarStatus },
    { name: "PAN", status: candidate.panStatus },
    { name: "Education", status: candidate.educationStatus },
    { name: "Employment", status: candidate.employmentStatus },
  ];
  
  const docsVerified = documents.filter(doc => doc.status === 'verified').length;
  const totalDocs = documents.length;

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2" data-testid={`text-candidate-detail-name-${candidate.id}`}>
            {candidate.name}
          </h2>
          <p className="text-muted-foreground">{candidate.position}</p>
        </div>
        
        {/* Personal Details Section */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium text-foreground" data-testid={`text-phone-${candidate.id}`}>
                {candidate.phone}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium text-foreground" data-testid={`text-email-${candidate.id}`}>
                {candidate.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Employment Details */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-medium text-foreground mb-4">Employment Details</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Department</span>
              <span className="font-medium text-foreground" data-testid={`text-department-${candidate.id}`}>
                {candidate.department}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">CTC</span>
              <span className="font-medium text-foreground" data-testid={`text-ctc-${candidate.id}`}>
                ₹{candidate.ctc.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Joining Date</span>
              <span className="font-medium text-foreground" data-testid={`text-joining-date-${candidate.id}`}>
                {new Date(candidate.joiningDate).toLocaleDateString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Document Verification */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-medium text-foreground mb-4" data-testid="text-document-verification-title">
          Document Verification
        </h3>
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-foreground capitalize">{doc.name}</span>
              <div className="flex items-center gap-2">
                {doc.status === 'verified' ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <XCircle className="w-5 h-5 text-warning" />
                )}
                <span className={`text-sm font-medium capitalize ${
                  doc.status === 'verified' ? 'text-success' : 'text-warning'
                }`}>
                  {doc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground text-center" data-testid={`text-document-summary-${candidate.id}`}>
            {docsVerified} of {totalDocs} documents verified
            {docsVerified === totalDocs ? ' ✓' : ' - Pending verification'}
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={() => navigate(`/onboarding/${candidate.id}/full`)}
          className="w-full bg-secondary text-secondary-foreground font-medium py-3 px-4 rounded-lg touch-target"
          data-testid={`button-full-details-onboarding-${candidate.id}`}
        >
          View Full Details
        </button>
        
        <div className="flex gap-3">
          <button 
            onClick={handleApprove}
            className="flex-1 bg-primary text-primary-foreground font-medium py-3 px-4 rounded-lg touch-target"
            data-testid={`button-approve-onboarding-${candidate.id}`}
          >
            Approve Onboarding
          </button>
          <button 
            onClick={handleReject}
            className="flex-1 bg-destructive text-destructive-foreground font-medium py-3 px-4 rounded-lg touch-target"
            data-testid={`button-reject-onboarding-${candidate.id}`}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
