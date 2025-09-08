import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Signin from "./pages/Signup.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CompleteYourProfile from "./pages/CompleteYourProfile.jsx";
import { useAuthGuard } from "./hooks/useAuthGuard";

function ProtectedRoutes() {
  const { checking } = useAuthGuard();
  if (checking)
    return <div className="text-white text-center mt-20">Loading...</div>;
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signin />} />
      <Route path="/complete-your-profile" element={<CompleteYourProfile />} />
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
