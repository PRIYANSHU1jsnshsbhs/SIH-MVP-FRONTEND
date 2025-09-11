/**
 * Real Hyperledger Fabric Integration
 * Connects to the actual blockchain network and chaincode
 */

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

class FabricService {
  constructor() {
    this.channelName = 'mychannel';
    this.chaincodeName = 'basic';
    this.gateway = null;
    this.network = null;
    this.contract = null;
    this.isConnected = false;
  }

  /**
   * Initialize connection to Fabric network
   */
  async initialize() {
    try {
      console.log('🔗 Initializing Fabric connection...');

      // Path to crypto materials
      const cryptoPath = path.resolve(__dirname, '..', 'fabric-samples', 'fabric-samples', 'test-network', 'organizations');
      const orgPath = path.join(cryptoPath, 'peerOrganizations', 'org1.example.com');
      const userPath = path.join(orgPath, 'users', 'Admin@org1.example.com');
      
      // Create wallet and import identity
      const wallet = await Wallets.newFileSystemWallet(path.join(__dirname, 'wallet'));
      
      // Check if identity exists
      const identity = await wallet.get('admin');
      if (!identity) {
        await this.enrollAdmin(wallet, orgPath);
      }

      // Create gateway connection
      const gateway = new Gateway();
      const connectionProfile = this.buildConnectionProfile();
      
      await gateway.connect(connectionProfile, {
        wallet,
        identity: 'admin',
        discovery: { enabled: false, asLocalhost: true }
      });

      this.gateway = gateway;
      this.network = await gateway.getNetwork(this.channelName);
      this.contract = this.network.getContract(this.chaincodeName);
      this.isConnected = true;

      console.log('✅ Connected to Fabric network');
      return true;

    } catch (error) {
      console.error('❌ Failed to connect to Fabric network:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Enroll admin user
   */
  async enrollAdmin(wallet, orgPath) {
    try {
      const caPath = path.join(orgPath, 'ca');
      const caCertPath = path.join(caPath, 'ca.org1.example.com-cert.pem');
      const caCert = fs.readFileSync(caCertPath).toString();
      
      const ca = new FabricCAServices('https://localhost:7054', { 
        trustedRoots: caCert, 
        verify: false 
      }, 'ca-org1');

      const enrollment = await ca.enroll({
        enrollmentID: 'admin',
        enrollmentSecret: 'adminpw'
      });

      const identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
      };

      await wallet.put('admin', identity);
      console.log('✅ Admin identity enrolled and imported to wallet');

    } catch (error) {
      console.error('❌ Failed to enroll admin:', error);
      throw error;
    }
  }

  /**
   * Build connection profile
   */
  buildConnectionProfile() {
    return {
      name: 'test-network-org1',
      version: '1.0.0',
      client: {
        organization: 'Org1',
        connection: {
          timeout: {
            peer: {
              endorser: '300'
            }
          }
        }
      },
      organizations: {
        Org1: {
          mspid: 'Org1MSP',
          peers: ['peer0.org1.example.com']
        }
      },
      peers: {
        'peer0.org1.example.com': {
          url: 'grpc://localhost:7051',
          grpcOptions: {
            'ssl-target-name-override': 'peer0.org1.example.com',
            'hostnameOverride': 'peer0.org1.example.com'
          }
        }
      }
    };
  }

  /**
   * Get TLS CA Certificate
   */
  getTLSCACert() {
    try {
      const cryptoPath = path.resolve(__dirname, '..', 'fabric-samples', 'fabric-samples', 'test-network', 'organizations');
      const tlsCertPath = path.join(cryptoPath, 'peerOrganizations', 'org1.example.com', 'tlsca', 'tlsca.org1.example.com-cert.pem');
      return fs.readFileSync(tlsCertPath).toString();
    } catch (error) {
      console.error('❌ Failed to read TLS cert:', error);
      throw error;
    }
  }

  /**
   * Invoke chaincode function
   */
  async invokeChaincode(functionName, args) {
    try {
      if (!this.isConnected || !this.contract) {
        throw new Error('Not connected to blockchain network');
      }

      console.log(`🔗 Invoking chaincode: ${functionName} with args:`, args);

      const result = await this.contract.submitTransaction(functionName, ...args);
      const response = JSON.parse(result.toString());

      console.log('✅ Chaincode invocation successful:', response);
      return response;

    } catch (error) {
      console.error(`❌ Chaincode invocation failed (${functionName}):`, error);
      throw error;
    }
  }

  /**
   * Query chaincode function
   */
  async queryChaincode(functionName, args = []) {
    try {
      if (!this.isConnected || !this.contract) {
        throw new Error('Not connected to blockchain network');
      }

      console.log(`🔍 Querying chaincode: ${functionName} with args:`, args);

      const result = await this.contract.evaluateTransaction(functionName, ...args);
      const response = JSON.parse(result.toString());

      console.log('✅ Chaincode query successful:', response);
      return response;

    } catch (error) {
      console.error(`❌ Chaincode query failed (${functionName}):`, error);
      throw error;
    }
  }

  /**
   * Disconnect from network
   */
  async disconnect() {
    try {
      if (this.gateway) {
        await this.gateway.disconnect();
        this.isConnected = false;
        console.log('🔌 Disconnected from Fabric network');
      }
    } catch (error) {
      console.error('❌ Error disconnecting from network:', error);
    }
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      connected: this.isConnected,
      channel: this.channelName,
      chaincode: this.chaincodeName,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = FabricService;
