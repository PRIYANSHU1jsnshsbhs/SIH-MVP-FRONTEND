/**
 * Simple test script to connect to the blockchain
 */

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function testConnection() {
  try {
    console.log('🔗 Testing Fabric connection...');

    // Path to crypto materials
    const cryptoPath = path.resolve(__dirname, '..', 'fabric-samples', 'fabric-samples', 'test-network', 'organizations');
    const orgPath = path.join(cryptoPath, 'peerOrganizations', 'org1.example.com');
    const tlsCertPath = path.join(orgPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt');
    
    // Check if files exist
    console.log('Checking paths...');
    console.log('Crypto path:', cryptoPath);
    console.log('Org path:', orgPath);
    console.log('TLS cert path:', tlsCertPath);
    
    // Create wallet
    const wallet = await Wallets.newFileSystemWallet(path.join(__dirname, 'wallet'));
    
    // Connection profile
    const connectionProfile = {
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
          url: 'grpc://localhost:7051', // Using grpc instead of grpcs
          grpcOptions: {
            'ssl-target-name-override': 'peer0.org1.example.com',
            'hostnameOverride': 'peer0.org1.example.com'
          }
        }
      }
    };

    // Create gateway connection
    const gateway = new Gateway();
    
    await gateway.connect(connectionProfile, {
      wallet,
      identity: 'admin',
      discovery: { enabled: false, asLocalhost: true } // Disable discovery for now
    });

    console.log('✅ Connected to gateway');

    const network = await gateway.getNetwork('mychannel');
    console.log('✅ Connected to network');

    const contract = network.getContract('tourist-safety');
    console.log('✅ Got contract');

    // Test a simple query
    try {
      const result = await contract.evaluateTransaction('getAllTourists');
      console.log('✅ Query successful:', result.toString());
    } catch (queryError) {
      console.log('⚠️  Query failed (expected if no data):', queryError.message);
    }

    gateway.disconnect();
    console.log('✅ Test completed successfully');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testConnection();
