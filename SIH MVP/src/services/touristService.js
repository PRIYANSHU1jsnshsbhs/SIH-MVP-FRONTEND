// Tourist Service for handling tourist-related operations
// This service acts as a bridge between the frontend and blockchain

import { blockchainService } from './fabricService.js';
import { ipfsService } from './ipfsService.js';

class TouristService {
  constructor() {
    this.blockchain = blockchainService;
    this.ipfs = ipfsService;
  }

  /**
   * Register a new tourist
   * Handles both basic signup and complete profile data
   * @param {Object} userData - User data from registration forms
   * @param {Object} profileData - Additional profile data (optional)
   * @returns {Promise<Object>} - Registration result with digital ID
   */
  async registerTourist(userData, profileData = null) {
    try {
      console.log('🌟 Starting tourist registration process...', { userData, profileData });

      // Merge signup and profile data
      const completeData = this.mergeUserData(userData, profileData);
      
      // Validate required fields
      this.validateRegistrationData(completeData);

      // Register on blockchain
      const blockchainResult = await this.blockchain.registerTourist(completeData);

      console.log('✅ Tourist registered on blockchain:', blockchainResult);

      // Handle both real blockchain response and mock response
      const touristData = blockchainResult.result || blockchainResult;

      // Create NFT and upload to IPFS
      console.log('🎨 Creating NFT for tourist...');
      const nftResult = await this.ipfs.createTouristNFT(completeData, touristData.digitalId);
      
      console.log('✅ NFT created and uploaded to IPFS:', nftResult);

      // Return success response with NFT data
      const result = {
        success: true,
        message: blockchainResult.mock ? 
          'Tourist registered successfully with NFT! (Mock Mode)' : 
          'Tourist registered successfully with NFT!',
        digitalId: touristData.digitalId,
        touristId: touristData.id,
        blockchain: touristData,
        nft: {
          ipfsHash: nftResult.ipfsHash,
          ipfsUrl: nftResult.ipfsUrl,
          qrCode: nftResult.qrCodeUrl,
          metadata: nftResult.nftMetadata
        },
        userData: completeData,
        mock: blockchainResult.mock || false
      };

      console.log('✅ Tourist registration completed:', result);
      return result;

    } catch (error) {
      console.error('❌ Tourist registration failed:', error);
      
      // Handle different types of errors
      let errorMessage = `Registration failed: ${error.message}`;
      
      if (error.message.includes('NFT')) {
        errorMessage = `Registration completed but NFT creation failed: ${error.message}`;
      } else if (error.message.includes('IPFS')) {
        errorMessage = `Registration completed but IPFS upload failed: ${error.message}`;
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Create SOS alert for tourist
   * @param {string} touristId - Tourist ID
   * @param {Object} alertData - Alert data (location, description, etc.)
   * @returns {Promise<Object>} - SOS alert result
   */
  async createSOSAlert(touristId, alertData = {}) {
    try {
      console.log('🚨 Creating SOS alert for tourist:', touristId);

      const sosData = {
        touristId,
        description: alertData.description || 'Emergency SOS button pressed',
        location: alertData.location || this.getCurrentLocation(),
        recipients: alertData.recipients || ['emergency@police.gov.in', '+91-100']
      };

      const result = await this.blockchain.createSOSAlert(sosData);
      
      console.log('✅ SOS Alert created successfully:', result);
      return {
        success: true,
        message: 'SOS Alert sent successfully!',
        alertId: result.id,
        blockchain: result
      };

    } catch (error) {
      console.error('❌ SOS Alert creation failed:', error);
      throw new Error(`SOS Alert failed: ${error.message}`);
    }
  }

  /**
   * Generate e-FIR for tourist
   * @param {string} touristId - Tourist ID
   * @param {Object} efirData - e-FIR data
   * @returns {Promise<Object>} - e-FIR result
   */
  async generateEFIR(touristId, efirData) {
    try {
      console.log('📋 Generating e-FIR for tourist:', touristId);

      const firData = {
        touristId,
        incidentType: efirData.incidentType || 'theft',
        description: efirData.description,
        location: efirData.location || this.getCurrentLocation(),
        policeStation: efirData.policeStation || '',
        authorityContacts: efirData.authorityContacts || ['police@delhi.gov.in']
      };

      const result = await this.blockchain.generateEFIR(firData);
      
      console.log('✅ e-FIR generated successfully:', result);
      return {
        success: true,
        message: 'e-FIR filed successfully!',
        firNumber: result.firNumber,
        efirId: result.id,
        blockchain: result
      };

    } catch (error) {
      console.error('❌ e-FIR generation failed:', error);
      throw new Error(`e-FIR generation failed: ${error.message}`);
    }
  }

  /**
   * Get tourist profile data
   * @param {string} touristId - Tourist ID
   * @returns {Promise<Object>} - Tourist profile
   */
  async getTouristProfile(touristId) {
    try {
      console.log('👤 Getting tourist profile:', touristId);
      
      const result = await this.blockchain.getTourist(touristId);
      
      return {
        success: true,
        profile: result
      };

    } catch (error) {
      console.error('❌ Failed to get tourist profile:', error);
      throw new Error(`Failed to get profile: ${error.message}`);
    }
  }

  /**
   * Update tourist profile
   * @param {string} touristId - Tourist ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Update result
   */
  async updateTouristProfile(touristId, updateData) {
    try {
      console.log('🔄 Updating tourist profile:', touristId);

      // For now, we'll register a new version (in a real system, you'd have an update function)
      // This is because our current chaincode doesn't have an update function
      const result = await this.blockchain.registerTourist({
        ...updateData,
        id: touristId
      });

      return {
        success: true,
        message: 'Profile updated successfully!',
        blockchain: result
      };

    } catch (error) {
      console.error('❌ Profile update failed:', error);
      throw new Error(`Profile update failed: ${error.message}`);
    }
  }

  /**
   * Get tourist's alerts and e-FIRs
   * @param {string} touristId - Tourist ID
   * @returns {Promise<Object>} - Tourist's safety records
   */
  async getTouristSafetyRecords(touristId) {
    try {
      console.log('📊 Getting safety records for tourist:', touristId);

      const [allAlerts, allEFIRs] = await Promise.all([
        this.blockchain.getAllAlerts(),
        this.blockchain.getAllEFIRs()
      ]);

      // Filter records for this tourist
      const touristAlerts = allAlerts.filter(alert => alert.touristId === touristId);
      const touristEFIRs = allEFIRs.filter(efir => efir.touristId === touristId);

      return {
        success: true,
        records: {
          alerts: touristAlerts,
          efirs: touristEFIRs,
          totalAlerts: touristAlerts.length,
          totalEFIRs: touristEFIRs.length
        }
      };

    } catch (error) {
      console.error('❌ Failed to get safety records:', error);
      throw new Error(`Failed to get safety records: ${error.message}`);
    }
  }

  // Helper Methods

  /**
   * Merge basic user data with complete profile data
   * @param {Object} userData - Basic user data from signup
   * @param {Object} profileData - Complete profile data
   * @returns {Object} - Merged data
   */
  mergeUserData(userData, profileData) {
    if (!profileData) {
      // Only basic signup data
      return {
        first_name: userData.name?.split(' ')[0] || userData.first_name,
        last_name: userData.name?.split(' ').slice(1).join(' ') || userData.last_name || '',
        email: userData.email,
        phone: userData.phone || userData.phone_number,
        nationality: 'Indian' // Default
      };
    }

    // Merge both datasets
    return {
      // Basic info from signup
      first_name: userData.name?.split(' ')[0] || userData.first_name || profileData.personal_info?.first_name,
      last_name: userData.name?.split(' ').slice(1).join(' ') || userData.last_name || profileData.personal_info?.last_name,
      email: userData.email || profileData.contact?.email,
      phone: userData.phone || userData.phone_number || profileData.contact?.phone_number,
      
      // Extended info from profile
      nationality: profileData.personal_info?.nationality || 'Indian',
      date_of_birth: profileData.personal_info?.date_of_birth,
      gender: profileData.personal_info?.gender,
      occupation: profileData.personal_info?.occupation,
      
      // Document info
      passport: profileData.documents?.passport,
      aadhaar: profileData.documents?.aadhaar,
      
      // Address info
      permanent_address: profileData.addresses?.permanent,
      current_address: profileData.addresses?.current,
      
      // Emergency contact
      emergency_contact: profileData.emergency_contact,
      
      // Travel details
      travel_details: profileData.travel_details,
      
      // Contact info
      contact: profileData.contact
    };
  }

  /**
   * Validate registration data
   * @param {Object} data - Registration data
   * @throws {Error} - If validation fails
   */
  validateRegistrationData(data) {
    const required = ['email', 'phone'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }

    // Validate phone format (basic)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
      throw new Error('Invalid phone number format');
    }
  }

  /**
   * Get current location (placeholder)
   * In a real app, this would use browser geolocation
   * @returns {Object} - Location data
   */
  getCurrentLocation() {
    return {
      latitude: 28.6139, // Delhi default
      longitude: 77.2090,
      address: 'New Delhi, India',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Format tourist data for display
   * @param {Object} touristData - Raw tourist data
   * @returns {Object} - Formatted data
   */
  formatTouristData(touristData) {
    return {
      id: touristData.id,
      name: `${touristData.first_name || ''} ${touristData.last_name || ''}`.trim(),
      email: touristData.email,
      phone: touristData.phone,
      nationality: touristData.nationality,
      digitalId: touristData.digitalId,
      safetyScore: touristData.safetyScore || 0,
      status: touristData.status || 'active',
      createdAt: touristData.createdAt,
      lastUpdated: touristData.updatedAt
    };
  }

  /**
   * Check if blockchain service is available
   * @returns {Promise<boolean>} - Service status
   */
  async checkBlockchainStatus() {
    try {
      return await this.blockchain.checkService();
    } catch (error) {
      console.error('❌ Blockchain service check failed:', error);
      return false;
    }
  }

  /**
   * Get service health status
   * @returns {Promise<Object>} - Health status
   */
  async getHealthStatus() {
    const blockchainAvailable = await this.checkBlockchainStatus();
    
    return {
      blockchain: blockchainAvailable,
      frontend: true, // If this code is running, frontend is available
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const touristService = new TouristService();
export default touristService;
