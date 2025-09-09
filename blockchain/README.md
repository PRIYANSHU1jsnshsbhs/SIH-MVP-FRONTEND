# Blockchain Module

This folder contains the Hyperledger Fabric chaincode for the Tourist Safety MVP.

## Chaincode: tourist-safety
- Functions:
  - registerTourist(touristId, touristJson)
  - createSOSAlert(alertId, alertJson)
  - generateEFIR(efirId, efirJson)

Path: `blockchain/chaincode/tourist-safety`

### Deploy on Fabric test-network

From `fabric-samples/fabric-samples/test-network`:

```bash
./network.sh up createChannel -c mychannel -ca
./network.sh deployCC -c mychannel -ccn tourist-safety -ccl javascript -ccp ../../../../blockchain/chaincode/tourist-safety
```

Then interact using a gateway client from the backend or a script.
