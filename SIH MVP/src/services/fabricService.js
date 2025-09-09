// Blockchain Service for Tourist Safety
// This service handles communication with the Hyperledger Fabric network

import axios from 'axios';

// Configuration for the blockchain network
const BLOCKCHAIN_CONFIG = {
  // In production, this would be your blockchain gateway/API endpoint
  // For development, we'll create a proxy service
  apiUrl: 'http://localhost:3001/api/blockchain',
  
  // Fabric network configuration
  network: {
    channel: 'mychannel',
    chaincode: 'tourist-safety',
    orderer: 'localhost:7050',
    peer1: 'localhost:7051',
    peer2: 'localhost:9051'
  }
};

class BlockchainService {
  constructor() {
    this.baseURL = BLOCKCHAIN_CONFIG.apiUrl;
  }

  /**
   * Register a tourist on the blockchain
   * @param {Object} touristData - Tourist registration data
   * @returns {Promise<Object>} - Blockchain response with digital ID
   */
  async registerTourist(touristData) {
    try {
      console.log('🔗 Registering tourist on blockchain...', touristData);

      // Transform frontend data to blockchain format
      const blockchainData = {
        id: this.generateTouristId(touristData),
        name: `${touristData.first_name || touristData.name} ${touristData.last_name || ''}`.trim(),
        email: touristData.email || touristData.contact?.email,
        phone: touristData.phone || touristData.phone_number || touristData.contact?.phone_number,
        nationality: touristData.nationality || 'Indian',
        passportNumber: touristData.passport?.number || touristData.passportNumber || '',
        emergencyContacts: this.formatEmergencyContacts(touristData.emergency_contact)
      };

      // Call blockchain API
      const response = await this.invokeChaincode('registerTourist', blockchainData);
      
      console.log('✅ Tourist registered on blockchain:', response);
      return response;

    } catch (error) {
      console.error('❌ Failed to register tourist on blockchain:', error);
      throw new Error(`Blockchain registration failed: ${error.message}`);
    }
  }

  /**
   * Create SOS Alert on blockchain
   * @param {Object} alertData - SOS alert data
   * @returns {Promise<Object>} - Blockchain response
   */
  async createSOSAlert(alertData) {
    try {
      console.log('🚨 Creating SOS alert on blockchain...', alertData);

      const blockchainData = {
        id: `sos_${Date.now()}`,
        touristId: alertData.touristId,
        description: alertData.description || 'Emergency SOS button pressed',
        location: alertData.location || {},
        recipients: alertData.recipients || ['emergency@police.gov.in', '+91-100']
      };

      const response = await this.invokeChaincode('createSOSAlert', blockchainData);
      
      console.log('✅ SOS Alert created on blockchain:', response);
      return response;

    } catch (error) {
      console.error('❌ Failed to create SOS alert on blockchain:', error);
      throw new Error(`SOS alert creation failed: ${error.message}`);
    }
  }

  /**
   * Generate e-FIR on blockchain
   * @param {Object} efirData - e-FIR data
   * @returns {Promise<Object>} - Blockchain response
   */
  async generateEFIR(efirData) {
    try {
      console.log('📋 Generating e-FIR on blockchain...', efirData);

      const blockchainData = {
        id: `efir_${Date.now()}`,
        touristId: efirData.touristId,
        incidentType: efirData.incidentType,
        description: efirData.description,
        location: efirData.location || {},
        policeStation: efirData.policeStation || '',
        authorityContacts: efirData.authorityContacts || ['police@delhi.gov.in']
      };

      const response = await this.invokeChaincode('generateEFIR', blockchainData);
      
      console.log('✅ e-FIR generated on blockchain:', response);
      return response;

    } catch (error) {
      console.error('❌ Failed to generate e-FIR on blockchain:', error);
      throw new Error(`e-FIR generation failed: ${error.message}`);
    }
  }

  /**
   * Get tourist data from blockchain
   * @param {string} touristId - Tourist ID
   * @returns {Promise<Object>} - Tourist data
   */
  async getTourist(touristId) {
    try {
      const response = await this.queryChaincode('getTourist', touristId);
      return response;
    } catch (error) {
      console.error('❌ Failed to get tourist from blockchain:', error);
      throw new Error(`Failed to get tourist data: ${error.message}`);
    }
  }

  /**
   * Get all tourists from blockchain
   * @returns {Promise<Array>} - Array of tourists
   */
  async getAllTourists() {
    try {
      const response = await this.queryChaincode('getAllTourists');
      return response || [];
    } catch (error) {
      console.error('❌ Failed to get all tourists from blockchain:', error);
      throw new Error(`Failed to get tourists: ${error.message}`);
    }
  }

  /**
   * Get all alerts from blockchain
   * @returns {Promise<Array>} - Array of alerts
   */
  async getAllAlerts() {
    try {
      const response = await this.queryChaincode('getAllAlerts');
      return response || [];
    } catch (error) {
      console.error('❌ Failed to get alerts from blockchain:', error);
      throw new Error(`Failed to get alerts: ${error.message}`);
    }
  }

  /**
   * Get all e-FIRs from blockchain
   * @returns {Promise<Array>} - Array of e-FIRs
   */
  async getAllEFIRs() {
    try {
      const response = await this.queryChaincode('getAllEFIRs');
      return response || [];
    } catch (error) {
      console.error('❌ Failed to get e-FIRs from blockchain:', error);
      throw new Error(`Failed to get e-FIRs: ${error.message}`);
    }
  }

  // Helper Methods

  /**
   * Invoke chaincode function (for transactions)
   * @param {string} functionName - Chaincode function name
   * @param {Object} args - Function arguments
   * @returns {Promise<Object>} - Blockchain response
   */
  async invokeChaincode(functionName, args) {
    try {
      // For development, we'll make direct calls to a proxy service
      // In production, this would use Fabric SDK
      const response = await axios.post(`${this.baseURL}/invoke`, {
        function: functionName,
        args: [JSON.stringify(args)]
      });

      return response.data;
    } catch (error) {
      console.error('🔗 Blockchain proxy connection error:', error.message);
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error') || error.response?.status === 503) {
        // Blockchain service unavailable - use mock data for development
        console.warn('⚠️ Blockchain proxy unavailable, using mock response');
        return this.getMockResponse(functionName, args);
      }
      throw error;
    }
  }

  /**
   * Query chaincode function (for read-only operations)
   * @param {string} functionName - Chaincode function name
   * @param {...any} args - Function arguments
   * @returns {Promise<Object>} - Blockchain response
   */
  async queryChaincode(functionName, ...args) {
    try {
      const response = await axios.post(`${this.baseURL}/query`, {
        function: functionName,
        args: args
      });

      return response.data;
    } catch (error) {
      console.error('🔍 Blockchain query connection error:', error.message);
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error') || error.response?.status === 503) {
        // Blockchain service unavailable - use mock data for development
        console.warn('⚠️ Blockchain proxy unavailable, using mock response');
        return this.getMockResponse(functionName, args);
      }
      throw error;
    }
  }

  /**
   * Generate unique tourist ID
   * @param {Object} touristData - Tourist data
   * @returns {string} - Unique tourist ID
   */
  generateTouristId(touristData) {
    const name = (touristData.first_name || touristData.name || 'user').toLowerCase();
    const timestamp = Date.now();
    return `${name}_${timestamp}`;
  }

  /**
   * Format emergency contacts for blockchain
   * @param {Object} emergencyContact - Emergency contact data
   * @returns {Array} - Formatted emergency contacts
   */
  formatEmergencyContacts(emergencyContact) {
    if (!emergencyContact) return [];
    
    return [{
      name: emergencyContact.name || '',
      relationship: emergencyContact.relationship || '',
      phone: emergencyContact.phone_number || ''
    }];
  }

  /**
   * Get mock response for development (when blockchain is unavailable)
   * @param {string} functionName - Function name
   * @param {any} args - Arguments
   * @returns {Object} - Mock response
   */
  getMockResponse(functionName, args) {
    const baseResponse = {
      timestamp: new Date().toISOString(),
      txId: `mock_${Date.now()}`,
      success: true
    };

    switch (functionName) {
      case 'registerTourist':
        return {
          success: true,
          result: {
            ...baseResponse,
            ...args,
            digitalId: `DID_${args.id}_${Date.now()}`,
            safetyScore: 75,
            status: 'active',
            isDeleted: false,
            createdAt: baseResponse.timestamp,
            updatedAt: baseResponse.timestamp,
            // Mock NFT data
            nftCreated: true,
            ipfsHash: `QmT${Math.random().toString(36).substr(2, 44)}`,
            nftMetadata: {
              name: `Tourist Digital Identity - ${args.name}`,
              description: `Digital identity NFT for ${args.id}`,
              image: `https://api.dicebear.com/7.x/identicon/svg?seed=${args.id}`
            }
          },
          message: 'Mock blockchain registration completed',
          mock: true
        };

      case 'createSOSAlert':
        return {
          ...baseResponse,
          ...args,
          type: 'panic',
          severity: 'critical',
          status: 'open',
          title: 'SOS Emergency Alert',
          notificationSent: false
        };

      case 'generateEFIR':
        return {
          ...baseResponse,
          ...args,
          firNumber: `FIR_${args.id}_${Date.now()}`,
          status: 'filed',
          documentHash: Math.random().toString(16).substr(2, 8),
          notificationSent: false
        };

      case 'getAllTourists':
        return [];

      case 'getAllAlerts':
        return [];

      case 'getAllEFIRs':
        return [];

      case 'getTourist': {
        // args may be array [touristId]
        const touristId = Array.isArray(args) ? args[0] : args?.id || `tourist_${Date.now()}`;
        const name = touristId.split('_')[0] || 'Tourist';
        const baseTs = new Date().toISOString();
        return {
          id: touristId,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          first_name: name.charAt(0).toUpperCase() + name.slice(1),
          last_name: 'User',
          email: `${name}@example.com`,
          phone: '+91-9999999999',
          nationality: 'Indian',
          digitalId: `DID_${touristId}`,
          safetyScore: 80,
          status: 'active',
          createdAt: baseTs,
          updatedAt: baseTs,
        };
      }

      default:
        return baseResponse;
    }
  }

  /**
   * Check if blockchain service is available
   * @returns {Promise<boolean>} - Service availability
   */
  async checkService() {
    try {
      await axios.get(`${this.baseURL}/health`);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();
export default blockchainService;
