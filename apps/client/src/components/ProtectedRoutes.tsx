import { Navigate } from "react-router-dom";
import { AuthProviderProps, useAuth } from "../context/AuthContext";
import { getCookie } from "../utils/cookies";
import { TOKEN } from "../constants/tokens";

export default function ProtectedRoute({ children }: AuthProviderProps) {
  const { isAuthenticated } = useAuth();
  const accessToken = getCookie(TOKEN.ACCESS_TOKEN);

  if (!accessToken && !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
}
