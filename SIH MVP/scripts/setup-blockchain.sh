#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")"/../.. && pwd)"
NET_DIR="$ROOT_DIR/fabric-samples/fabric-samples/test-network"
CHAINCODE_PATH="$ROOT_DIR/blockchain/chaincode/tourist-safety"

if [ ! -d "$NET_DIR" ]; then
	echo "Fabric test-network not found at $NET_DIR" >&2
	exit 1
fi

echo "Bringing up Fabric test network..."
pushd "$NET_DIR" >/dev/null
./network.sh down || true
./network.sh up createChannel -c mychannel -ca

echo "Deploying chaincode (tourist-safety)..."
./network.sh deployCC -c mychannel -ccn tourist-safety -ccl javascript -ccp "$CHAINCODE_PATH"

echo "Done. Use gateway client to interact with 'tourist-safety' on 'mychannel'."
popd >/dev/null
