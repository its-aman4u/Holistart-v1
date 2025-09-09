import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { User, CheckCircle, XCircle, Laptop, Phone, CreditCard, Home } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { showLoading, hideLoading } from "@/components/LoadingOverlay";
import type { OnboardingRequest } from "@shared/schema";

interface OnboardingFullDetailProps {
  params: { id: string };
}

export default function OnboardingFullDetail({ params }: OnboardingFullDetailProps) {
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
    { name: "Aadhaar Card", status: candidate.aadhaarStatus, icon: CreditCard },
    { name: "PAN Card", status: candidate.panStatus, icon: CreditCard },
    { name: "Educational Certificates", status: candidate.educationStatus, icon: CheckCircle },
    { name: "Employment Verification", status: candidate.employmentStatus, icon: CheckCircle },
  ];
  
  const docsVerified = documents.filter(doc => doc.status === 'verified').length;
  const totalDocs = documents.length;

  const assets = [
    { name: "Laptop", required: true, allocated: true, icon: Laptop },
    { name: "Mobile Phone", required: true, allocated: true, icon: Phone },
    { name: "ID Card", required: true, allocated: false, icon: CreditCard },
    { name: "Parking Pass", required: false, allocated: false, icon: Home },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2" data-testid={`text-candidate-full-name-${candidate.id}`}>
            {candidate.name}
          </h2>
          <p className="text-lg text-muted-foreground">{candidate.position}</p>
          <p className="text-sm text-muted-foreground">{candidate.department}</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Full Name</span>
            <span className="font-medium text-foreground">{candidate.name}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Phone Number</span>
            <span className="font-medium text-foreground" data-testid={`text-phone-${candidate.id}`}>
              {candidate.phone}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Email Address</span>
            <span className="font-medium text-foreground" data-testid={`text-email-${candidate.id}`}>
              {candidate.email}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Employee ID</span>
            <span className="font-medium text-foreground">
              EMP{candidate.id.replace('ON', '')}
            </span>
          </div>
        </div>
      </div>

      {/* Employment Details */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Employment Details</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Position</span>
            <span className="font-medium text-foreground">{candidate.position}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Department</span>
            <span className="font-medium text-foreground" data-testid={`text-department-${candidate.id}`}>
              {candidate.department}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Annual CTC</span>
            <span className="font-medium text-foreground" data-testid={`text-ctc-${candidate.id}`}>
              ₹{candidate.ctc.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Monthly Gross</span>
            <span className="font-medium text-foreground">
              ₹{Math.round(candidate.ctc / 12).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Joining Date</span>
            <span className="font-medium text-foreground" data-testid={`text-joining-date-${candidate.id}`}>
              {new Date(candidate.joiningDate).toLocaleDateString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Employment Type</span>
            <span className="font-medium text-foreground">Full-time Permanent</span>
          </div>
        </div>
      </div>
      
      {/* Document Verification */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Document Verification</h3>
        </div>
        
        <div className="space-y-4">
          {documents.map((doc, index) => {
            const IconComponent = doc.icon;
            return (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    doc.status === 'verified' ? 'bg-success/10' : 'bg-warning/10'
                  }`}>
                    <IconComponent className={`w-4 h-4 ${
                      doc.status === 'verified' ? 'text-success' : 'text-warning'
                    }`} />
                  </div>
                  <span className="font-medium text-foreground">{doc.name}</span>
                </div>
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
            );
          })}
        </div>
        
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground mb-1">
              {docsVerified} of {totalDocs} Documents Verified
            </div>
            <div className="text-sm text-muted-foreground">
              {docsVerified === totalDocs ? '✓ All documents verified' : 'Pending verification'}
            </div>
          </div>
        </div>
      </div>

      {/* Asset Allocation */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Laptop className="w-5 h-5 text-warning" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Asset Allocation</h3>
        </div>
        
        <div className="space-y-3">
          {assets.map((asset, index) => {
            const IconComponent = asset.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    asset.allocated ? 'bg-success/10' : 'bg-muted-foreground/10'
                  }`}>
                    <IconComponent className={`w-4 h-4 ${
                      asset.allocated ? 'text-success' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <span className="font-medium text-foreground">{asset.name}</span>
                    {asset.required && (
                      <span className="ml-2 text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">
                        Required
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  asset.allocated ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {asset.allocated ? 'Allocated' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button 
          onClick={handleApprove}
          className="flex-1 bg-primary text-primary-foreground font-medium py-3 px-4 rounded-lg touch-target"
          data-testid={`button-approve-onboarding-full-${candidate.id}`}
        >
          Approve Complete Onboarding
        </button>
        <button 
          onClick={handleReject}
          className="flex-1 bg-destructive text-destructive-foreground font-medium py-3 px-4 rounded-lg touch-target"
          data-testid={`button-reject-onboarding-full-${candidate.id}`}
        >
          Reject
        </button>
      </div>
    </div>
  );
}