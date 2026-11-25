import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { AuthContext } from "@/lib/auth-context";
import { clearDemoSession, hasDemoSession, setDemoSession } from "@/lib/demo-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  // El shell se prerenderiza con SSR: empezamos sin sesión y leemos el flag al montar.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(hasDemoSession());
  }, []);

  const login = useCallback(() => {
    setDemoSession();
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    clearDemoSession();
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
