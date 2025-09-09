import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Signin from "./pages/Signup.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CompleteYourProfile from "./pages/CompleteYourProfile.jsx";
import { useAuthGuard } from "./hooks/useAuthGuard";
import Profile from "./pages/Profile.jsx";
import NFTVerification from "./pages/NFTVerification.jsx";

function ProtectedRoutes() {
  const { checking, isAuthenticated } = useAuthGuard();
  
  if (checking)
    return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <Routes>
      {/* Public routes - always accessible */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signin />} />
      <Route path="/verify/:digitalId" element={<NFTVerification />} />
      <Route path="/nft/verify/:digitalId" element={<NFTVerification />} />
      
      {/* Home route - show login if not authenticated, dashboard if authenticated */}
      <Route 
        path="/" 
        element={isAuthenticated ? <App /> : <Login />} 
      />
      
      {/* Protected routes - redirect to login if not authenticated */}
      <Route 
        path="/complete-your-profile" 
        element={isAuthenticated ? <CompleteYourProfile /> : <Login />} 
      />
      <Route 
        path="/complete-profile" 
        element={isAuthenticated ? <CompleteYourProfile /> : <Login />} 
      />
      <Route 
        path="/profile" 
        element={isAuthenticated ? <Profile /> : <Login />} 
      />
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <App /> : <Login />} 
      />
      
      {/* Catch all - redirect to login */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProtectedRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
