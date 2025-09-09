#!/bin/bash

# Tourist Safety Blockchain Setup Script
# This script sets up and tests the complete Tourist Safety chaincode

echo "==================================="
echo "Tourist Safety Blockchain Setup"
echo "==================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "fabric-samples/fabric-samples/test-network" ]; then
    print_error "Please run this script from the SIH-MVP-FRONTEND directory"
    exit 1
fi

cd fabric-samples/fabric-samples/test-network

# Step 1: Clean up any existing network
print_status "Stopping any existing network..."
./network.sh down

# Step 2: Start the network with channel and CA
print_status "Starting Hyperledger Fabric test network..."
./network.sh up createChannel -c mychannel -ca

if [ $? -ne 0 ]; then
    print_error "Failed to start network"
    exit 1
fi

# Step 3: Deploy the chaincode
print_status "Deploying Tourist Safety chaincode..."
./network.sh deployCC -ccn tourist-safety -ccp ../chaincode/tourist-safety -ccl javascript

if [ $? -ne 0 ]; then
    print_error "Failed to deploy chaincode"
    exit 1
fi

# Step 4: Set up environment variables for CLI
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

# Step 5: Test the chaincode functionality
print_status "Testing Tourist Safety chaincode functionality..."

# Test 1: Register a tourist
print_status "Test 1: Registering a tourist..."
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n tourist-safety --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"registerTourist","Args":["{\"id\":\"demo_tourist_001\",\"name\":\"Demo User\",\"email\":\"demo@example.com\",\"phone\":\"+91-9876543210\",\"nationality\":\"Indian\",\"passportNumber\":\"D1234567\"}"]}'

if [ $? -eq 0 ]; then
    print_status "Tourist registration successful!"
else
    print_error "Tourist registration failed!"
fi

sleep 3

# Test 2: Create SOS Alert
print_status "Test 2: Creating SOS Alert..."
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n tourist-safety --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"createSOSAlert","Args":["{\"id\":\"demo_sos_001\",\"touristId\":\"demo_tourist_001\",\"description\":\"Emergency situation - need immediate help\",\"location\":{\"latitude\":28.6139,\"longitude\":77.2090,\"address\":\"Test Location\"},\"recipients\":[\"emergency@test.com\"]}"]}'

if [ $? -eq 0 ]; then
    print_status "SOS Alert creation successful!"
else
    print_error "SOS Alert creation failed!"
fi

sleep 3

# Test 3: Generate e-FIR
print_status "Test 3: Generating e-FIR..."
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n tourist-safety --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"generateEFIR","Args":["{\"id\":\"demo_efir_001\",\"touristId\":\"demo_tourist_001\",\"incidentType\":\"accident\",\"description\":\"Minor accident requiring police report\",\"location\":{\"latitude\":28.6139,\"longitude\":77.2090,\"address\":\"Test Location\"},\"policeStation\":\"Demo Police Station\"}"]}'

if [ $? -eq 0 ]; then
    print_status "e-FIR generation successful!"
else
    print_error "e-FIR generation failed!"
fi

sleep 3

# Test 4: Query all data
print_status "Test 4: Querying all data..."

echo ""
print_status "All Tourists:"
peer chaincode query -C mychannel -n tourist-safety -c '{"function":"getAllTourists","Args":[]}'

echo ""
print_status "All SOS Alerts:"
peer chaincode query -C mychannel -n tourist-safety -c '{"function":"getAllAlerts","Args":[]}'

echo ""
print_status "All e-FIRs:"
peer chaincode query -C mychannel -n tourist-safety -c '{"function":"getAllEFIRs","Args":[]}'

echo ""
print_status "==================================="
print_status "Setup and Testing Complete!"
print_status "==================================="
echo ""
print_status "Your Tourist Safety blockchain network is now ready!"
print_status "Network containers are running with the following components:"
print_status "- Hyperledger Fabric Test Network (2 orgs, 1 orderer)"
print_status "- Tourist Safety Chaincode (version 1.2)"
print_status "- Channel: mychannel"
echo ""
print_status "You can now integrate this with your frontend application."
print_status "Use the following commands to interact with the chaincode:"
echo ""
echo "# Register Tourist:"
echo 'peer chaincode invoke ... -c '"'"'{"function":"registerTourist","Args":["{...}"]}"'"'"
echo ""
echo "# Create SOS Alert:"
echo 'peer chaincode invoke ... -c '"'"'{"function":"createSOSAlert","Args":["{...}"]}"'"'"
echo ""
echo "# Generate e-FIR:"
echo 'peer chaincode invoke ... -c '"'"'{"function":"generateEFIR","Args":["{...}"]}"'"'"
echo ""
print_status "To stop the network: ./network.sh down"
