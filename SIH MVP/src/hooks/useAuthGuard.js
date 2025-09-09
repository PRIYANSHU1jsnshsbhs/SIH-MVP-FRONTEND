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
      const touristId = localStorage.getItem('touristId');
      const digitalId = localStorage.getItem('digitalId');
      
      // If no token but have blockchain credentials, use blockchain auth
      if (!token && (touristId && digitalId)) {
        console.log('🔗 Using blockchain-only authentication');
        const profileCompleted = localStorage.getItem('profileCompleted') === 'true';
        console.log('📋 Blockchain profile completion status:', profileCompleted);
        
        setIsAuthenticated(true);
        setIsProfileComplete(profileCompleted);
        setChecking(false);
        
        // Navigate based on profile completion
        if (!profileCompleted && location.pathname !== "/complete-your-profile" && location.pathname !== "/complete-profile") {
          console.log('🔄 Blockchain: Redirecting to complete profile...');
          navigate("/complete-your-profile");
        } else if (profileCompleted && (location.pathname === "/complete-your-profile" || location.pathname === "/complete-profile")) {
          console.log('✅ Blockchain: Profile completed, redirecting to dashboard...');
          navigate("/dashboard");
        }
        return;
      }
      
      if (!token) {
        setIsAuthenticated(false);
        setChecking(false);
        if (location.pathname !== "/login" && location.pathname !== "/signup") {
          navigate("/login");
        }
        return;
      }
      
      setIsAuthenticated(true);
      
      // Try blockchain-based token first (check if it's a blockchain token)
      try {
        const decodedToken = JSON.parse(atob(token));
        if (decodedToken.blockchain || touristId) {
          console.log('🔗 Using blockchain-based authentication');
          const profileCompleted = localStorage.getItem('profileCompleted') === 'true';
          console.log('📋 Profile completion status:', profileCompleted);
          
          setIsProfileComplete(profileCompleted);
          setChecking(false);
          
          // Navigate based on profile completion
          if (!profileCompleted && location.pathname !== "/complete-your-profile" && location.pathname !== "/complete-profile") {
            console.log('🔄 Redirecting to complete profile...');
            navigate("/complete-your-profile");
          } else if (profileCompleted && (location.pathname === "/complete-your-profile" || location.pathname === "/complete-profile")) {
            console.log('✅ Profile completed, redirecting to dashboard...');
            navigate("/dashboard");
          }
          return;
        }
      } catch (e) {
        // Not a blockchain token, continue with backend check
        console.log('🔄 Token decode failed, trying backend...');
      }
      
      // Check profile completeness with backend
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
      } catch (error) {
        console.warn('⚠️ Backend authentication failed, checking blockchain auth...');
        
        // If backend fails, check if we have blockchain data as fallback
        if (touristId && digitalId) {
          console.log('🔗 Using blockchain authentication as fallback');
          const profileCompleted = localStorage.getItem('profileCompleted') === 'true';
          console.log('📋 Fallback profile completion status:', profileCompleted);
          
          setIsAuthenticated(true);
          setIsProfileComplete(profileCompleted);
          setChecking(false);
          
          // Navigate based on profile completion
          if (!profileCompleted && location.pathname !== "/complete-your-profile" && location.pathname !== "/complete-profile") {
            console.log('🔄 Fallback: Redirecting to complete profile...');
            navigate("/complete-your-profile");
          } else if (profileCompleted && (location.pathname === "/complete-your-profile" || location.pathname === "/complete-profile")) {
            console.log('✅ Fallback: Profile completed, redirecting to dashboard...');
            navigate("/dashboard");
          }
        } else {
          console.log('❌ No valid authentication found');
          setIsAuthenticated(false);
          setChecking(false);
          navigate("/login");
        }
      }
    }
    checkAuth();
    // eslint-disable-next-line
  }, [location.pathname]);

  return { checking, isAuthenticated, isProfileComplete };
}
