import { useState } from 'react';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
import { User, Shield, Crown, Eye, EyeOff } from 'lucide-react';

interface Credential {
  employeeId: string;
  password: string;
  name: string;
  role: UserRole;
}

const predefinedCredentials: Credential[] = [
  { employeeId: 'MGR001', password: 'manager123', name: 'John Manager', role: 'MANAGER' },
  { employeeId: 'LOB001', password: 'lob123', name: 'Sarah Williams', role: 'LOB_HEAD' },
  { employeeId: 'LOB002', password: 'lob123', name: 'Michael Chen', role: 'LOB_HEAD' },
  { employeeId: 'DIR001', password: 'director123', name: 'Robert Smith', role: 'DIRECTOR' },
];

export default function Login() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    setError('');
    
    if (!employeeId.trim() || !password.trim()) {
      setError('Please enter both Employee ID and Password');
      return;
    }

    const credential = predefinedCredentials.find(
      cred => cred.employeeId === employeeId && cred.password === password
    );

    if (credential) {
      login(credential.name, credential.role);
    } else {
      setError('Invalid Employee ID or Password');
    }
  };

  const demoCredentials = [
    { role: 'Manager', id: 'MGR001', password: 'manager123', icon: User, color: 'text-secondary' },
    { role: 'LOB Head', id: 'LOB001', password: 'lob123', icon: Shield, color: 'text-primary' },
    { role: 'Director', id: 'DIR001', password: 'director123', icon: Crown, color: 'text-accent' },
  ];

  return (
    <div className="min-h-screen min-h-dvh flex flex-col justify-center max-w-md mx-auto bg-background px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2" data-testid="text-login-title">
          Holistart
        </h1>
        <p className="text-muted-foreground">
          Mobile Approval System
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="employeeId" className="block text-sm font-medium text-foreground mb-2">
            Employee ID
          </label>
          <input
            id="employeeId"
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
            placeholder="Enter Employee ID"
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            data-testid="input-employee-id"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-4 py-3 pr-12 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="input-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={!employeeId.trim() || !password.trim()}
          className="w-full bg-primary text-primary-foreground font-medium py-3 px-4 rounded-lg touch-target disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-login"
        >
          Login
        </button>

        {/* Demo Credentials */}
        <div className="border-t border-border pt-4">
          <p className="text-sm font-medium text-foreground mb-3 text-center">
            Demo Credentials
          </p>
          <div className="space-y-2">
            {demoCredentials.map((cred, index) => {
              const IconComponent = cred.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setEmployeeId(cred.id);
                    setPassword(cred.password);
                    setError('');
                  }}
                  className="w-full p-3 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-all touch-target"
                  data-testid={`button-demo-${cred.role.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-4 h-4 ${cred.color}`} />
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {cred.role}: {cred.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Password: {cred.password}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}