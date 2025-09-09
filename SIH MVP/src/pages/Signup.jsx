import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { touristService } from '../services/touristService.js';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [blockchainStatus, setBlockchainStatus] = useState('checking');
  const navigate = useNavigate();

  // Check blockchain status on component mount
  useEffect(() => {
    const checkBlockchain = async () => {
      try {
        const status = await touristService.checkBlockchainStatus();
        setBlockchainStatus(status ? 'connected' : 'disconnected');
      } catch (error) {
        setBlockchainStatus('disconnected');
      }
    };
    checkBlockchain();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🚀 Starting blockchain registration process...');
      
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords don't match");
      }

      // Register tourist on blockchain
      const blockchainResult = await touristService.registerTourist({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password // Note: In production, hash this before sending
      });

      console.log('✅ Blockchain registration successful:', blockchainResult);

      // Store essential data in localStorage for the session
      localStorage.setItem('touristId', blockchainResult.touristId);
      localStorage.setItem('digitalId', blockchainResult.digitalId);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userName', formData.name);

      // Store NFT data if available
      if (blockchainResult.nft) {
        localStorage.setItem('touristNFT', JSON.stringify(blockchainResult.nft));
        console.log('💾 NFT data stored in localStorage');
      }

      setSuccess(`Registration successful! Your Digital ID: ${blockchainResult.digitalId}${blockchainResult.nft ? ' • NFT Created!' : ''}`);

      // Also try to register with traditional backend (optional fallback)
      try {
        const backendResponse = await axios.post('http://localhost:8080/api/auth/register', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          blockchainId: blockchainResult.touristId,
          digitalId: blockchainResult.digitalId
        });
        
        console.log('📄 Traditional backend registration also completed');
        
        // If backend registration is successful, store the token
        if (backendResponse.data.token) {
          localStorage.setItem('token', backendResponse.data.token);
          console.log('🔑 Authentication token stored');
        }
        
      } catch (backendError) {
        console.warn('⚠️ Traditional backend registration failed (continuing with blockchain only):', backendError.message);
        
        // Even if backend fails, we can create a mock token for the session based on blockchain data
        const mockToken = btoa(JSON.stringify({
          touristId: blockchainResult.touristId,
          digitalId: blockchainResult.digitalId,
          email: formData.email,
          blockchain: true,
          timestamp: Date.now()
        }));
        localStorage.setItem('token', mockToken);
        console.log('🔗 Blockchain-based session token created');
      }

      // Navigate to complete profile after 2 seconds
      setTimeout(() => {
        navigate('/complete-profile', { 
          state: { 
            userId: blockchainResult.touristId,
            email: formData.email,
            name: formData.name,
            fromSignup: true
          } 
        });
      }, 2000);

    } catch (error) {
      console.error('❌ Registration failed:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.message.includes('email')) {
        errorMessage = 'This email is already registered. Please use a different email.';
      } else if (error.message.includes('phone')) {
        errorMessage = 'Invalid phone number format. Please check and try again.';
      } else if (error.message.includes('Passwords')) {
        errorMessage = "Passwords don't match. Please check and try again.";
      } else if (error.message.includes('Blockchain')) {
        errorMessage = 'Blockchain registration failed. Please try again or contact support.';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
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
              name="name"
              className="w-full px-4 py-3 rounded-xl bg-gray-900/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-3 rounded-xl bg-gray-900/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
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
              name="phone"
              className="w-full px-4 py-3 rounded-xl bg-gray-900/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder-gray-500"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-3 rounded-xl bg-gray-900/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full px-4 py-3 rounded-xl bg-gray-900/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Blockchain Status Indicator */}
          <div className="flex items-center justify-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${
              blockchainStatus === 'connected' ? 'bg-green-500' : 
              blockchainStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-gray-400">
              Blockchain: {
                blockchainStatus === 'connected' ? '🔗 Connected' : 
                blockchainStatus === 'disconnected' ? '❌ Disconnected (Mock Mode)' : '⏳ Checking...'
              }
            </span>
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
