import { useAuth } from "@/contexts/AuthContext";
import { Plus, FileText, Users } from "lucide-react";

export default function ManagerDashboard() {
  const { user } = useAuth();

  const upcomingActions = [
    { title: "Monthly MRF Planning", status: "Due in 3 days", type: "planning" },
    { title: "Q1 Hiring Review", status: "Scheduled", type: "review" },
    { title: "Team Expansion Proposal", status: "Draft", type: "proposal" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2" data-testid="text-manager-dashboard-title">
          Manager Dashboard
        </h2>
        <p className="text-muted-foreground" data-testid="text-manager-dashboard-subtitle">
          Create and manage hiring requests
        </p>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        
        {/* Create MRF Card */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 glass-effect hover:glass-hover transition-all duration-300">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-primary/20 transition-colors">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Create New MRF</h3>
            <p className="text-muted-foreground mb-4">
              Submit a new manpower requisition form for your department
            </p>
            <button 
              className="bg-primary text-primary-foreground font-medium py-3 px-6 rounded-lg touch-target hover:bg-primary/90 transition-all"
              data-testid="button-create-mrf"
              onClick={() => alert('MRF Creation feature coming soon!')}
            >
              Create MRF Request
            </button>
          </div>
        </div>

        {/* Add Joiner Card */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 glass-effect hover:glass-hover transition-all duration-300">
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-accent/20 transition-colors">
              <Users className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Add New Joiner</h3>
            <p className="text-muted-foreground mb-4">
              Submit onboarding details for approved candidates
            </p>
            <button 
              className="bg-accent text-accent-foreground font-medium py-3 px-6 rounded-lg touch-target hover:bg-accent/90 transition-all"
              data-testid="button-add-joiner"
              onClick={() => alert('Add Joiner feature coming soon!')}
            >
              Add Candidate Details
            </button>
          </div>
        </div>
      </div>

      {/* My Requests Status */}
      <div className="bg-card rounded-lg border border-border p-6 glass-effect">
        <h3 className="text-lg font-semibold text-foreground mb-4">My Recent Requests</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">IT Developer - MRF002</p>
                <p className="text-sm text-muted-foreground">Submitted 2 days ago</p>
              </div>
            </div>
            <span className="bg-warning/10 text-warning text-sm font-medium px-2 py-1 rounded-full">
              Under Review
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-accent" />
              <div>
                <p className="font-medium text-foreground">Rahul Sharma - Onboarding</p>
                <p className="text-sm text-muted-foreground">Submitted 1 day ago</p>
              </div>
            </div>
            <span className="bg-success/10 text-success text-sm font-medium px-2 py-1 rounded-full">
              Approved
            </span>
          </div>
        </div>
      </div>

      {/* Upcoming Actions */}
      <div className="bg-card rounded-lg border border-border p-6 glass-effect">
        <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Actions</h3>
        <div className="space-y-3">
          {upcomingActions.map((action, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">{action.title}</p>
                <p className="text-sm text-muted-foreground">{action.status}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                action.type === 'planning' ? 'bg-warning' :
                action.type === 'review' ? 'bg-primary' :
                'bg-accent'
              }`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}