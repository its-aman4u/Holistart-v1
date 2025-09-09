import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Settings as SettingsIcon, LogOut, DollarSign, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [salaryThreshold, setSalaryThreshold] = useState(35000);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load saved settings
    const savedThreshold = localStorage.getItem('salary_threshold');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedThreshold) {
      setSalaryThreshold(parseInt(savedThreshold));
    }
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const handleThresholdChange = (value: number) => {
    setSalaryThreshold(value);
    localStorage.setItem('salary_threshold', value.toString());
    toast({
      title: "Settings Updated",
      description: `Salary threshold set to ₹${value.toLocaleString('en-IN')}`,
      variant: "default",
    });
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    toast({
      title: "Theme Updated",
      description: `Switched to ${newTheme} mode`,
      variant: "default",
    });
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2" data-testid="text-settings-title">
          Settings
        </h2>
        <p className="text-muted-foreground">
          Customize your preferences
        </p>
      </div>

      {/* User Info */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">User Information</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium text-foreground" data-testid="text-user-name">
              {user?.name}
            </span>
          </div>
          <div className="flex justify-between p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Role</span>
            <span className="font-medium text-foreground" data-testid="text-user-role">
              {user?.role.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Salary Threshold Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-warning" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Salary Threshold</h3>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            MRF requests above this amount will be automatically escalated to Director
          </p>
          
          <div className="space-y-3">
            <label htmlFor="threshold" className="block text-sm font-medium text-foreground">
              Threshold Amount (₹)
            </label>
            <input
              id="threshold"
              type="number"
              value={salaryThreshold}
              onChange={(e) => handleThresholdChange(parseInt(e.target.value) || 35000)}
              min="0"
              step="1000"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="input-salary-threshold"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[25000, 35000, 50000].map((amount) => (
              <button
                key={amount}
                onClick={() => handleThresholdChange(amount)}
                className={`p-2 text-sm rounded-lg border touch-target ${
                  salaryThreshold === amount
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-muted text-muted-foreground'
                }`}
                data-testid={`button-threshold-${amount}`}
              >
                ₹{amount.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Choose your preferred theme
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-4 text-left rounded-lg border-2 transition-all touch-target ${
                theme === 'light'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-muted'
              }`}
              data-testid="button-theme-light"
            >
              <div className="font-medium text-foreground">Light</div>
              <div className="text-sm text-muted-foreground">Default theme</div>
            </button>
            
            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-4 text-left rounded-lg border-2 transition-all touch-target ${
                theme === 'dark'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-muted'
              }`}
              data-testid="button-theme-dark"
            >
              <div className="font-medium text-foreground">Dark</div>
              <div className="text-sm text-muted-foreground">Dark mode</div>
            </button>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-card rounded-lg border border-border p-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-destructive text-destructive-foreground font-medium py-3 px-4 rounded-lg touch-target"
          data-testid="button-logout"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}