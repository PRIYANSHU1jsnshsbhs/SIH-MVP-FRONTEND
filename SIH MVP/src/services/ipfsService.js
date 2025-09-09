// IPFS Service for uploading NFT metadata and tourist data
// This service handles IPFS upload, NFT metadata generation, and QR code creation

import QRCode from 'qrcode';

class IPFSService {
  constructor() {
    // For development, we'll use a public IPFS gateway
    // In production, use your own IPFS node or Pinata/Infura
    this.mockMode = true;
    this.ipfsGateway = 'https://ipfs.io/ipfs/';
    this.pinataApiUrl = 'https://api.pinata.cloud';
    
    // Mock IPFS for development (replace with real IPFS client in production)
    this.mockMode = true;
    
    console.log('🌐 IPFS Service initialized');
  }

  /**
   * Create NFT metadata and upload to IPFS
   * @param {Object} touristData - Tourist registration data
   * @param {string} digitalId - Digital ID from blockchain
   * @returns {Promise<Object>} - IPFS hash and NFT metadata
   */
  async createTouristNFT(touristData, digitalId) {
    try {
      console.log('🎨 Creating NFT for tourist:', digitalId);

      // Generate NFT metadata
      const nftMetadata = this.generateNFTMetadata(touristData, digitalId);
      
      // Upload to IPFS
  const ipfsHash = await this.uploadToIPFS(nftMetadata, digitalId);
      
      // Generate QR code for the NFT
      const qrCode = await this.generateQRCode(ipfsHash, digitalId);
      
      const result = {
        ipfsHash,
        ipfsUrl: qrCode.data.ipfsUrl, // Use the same URL as in QR code
        nftMetadata,
        qrCode,
        qrCodeUrl: qrCode.dataUrl,
        timestamp: new Date().toISOString()
      };

      console.log('✅ NFT created successfully:', result);
      return result;

    } catch (error) {
      console.error('❌ NFT creation failed:', error);
      throw new Error(`NFT creation failed: ${error.message}`);
    }
  }

  /**
   * Generate NFT metadata following OpenSea standard
   * @param {Object} touristData - Tourist data
   * @param {string} digitalId - Digital ID
   * @returns {Object} - NFT metadata
   */
  generateNFTMetadata(touristData, digitalId) {
    // Extract data from nested profile structure
    const personalInfo = touristData.personal_info || {};
    const contact = personalInfo.contact || touristData.contact || {};
    const documents = touristData.documents || {};
    const passport = documents.passport || {};
    const emergencyContact = touristData.emergency_contact || {};
    const travelDetails = touristData.travel_details || {};
    
    // Construct full name
    const fullName = personalInfo.first_name && personalInfo.last_name 
      ? `${personalInfo.first_name} ${personalInfo.last_name}`
      : touristData.name || 'Anonymous Tourist';

    const metadata = {
      name: `Tourist Digital Identity - ${fullName}`,
      description: `Secure digital identity NFT for tourist ${digitalId}. This NFT represents verified registration on the Tourist Safety blockchain network.`,
      image: this.generateNFTImageUrl(digitalId),
      external_url: `https://tourist-safety.gov.in/profile/${digitalId}`,
      
      attributes: [
        {
          trait_type: "Digital ID",
          value: digitalId
        },
        {
          trait_type: "Full Name",
          value: fullName
        },
        {
          trait_type: "Nationality",
          value: personalInfo.nationality || touristData.nationality || "Unknown"
        },
        {
          trait_type: "Registration Date",
          value: new Date().toLocaleDateString()
        },
        {
          trait_type: "Safety Score",
          value: touristData.safetyScore || 75,
          display_type: "number"
        },
        {
          trait_type: "Status",
          value: touristData.status || "Active"
        },
        {
          trait_type: "Passport Number",
          value: passport.number ? `****${passport.number.slice(-4)}` : "Not Provided"
        },
        {
          trait_type: "Purpose of Visit",
          value: travelDetails.purpose_of_visit || "Tourism"
        },
        {
          trait_type: "Blockchain Network",
          value: "Hyperledger Fabric"
        }
      ],
      
      properties: {
        category: "Digital Identity",
        type: "Tourist Registration",
        blockchain: "Hyperledger Fabric",
        chaincode: "tourist-safety",
        verified: true,
        digitalId,
        
        // Personal Information (public metadata only)
        personal_info: {
          nationality: personalInfo.nationality || "Unknown",
          gender: personalInfo.gender || "Not Specified",
          registration_date: new Date().toISOString()
        },
        
        // Contact Information (hashed for privacy)
        contact_hash: this.generateDataHash({
          email: contact.email || touristData.email,
          phone: contact.phone_number || touristData.phone
        }),
        
        // Document Information (partial for verification)
        documents: {
          passport_verified: !!passport.number,
          passport_country: passport.issuing_country || "Unknown",
          visa_status: documents.visa?.type || "Unknown"
        },
        
        // Emergency Contact (hashed)
        emergency_contact_hash: this.hashEmergencyContacts([emergencyContact]),
        
        // Travel Information
        travel_info: {
          purpose: travelDetails.purpose_of_visit || "Tourism",
          arrival_date: travelDetails.arrival_date || null,
          departure_date: travelDetails.departure_date || null
        },
        
        // Security and privacy
        dataHash: this.generateDataHash(touristData),
        encrypted: true,
        
        // Metadata
        version: "1.0",
        standard: "Tourist Safety NFT v1.0",
        created_by: "Tourist Safety System",
        issuer: "Government Tourism Department",
        created_at: new Date().toISOString()
      },
      
      // Technical metadata
      background_color: "1a1a2e",
      animation_url: null,
      youtube_url: null,
      
      // Privacy and compliance
      privacy_level: "public_metadata_only",
      gdpr_compliant: true,
      data_retention_policy: "as_per_government_guidelines"
    };

    return metadata;
  }

  /**
   * Upload data to IPFS
   * @param {Object} data - Data to upload
   * @param {string} digitalId - Digital ID for reference
   * @returns {Promise<string>} - IPFS hash
   */
  async uploadToIPFS(data, digitalId) {
    console.log('📤 Uploading to IPFS via Pinata...', digitalId);
    
    // Try real IPFS upload via our backend server
    try {
      const resp = await fetch('http://localhost:8080/api/ipfs/upload', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(data)
      });
      
      if (resp.ok) {
        const result = await resp.json();
        if (result?.ipfsHash) {
          console.log('✅ Real IPFS upload successful:', result.ipfsHash);
          this.mockMode = false;
          return result.ipfsHash;
        }
      }
      
      // If response not ok, check error
      const errorData = await resp.json();
      console.warn('⚠️ IPFS server upload failed:', errorData);
      
    } catch (error) {
      console.warn('⚠️ IPFS server error (falling back to mock):', error);
    }

    // Fall back to mock IPFS for development
    console.log('🔄 Using mock IPFS upload...');
    this.mockMode = true;
    
    const mockHash = `QmT${Math.random().toString(36).substr(2, 44)}`;
    console.log('🔄 Mock IPFS hash generated:', mockHash);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockHash;
  }

  /**
   * Generate QR code for NFT
   * @param {string} ipfsHash - IPFS hash of NFT metadata
   * @param {string} digitalId - Digital ID
   * @returns {Promise<Object>} - QR code data
   */
  async generateQRCode(ipfsHash, digitalId) {
    try {
      // QR code should point to IPFS metadata URL
      let nftUrl;
      
      if (ipfsHash && (ipfsHash.startsWith('Qm') || ipfsHash.startsWith('bafy'))) {
        // Real IPFS hash - use more reliable gateway
        nftUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      } else {
        // Mock hash - create a viewable mock IPFS URL
        const mockHash = ipfsHash || `QmMock${Math.random().toString(36).substr(2, 40)}`;
        nftUrl = `https://gateway.pinata.cloud/ipfs/${mockHash}`;
      }

      console.log('🔗 Generating QR code for IPFS URL:', nftUrl);

      // Generate QR code that points to accessible URL
      const qrCodeDataUrl = await QRCode.toDataURL(nftUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1a1a2e',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });

      // Also generate as SVG for scalability
      const qrCodeSvg = await QRCode.toString(nftUrl, {
        type: 'svg',
        width: 256,
        margin: 2,
        color: {
          dark: '#1a1a2e',
          light: '#FFFFFF'
        }
      });

      return {
        dataUrl: qrCodeDataUrl,
        svg: qrCodeSvg,
        data: { 
          ipfsUrl: nftUrl, 
          ipfsHash,
          verificationUrl: `${window.location.origin || 'http://localhost:5173'}/verify/${digitalId}`
        },
        size: 256,
        format: 'png'
      };
    } catch (error) {
      console.error('❌ QR code generation failed:', error);
      
      // Fallback QR code with mock IPFS URL
      try {
        const mockHash = `QmMock${Math.random().toString(36).substr(2, 40)}`;
        const fallbackUrl = `https://ipfs.io/ipfs/${mockHash}`;
        const fallbackQR = await QRCode.toDataURL(fallbackUrl, {
          width: 256,
          margin: 2,
          color: {
            dark: '#1a1a2e',
            light: '#FFFFFF'
          }
        });
        
        return {
          dataUrl: fallbackQR,
          svg: null,
          data: { 
            ipfsUrl: fallbackUrl, 
            ipfsHash: mockHash,
            verificationUrl: `${window.location.origin || 'http://localhost:5173'}/verify/${digitalId || 'unknown'}`
          },
          size: 256,
          format: 'png'
        };
      } catch (fallbackError) {
        console.error('❌ Fallback QR code generation also failed:', fallbackError);
        throw new Error(`QR code generation failed: ${error.message}`);
      }
    }
  }

  /**
   * Get IPFS display URL for viewing metadata
   * @param {string} ipfsHash - IPFS hash
   * @returns {string} - IPFS gateway URL
   */
  getIPFSDisplayUrl(ipfsHash) {
    if (!ipfsHash || ipfsHash === 'fallback') {
      // Generate a mock hash for display
      const mockHash = `QmMock${Math.random().toString(36).substr(2, 40)}`;
      return `https://ipfs.io/ipfs/${mockHash}`;
    }
    
    if (ipfsHash.startsWith('Qm') || ipfsHash.startsWith('bafy')) {
      // Real IPFS hash - use public gateway
      return `https://ipfs.io/ipfs/${ipfsHash}`;
    } else {
      // Mock or custom hash - still use IPFS gateway format
      return `https://ipfs.io/ipfs/${ipfsHash}`;
    }
  }

  /**
   * Generate NFT image URL (placeholder)
   * @param {string} digitalId - Digital ID
   * @returns {string} - Image URL
   */
  generateNFTImageUrl(digitalId) {
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${digitalId}&backgroundColor=1a1a2e&size=512`;
  }

  /**
   * Generate hash of tourist data for verification
   * @param {Object} touristData - Tourist data
   * @returns {string} - Data hash
   */
  generateDataHash(touristData) {
    const dataString = JSON.stringify({
      name: touristData.name,
      email: touristData.email,
      nationality: touristData.nationality
    });
    
    // Simple hash for development (use proper crypto hash in production)
    return btoa(dataString).replace(/[^a-zA-Z0-9]/g, '').substr(0, 32);
  }

  /**
   * Hash emergency contacts for privacy
   * @param {Array} emergencyContacts - Emergency contacts
   * @returns {string} - Hashed contacts
   */
  hashEmergencyContacts(emergencyContacts) {
    if (!emergencyContacts || emergencyContacts.length === 0) {
      return 'no_emergency_contacts';
    }
    
    const contactString = JSON.stringify(emergencyContacts);
    return btoa(contactString).replace(/[^a-zA-Z0-9]/g, '').substr(0, 16);
  }

  /**
   * Verify NFT authenticity
   * @param {string} ipfsHash - IPFS hash to verify
   * @param {string} digitalId - Digital ID to verify against
   * @returns {Promise<Object>} - Verification result
   */
  async verifyNFT(ipfsHash, digitalId) {
    try {
      console.log('🔍 Verifying NFT:', ipfsHash, digitalId);
      
      // Fetch metadata from IPFS
      const metadata = await this.fetchFromIPFS(ipfsHash);
      
      // Verify digital ID matches
      const isValid = metadata.properties?.digitalId === digitalId;
      
      return {
        valid: isValid,
        metadata: metadata,
        ipfsHash: ipfsHash,
        digitalId: digitalId,
        verifiedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ NFT verification failed:', error);
      return {
        valid: false,
        error: error.message,
        ipfsHash: ipfsHash,
        digitalId: digitalId
      };
    }
  }

  /**
   * Fetch data from IPFS
   * @param {string} ipfsHash - IPFS hash
   * @returns {Promise<Object>} - Data from IPFS
   */
  async fetchFromIPFS(ipfsHash) {
    if (this.mockMode) {
      // Return mock metadata
      return {
        name: "Mock Tourist NFT",
        description: "Mock NFT for development",
        properties: {
          digitalId: "mock_digital_id"
        }
      };
    }

    try {
      const response = await fetch(`${this.ipfsGateway}${ipfsHash}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ IPFS fetch failed:', error);
      throw error;
    }
  }

  /**
   * Get service status
   * @returns {Object} - Service status
   */
  getStatus() {
    return {
      ipfsGateway: this.ipfsGateway,
      mockMode: this.mockMode,
      available: true,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const ipfsService = new IPFSService();
export default ipfsService;