import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });
      setSuccess(res.data.message);
      localStorage.setItem("token", res.data.token);
      setTimeout(() => navigate("/complete-your-profile"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950 relative overflow-hidden">
      {/* Glowing background orbs */}
      <div className="absolute w-72 h-72 bg-blue-600/30 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20 relative"
      >
        <h2 className="text-4xl font-extrabold text-white mb-6 text-center tracking-wide drop-shadow-lg">
          Welcome Back 👋
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Sign in to continue to your dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl bg-gray-900/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-gray-900/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error / Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-400 text-sm text-center"
            >
              {success}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/40 transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        {/* Extra Links */}
        <div className="mt-6 flex justify-between text-sm text-gray-400">
          <a href="#" className="hover:text-blue-400 transition-colors">
            Forgot password?
          </a>
          <a href="/signup" className="hover:text-purple-400 transition-colors">
            Create account
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
