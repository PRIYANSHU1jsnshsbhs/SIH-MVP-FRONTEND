/**
 * Blockchain Proxy Server
 * This server acts as a proxy between the frontend and the Hyperledger Fabric network
 * In development mode, it provides mock responses when the blockchain is unavailable
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const FabricService = require('./fabricService');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Fabric service
const fabricService = new FabricService();
let blockchainReady = false;

// Initialize blockchain connection on startup
(async () => {
  try {
    blockchainReady = await fabricService.initialize();
    if (blockchainReady) {
      console.log('🔗 Real blockchain integration active');
    } else {
      console.log('📝 Running in mock mode - blockchain unavailable');
    }
  } catch (error) {
    console.error('❌ Blockchain initialization failed:', error);
    console.log('📝 Running in mock mode');
    blockchainReady = false;
  }
})();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Vite dev server and other common ports
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint
app.get('/api/blockchain/health', (req, res) => {
  const fabricStatus = fabricService.getStatus();
  res.json({
    status: 'healthy',
    service: 'blockchain-proxy',
    timestamp: new Date().toISOString(),
    blockchain: {
      connected: blockchainReady,
      network: blockchainReady ? 'hyperledger-fabric' : 'mock',
      chaincode: 'tourist-safety',
      ...fabricStatus
    }
  });
});

// Mock blockchain invoke endpoint
app.post('/api/blockchain/invoke', async (req, res) => {
  try {
    const { function: functionName, args } = req.body;
    
    console.log(`🔗 Blockchain Invoke: ${functionName}`, args);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let response = {};
    
    switch (functionName) {
      case 'registerTourist':
        const touristData = JSON.parse(args[0]);
        response = {
          id: touristData.id,
          ...touristData,
          digitalId: `DID_${touristData.id}_${Date.now()}`,
          safetyScore: 75,
          status: 'active',
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          txId: `tx_${Date.now()}`,
          blockHash: `block_${Math.random().toString(16).substr(2, 8)}`,
          timestamp: new Date().toISOString()
        };
        break;
        
      case 'createSOSAlert':
        const alertData = JSON.parse(args[0]);
        response = {
          id: alertData.id,
          ...alertData,
          type: 'panic',
          severity: 'critical',
          status: 'open',
          title: 'SOS Emergency Alert',
          notificationSent: false,
          createdAt: new Date().toISOString(),
          txId: `tx_${Date.now()}`,
          blockHash: `block_${Math.random().toString(16).substr(2, 8)}`,
          timestamp: new Date().toISOString()
        };
        break;
        
      case 'generateEFIR':
        const efirData = JSON.parse(args[0]);
        response = {
          id: efirData.id,
          ...efirData,
          firNumber: `FIR_${efirData.id}_${Date.now()}`,
          status: 'filed',
          documentHash: Math.random().toString(16).substr(2, 8),
          notificationSent: false,
          createdAt: new Date().toISOString(),
          txId: `tx_${Date.now()}`,
          blockHash: `block_${Math.random().toString(16).substr(2, 8)}`,
          timestamp: new Date().toISOString()
        };
        break;
        
      default:
        response = {
          success: true,
          message: `Function ${functionName} executed successfully`,
          txId: `tx_${Date.now()}`,
          timestamp: new Date().toISOString()
        };
    }
    
    res.json({
      success: true,
      result: response,
      message: `Mock blockchain transaction completed for ${functionName}`,
      mock: true // Indicates this is a mock response
    });
    
  } catch (error) {
    console.error('❌ Blockchain invoke error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      mock: true
    });
  }
});

// Mock blockchain query endpoint
app.post('/api/blockchain/query', async (req, res) => {
  try {
    const { function: functionName, args } = req.body;
    
    console.log(`🔍 Blockchain Query: ${functionName}`, args);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let response = {};
    
    switch (functionName) {
      case 'getTourist':
        const touristId = args[0];
        response = {
          id: touristId,
          name: 'Mock Tourist',
          email: 'mock@example.com',
          phone: '+91-9876543210',
          digitalId: `DID_${touristId}_mock`,
          safetyScore: 75,
          status: 'active',
          createdAt: new Date().toISOString()
        };
        break;
        
      case 'getAllTourists':
        response = [
          {
            id: 'tourist_1',
            name: 'John Doe',
            email: 'john@example.com',
            digitalId: 'DID_tourist_1_mock',
            status: 'active'
          },
          {
            id: 'tourist_2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            digitalId: 'DID_tourist_2_mock',
            status: 'active'
          }
        ];
        break;
        
      case 'getAllAlerts':
        response = [
          {
            id: 'sos_1',
            touristId: 'tourist_1',
            type: 'panic',
            severity: 'critical',
            status: 'resolved',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ];
        break;
        
      case 'getAllEFIRs':
        response = [
          {
            id: 'efir_1',
            touristId: 'tourist_1',
            firNumber: 'FIR_efir_1_mock',
            incidentType: 'theft',
            status: 'filed',
            createdAt: new Date(Date.now() - 172800000).toISOString()
          }
        ];
        break;
        
      default:
        response = {
          message: `Query ${functionName} completed`,
          data: null
        };
    }
    
    res.json({
      success: true,
      result: response,
      message: `Mock blockchain query completed for ${functionName}`,
      mock: true
    });
    
  } catch (error) {
    console.error('❌ Blockchain query error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      mock: true
    });
  }
});

// Real blockchain endpoints (for when Fabric network is available)
app.post('/api/blockchain/fabric/invoke', async (req, res) => {
  // TODO: Implement real Fabric SDK integration
  res.status(503).json({
    success: false,
    error: 'Real blockchain integration not yet implemented',
    message: 'Please use the mock endpoints for development'
  });
});

app.post('/api/blockchain/fabric/query', async (req, res) => {
  // TODO: Implement real Fabric SDK integration
  res.status(503).json({
    success: false,
    error: 'Real blockchain integration not yet implemented',
    message: 'Please use the mock endpoints for development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Path ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Blockchain Proxy Server running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api/blockchain`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/blockchain/health`);
  console.log(`🌐 CORS enabled for frontend development`);
  console.log(`📝 Mock mode active - real blockchain integration pending`);
});

module.exports = app;
