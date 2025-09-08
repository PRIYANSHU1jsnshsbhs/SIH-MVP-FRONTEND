import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export function useAuthGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setChecking(false);
        if (location.pathname !== "/login" && location.pathname !== "/signup") {
          navigate("/login");
        }
        return;
      }
      setIsAuthenticated(true);
      // Check profile completeness
      try {
        const res = await axios.get("http://localhost:8080/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // You should return a boolean or a field from backend indicating completeness
        setIsProfileComplete(res.data.profileComplete);
        setChecking(false);
        if (
          !res.data.profileComplete &&
          location.pathname !== "/complete-your-profile"
        ) {
          navigate("/complete-your-profile");
        } else if (
          res.data.profileComplete &&
          location.pathname === "/complete-your-profile"
        ) {
          navigate("/");
        }
      } catch {
        setIsAuthenticated(false);
        setChecking(false);
        navigate("/login");
      }
    }
    checkAuth();
    // eslint-disable-next-line
  }, [location.pathname]);

  return { checking, isAuthenticated, isProfileComplete };
}
