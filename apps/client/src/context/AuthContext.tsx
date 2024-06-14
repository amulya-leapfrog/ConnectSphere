import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLogin: () => void;
  isLogout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLogin: () => {},
  isLogout: () => {},
});

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isLogin = () => setIsAuthenticated(true);
  const isLogout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLogin, isLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
