import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type AdminUser = {
  id: string;
  displayName: string;
  role: string;
};

type AdminAuthContextType = {
  user: AdminUser | null;
  setUser: (user: AdminUser | null) => void;
  isLoading: boolean;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    fetch('/api/admin/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser({ id: data.user.userId, displayName: data.user.userId, role: data.user.role });
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
