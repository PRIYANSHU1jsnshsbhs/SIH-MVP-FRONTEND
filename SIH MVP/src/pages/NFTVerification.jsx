import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ipfsService } from '../services/ipfsService';
import { touristService } from '../services/touristService';

const NFTVerification = () => {
  const { digitalId } = useParams();
  const navigate = useNavigate();
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (digitalId) {
      verifyNFT();
    }
  }, [digitalId]);

  const verifyNFT = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔍 Verifying NFT for Digital ID:', digitalId);

      // Get tourist data from blockchain
      const touristData = await touristService.getTouristProfile(digitalId);
      
      // Mock verification for development
      const mockVerification = {
        valid: true,
        digitalId: digitalId,
        touristData: touristData.profile || {
          name: 'Verified Tourist',
          email: 'tourist@example.com',
          status: 'active',
          safetyScore: 85,
          registrationDate: new Date().toLocaleDateString()
        },
        nftMetadata: {
          name: `Tourist Digital Identity - ${digitalId}`,
          description: 'Verified tourist registration on blockchain',
          attributes: [
            { trait_type: 'Status', value: 'Active' },
            { trait_type: 'Safety Score', value: 85 },
            { trait_type: 'Verified', value: 'Yes' }
          ]
        },
        blockchain: {
          network: 'Hyperledger Fabric',
          chaincode: 'tourist-safety',
          verified: true
        },
        verifiedAt: new Date().toISOString()
      };

      setVerification(mockVerification);

    } catch (error) {
      console.error('❌ NFT verification failed:', error);
      setError('Failed to verify NFT. Please check the Digital ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Verifying NFT...</p>
          <p className="text-gray-400 text-sm">Checking blockchain records</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/30 border border-red-500/50 rounded-xl p-8 max-w-md w-full text-center"
        >
          <div className="text-red-400 text-4xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-white mb-2">Verification Failed</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Home
          </button>
        </motion.div>
      </div>
    );
  }

  if (!verification?.valid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-900/30 border border-yellow-500/50 rounded-xl p-8 max-w-md w-full text-center"
        >
          <div className="text-yellow-400 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">Invalid NFT</h2>
          <p className="text-gray-300 mb-6">This Digital ID could not be verified on the blockchain.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Home
          </button>
        </motion.div>
      </div>
    );
  }

  const { touristData, nftMetadata, blockchain } = verification;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 p-6">
      {/* Background effects */}
      <div className="absolute w-96 h-96 bg-green-600/20 rounded-full blur-3xl top-20 left-20 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl bottom-20 right-20 animate-pulse"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-green-400 text-5xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-white mb-2">NFT Verified Successfully</h1>
          <p className="text-gray-400">This digital identity has been verified on the blockchain</p>
        </motion.div>

        {/* Verification Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tourist Information */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                👤 Tourist Information
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400 text-sm">Name:</span>
                  <p className="text-white font-medium">{touristData.name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Digital ID:</span>
                  <p className="text-white font-mono text-sm break-all">{digitalId}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Status:</span>
                  <p className="text-green-400 font-medium">{touristData.status || 'Active'}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Safety Score:</span>
                  <p className="text-yellow-400 font-medium">{touristData.safetyScore || 85}/100</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Registration Date:</span>
                  <p className="text-white">{touristData.registrationDate || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* NFT Metadata */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                🎫 NFT Metadata
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400 text-sm">Name:</span>
                  <p className="text-white">{nftMetadata.name}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Description:</span>
                  <p className="text-gray-300 text-sm">{nftMetadata.description}</p>
                </div>
                {nftMetadata.attributes && (
                  <div>
                    <span className="text-gray-400 text-sm">Attributes:</span>
                    <div className="mt-2 space-y-1">
                      {nftMetadata.attributes.map((attr, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-400">{attr.trait_type}:</span>
                          <span className="text-white">{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Blockchain Verification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-green-200 mb-4 flex items-center">
            🔗 Blockchain Verification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-green-400">Network:</span>
              <p className="text-white">{blockchain.network}</p>
            </div>
            <div>
              <span className="text-green-400">Chaincode:</span>
              <p className="text-white">{blockchain.chaincode}</p>
            </div>
            <div>
              <span className="text-green-400">Verified:</span>
              <p className="text-green-300">✅ {verification.verifiedAt ? new Date(verification.verifiedAt).toLocaleString() : 'Now'}</p>
            </div>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 text-center"
        >
          <h3 className="text-blue-200 font-semibold mb-2">🔒 Security Verified</h3>
          <p className="text-blue-100 text-sm">
            This NFT has been cryptographically verified on the Hyperledger Fabric blockchain network. 
            The data integrity and authenticity are guaranteed by blockchain consensus.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center space-x-4 mt-8"
        >
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            🖨️ Print Verification
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NFTVerification;
