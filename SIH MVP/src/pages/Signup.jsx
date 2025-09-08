import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
      const res = await axios.post(
        "http://localhost:8080/api/auth/register",
        { name, email, phone, password },
        { withCredentials: true }
      );
      setSuccess(res.data.message);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute w-72 h-72 bg-purple-600/30 rounded-full blur-3xl top-16 left-12 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl bottom-16 right-12 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20 relative"
      >
        <h2 className="text-4xl font-extrabold text-white mb-6 text-center tracking-wide drop-shadow-lg">
          Create Account ✨
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Join us and explore the dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-gray-900/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl bg-gray-900/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full px-4 py-3 rounded-xl bg-gray-900/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-gray-900/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
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
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-900/40 transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </motion.button>
        </form>

        {/* Extra Links */}
        <div className="mt-6 flex justify-between text-sm text-gray-400">
          <a href="/login" className="hover:text-blue-400 transition-colors">
            Already have an account?
          </a>
          <a href="#" className="hover:text-purple-400 transition-colors">
            Terms & Conditions
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
