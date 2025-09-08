import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Signin from "./pages/Signup.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CompleteYourProfile from "./pages/CompleteYourProfile.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signin />} />
        <Route path="/complete-your-profile" element={<CompleteYourProfile />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
