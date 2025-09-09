import React, { useState } from 'react';
import { motion } from 'framer-motion';

const QRCodeDisplay = ({ 
  qrCodeUrl, 
  digitalId, 
  ipfsUrl, 
  touristName,
  onDownload 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Default download functionality
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `tourist-nft-qr-${digitalId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Tourist Digital Identity',
          text: `Check out my verified tourist NFT: ${digitalId}`,
          url: ipfsUrl
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(ipfsUrl).then(() => {
        alert('NFT link copied to clipboard!');
      });
    }
  };

  if (!qrCodeUrl) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 text-center">
        <div className="w-32 h-32 mx-auto bg-gray-700 rounded-lg flex items-center justify-center mb-4">
          <div className="text-gray-400">
            📄 No QR Code
          </div>
        </div>
        <p className="text-gray-400 text-sm">QR code will appear after registration</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/20"
    >
      {/* Header */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">
          🎫 Your Digital Identity NFT
        </h3>
        <p className="text-gray-300 text-sm">
          Scan QR code to verify your tourist registration
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-4">
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <img 
            src={qrCodeUrl} 
            alt="Tourist NFT QR Code"
            className="w-32 h-32 block"
          />
        </div>
      </div>

      {/* Tourist Info */}
      <div className="text-center mb-4">
        <p className="text-white font-medium">{touristName || 'Tourist'}</p>
        <p className="text-gray-400 text-xs font-mono">
          {digitalId ? `ID: ${digitalId.substring(0, 20)}...` : 'No ID'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={handleDownload}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
        >
          <span>📱</span>
          <span>Download</span>
        </button>
        
        <button
          onClick={handleShare}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
        >
          <span>🔗</span>
          <span>Share</span>
        </button>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
        >
          {showDetails ? '📋' : 'ℹ️'}
        </button>
      </div>

      {/* Details Panel */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-800/50 rounded-lg p-4 text-xs space-y-2"
        >
          <div>
            <span className="text-gray-400">Digital ID:</span>
            <p className="text-white font-mono break-all">{digitalId}</p>
          </div>
          
          {ipfsUrl && (
            <div>
              <span className="text-gray-400">IPFS URL:</span>
              <a 
                href={ipfsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-mono break-all block"
              >
                {ipfsUrl}
              </a>
            </div>
          )}
          
          <div>
            <span className="text-gray-400">Status:</span>
            <span className="text-green-400 ml-2">✅ Verified on Blockchain</span>
          </div>
          
          <div>
            <span className="text-gray-400">Created:</span>
            <span className="text-white ml-2">{new Date().toLocaleDateString()}</span>
          </div>
        </motion.div>
      )}

      {/* Security Notice */}
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mt-4">
        <p className="text-yellow-200 text-xs flex items-start space-x-2">
          <span>🔒</span>
          <span>
            This QR code contains your verified digital identity. 
            Keep it secure and only share with authorized personnel.
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default QRCodeDisplay;
