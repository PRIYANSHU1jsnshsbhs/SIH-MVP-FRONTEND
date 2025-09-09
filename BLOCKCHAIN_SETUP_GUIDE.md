# Tourist Safety Blockchain Setup - Complete Guide

## 🎯 Overview
Successfully set up and deployed the Tourist Safety Smart Contract on Hyperledger Fabric. The blockchain network is now running and fully functional with all core features tested.

## 📁 Project Structure
```
SIH-MVP-FRONTEND/
├── fabric-samples/
│   └── fabric-samples/
│       ├── chaincode/
│       │   └── tourist-safety/          # Your Tourist Safety Chaincode
│       │       ├── package.json         # Node.js dependencies
│       │       ├── index.js            # Contract entry point
│       │       └── lib/
│       │           └── touristSafetyContract.js  # Main contract logic
│       └── test-network/               # Hyperledger Fabric test network
└── setup-blockchain.sh                # Automated setup script
```

## 🚀 Quick Start

### Option 1: Automated Setup
```bash
cd /home/priyanshu/SIH/SIH-MVP-FRONTEND
./setup-blockchain.sh
```

### Option 2: Manual Setup
```bash
cd fabric-samples/fabric-samples/test-network

# 1. Start the network
./network.sh up createChannel -c mychannel -ca

# 2. Deploy chaincode
./network.sh deployCC -ccn tourist-safety -ccp ../chaincode/tourist-safety -ccl javascript

# 3. Set environment variables
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
```

## 🔧 Chaincode Functions

### 1. Register Tourist
```bash
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n tourist-safety --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"registerTourist","Args":["{\"id\":\"tourist_001\",\"name\":\"John Doe\",\"email\":\"john@example.com\",\"phone\":\"+91-9876543210\",\"nationality\":\"Indian\",\"passportNumber\":\"A1234567\"}"]}'
```

### 2. Create SOS Alert
```bash
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n tourist-safety --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"createSOSAlert","Args":["{\"id\":\"sos_001\",\"touristId\":\"tourist_001\",\"description\":\"Emergency help needed\",\"location\":{\"latitude\":28.6139,\"longitude\":77.2090,\"address\":\"New Delhi\"},\"recipients\":[\"emergency@police.gov.in\"]}"]}'
```

### 3. Generate e-FIR
```bash
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n tourist-safety --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"generateEFIR","Args":["{\"id\":\"efir_001\",\"touristId\":\"tourist_001\",\"incidentType\":\"theft\",\"description\":\"Phone stolen\",\"location\":{\"latitude\":28.6139,\"longitude\":77.2090,\"address\":\"Red Fort\"},\"policeStation\":\"Kotwali\"}"]}'
```

### 4. Query Functions
```bash
# Get all tourists
peer chaincode query -C mychannel -n tourist-safety -c '{"function":"getAllTourists","Args":[]}'

# Get all alerts
peer chaincode query -C mychannel -n tourist-safety -c '{"function":"getAllAlerts","Args":[]}'

# Get all e-FIRs
peer chaincode query -C mychannel -n tourist-safety -c '{"function":"getAllEFIRs","Args":[]}'

# Get specific tourist
peer chaincode query -C mychannel -n tourist-safety -c '{"function":"getTourist","Args":["tourist_001"]}'
```

## 📊 Network Status

### Current Network Configuration
- **Network:** Hyperledger Fabric 2.5.12
- **Organizations:** 2 (Org1MSP, Org2MSP)
- **Peers:** 2 (peer0.org1, peer0.org2)
- **Orderer:** 1 (orderer.example.com)
- **Channel:** mychannel
- **Chaincode:** tourist-safety v1.2

### Running Containers
```bash
# Check running containers
docker ps

# Expected containers:
# - peer0.org1.example.com
# - peer0.org2.example.com
# - orderer.example.com
```

## 🔗 Frontend Integration

### Environment Variables for Frontend
```javascript
const FABRIC_CONFIG = {
  channel: 'mychannel',
  chaincode: 'tourist-safety',
  orderer: 'localhost:7050',
  peer1: 'localhost:7051',
  peer2: 'localhost:9051',
  certPath: '/organizations/peerOrganizations/org1.example.com/...'
}
```

### SDK Integration Points
1. **Wallet Setup:** Use the generated crypto materials in `organizations/`
2. **Gateway Connection:** Connect to peer0.org1.example.com:7051
3. **Contract Interface:** Access `tourist-safety` contract on `mychannel`

## 🛠️ Management Commands

### Start/Stop Network
```bash
# Start network
./network.sh up createChannel -c mychannel -ca

# Stop network
./network.sh down

# Restart with clean state
./network.sh down && ./network.sh up createChannel -c mychannel -ca
```

### Update Chaincode
```bash
# Deploy new version
./network.sh deployCC -ccn tourist-safety -ccp ../chaincode/tourist-safety -ccl javascript -ccv 1.3
```

### Monitor Logs
```bash
# View peer logs
docker logs peer0.org1.example.com

# View orderer logs
docker logs orderer.example.com

# Follow chaincode container logs
docker logs $(docker ps -f name=dev-peer --format "{{.Names}}")
```

## ✅ Testing Results

All core functions have been successfully tested:

1. ✅ **Tourist Registration** - Creates unique digital identity with blockchain record
2. ✅ **SOS Alert Creation** - Generates emergency alerts with location data
3. ✅ **e-FIR Generation** - Creates tamper-proof digital police reports
4. ✅ **Data Queries** - Retrieves all records successfully
5. ✅ **Multi-peer Consensus** - Works with both organizational peers

## 🔒 Security Features

- **Digital Identity:** Each tourist gets unique DID with blockchain verification
- **Tamper-proof Records:** All transactions are immutably stored on blockchain
- **Multi-signature:** Requires consensus from multiple organizations
- **Hash Verification:** Document integrity ensured through cryptographic hashing
- **Access Control:** Role-based permissions through MSP policies

## 📱 Next Steps for Frontend Integration

1. **Install Fabric SDK:** `npm install fabric-network`
2. **Set up Connection Profile:** Configure gateway connection
3. **Implement Wallet Management:** Handle user certificates
4. **Create Service Layer:** Abstract blockchain calls for your React components
5. **Add Error Handling:** Implement retry logic and user feedback

## 🆘 Troubleshooting

### Common Issues
- **Port conflicts:** Stop other Docker containers using ports 7050-9051
- **Permission errors:** Ensure user has Docker privileges
- **Network cleanup:** Run `./network.sh down` before restart
- **Chaincode updates:** Increment version number for each deployment

### Verify Installation
```bash
# Check if network is running
docker ps | grep hyperledger

# Test basic query
peer chaincode query -C mychannel -n tourist-safety -c '{"function":"getAllTourists","Args":[]}'
```

## 📞 Support

The blockchain network is now fully operational and ready for frontend integration. All Tourist Safety features including registration, SOS alerts, and e-FIR generation are working correctly with deterministic consensus across multiple peers.

**Network Status:** ✅ ACTIVE  
**Chaincode Status:** ✅ DEPLOYED  
**Test Status:** ✅ ALL PASSED
