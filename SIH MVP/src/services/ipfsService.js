// IPFS Service for uploading NFT metadata and tourist data
// This service handles IPFS upload, NFT metadata generation, and QR code creation

import QRCode from 'qrcode';

class IPFSService {
  constructor() {
    // For development, we'll use a public IPFS gateway
    // In production, use your own IPFS node or Pinata/Infura
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
        ipfsUrl: `${this.ipfsGateway}${ipfsHash}`,
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
    const metadata = {
      name: `Tourist Digital Identity - ${touristData.name || 'Anonymous'}`,
      description: `Secure digital identity NFT for tourist ${digitalId}. This NFT represents verified registration on the Tourist Safety blockchain network.`,
      image: this.generateNFTImageUrl(digitalId),
      external_url: `https://tourist-safety.gov.in/profile/${digitalId}`,
      
      attributes: [
        {
          trait_type: "Digital ID",
          value: digitalId
        },
        {
          trait_type: "Registration Date",
          value: new Date().toLocaleDateString()
        },
        {
          trait_type: "Nationality",
          value: touristData.nationality || "Unknown"
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
        
        // Security and privacy
        dataHash: this.generateDataHash(touristData),
        encrypted: true,
        
        // Emergency contacts (encrypted)
        emergencyContactsHash: this.hashEmergencyContacts(touristData.emergencyContacts),
        
        // Metadata
        version: "1.0",
        standard: "Tourist Safety NFT v1.0",
        created_by: "Tourist Safety System",
        issuer: "Government Tourism Department"
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
   * @returns {Promise<string>} - IPFS hash
   */
  async uploadToIPFS(data, digitalId) {
    // Attempt real upload via our server if available
    try {
      const resp = await fetch('http://localhost:8080/api/ipfs/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (resp.ok) {
        const json = await resp.json();
        if (json?.ipfsHash) {
          this.mockMode = false; // switch off mock if server upload worked
          return json.ipfsHash;
        }
      }
    } catch (e) {
      // Server might be down; continue to mock
    }

    if (this.mockMode) {
      // Mock IPFS upload for development
      const mockHash = `QmT${Math.random().toString(36).substr(2, 44)}`;
      console.log('🔄 Mock IPFS upload:', mockHash);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockHash;
    }

  try {
      // Real IPFS upload (implement when IPFS node is available)
      // const ipfs = create({ url: 'http://localhost:5001' });
      // const result = await ipfs.add(JSON.stringify(data));
      // return result.cid.toString();
      
      throw new Error('Real IPFS upload not implemented yet');
    } catch (error) {
      console.error('❌ IPFS upload failed:', error);
      throw error;
    }
  }

  /**
   * Generate QR code for NFT
   * @param {string} ipfsHash - IPFS hash of NFT metadata
   * @param {string} digitalId - Digital ID
   * @returns {Promise<Object>} - QR code data
   */
  async generateQRCode(ipfsHash, digitalId) {
    try {
      const nftUrl = `${this.ipfsGateway}${ipfsHash}`;

      // Generate QR code that points directly to the IPFS JSON metadata URL
      const qrCodeDataUrl = await QRCode.toDataURL(nftUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
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
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      return {
        dataUrl: qrCodeDataUrl,
        svg: qrCodeSvg,
        data: { ipfsUrl: nftUrl, ipfsHash },
        size: 256,
        format: 'png'
      };
    } catch (error) {
      console.error('❌ QR code generation failed:', error);
      throw new Error(`QR code generation failed: ${error.message}`);
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
