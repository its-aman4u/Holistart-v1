import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'MANAGER' | 'LOB_HEAD' | 'DIRECTOR';

interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load saved authentication from localStorage
    const savedUser = localStorage.getItem('holistart_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('holistart_user');
      }
    }
  }, []);

  const login = (name: string, role: UserRole) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      role,
    };
    setUser(newUser);
    localStorage.setItem('holistart_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('holistart_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}