# SIH Tourist Safety MVP

End-to-end MVP for tourist safety with:
- React + Vite frontend (map, geofences, profile, QR/NFT display)
- Node/Express backend (auth, MongoDB, IPFS Pinata proxy)
- Hyperledger Fabric components (test network + client integration)

This README lives at the repository root and covers setup for all parts.

## Repo structure

```
SIH-MVP-FRONTEND/
├─ server/                 # Express API (MongoDB, JWT, Pinata upload)
├─ SIH MVP/                # React app (Vite)
├─ blockchain/             # Chaincode (tourist-safety)
├─ fabric-samples/         # Hyperledger Fabric sample network/tools
├─ *.py                    # Geofence data generation scripts
└─ *.md                    # Docs (architecture, summary)
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Docker + Docker Compose v2 (for Fabric test network)
- Git
- MongoDB (local or Atlas URI)
- Mapbox access token
- Pinata JWT (or API key/secret) for IPFS uploads

## Quick start

1) Clone
```
git clone https://github.com/PRIYANSHU1jsnshsbhs/SIH-MVP-FRONTEND.git
cd SIH-MVP-FRONTEND
```

2) Configure environment

- Frontend (`SIH MVP/.env`):
```
VITE_MAPBOX_TOKEN=your_mapbox_access_token
VITE_API_BASE_URL=http://localhost:3000
```

- Backend (`server/.env`):
```
MONGO_URI=mongodb://127.0.0.1:27017/sih
JWT_SECRET=change_this_secret
# Prefer JWT
PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# Or API key/secret (only if not using JWT)
PINATA_API_KEY=
PINATA_API_SECRET=
PORT=3000
```

3) Install deps

- Frontend
```
cd "SIH MVP"
npm install
```

- Backend
```
cd ../server
npm install
```

4) Run services

- Start backend API
```
npm run dev
```

- Start frontend (new terminal)
```
cd "SIH MVP"
npm run dev
```

Frontend: http://localhost:5173  |  API: http://localhost:3000

## Hyperledger Fabric (local test network)

This repo includes the official Fabric sample network under `fabric-samples/`. Use it to stand up a local dev network and test client integration. You can deploy your own chaincode or start with the provided contract.

### Deploy provided chaincode (tourist-safety)

1) Bring up test network
```
cd fabric-samples/fabric-samples/test-network
./network.sh up createChannel -c mychannel -ca
```

2) Deploy chaincode
```
./network.sh deployCC -c mychannel -ccn tourist-safety -ccl javascript -ccp ../../../../blockchain/chaincode/tourist-safety
```

Notes
- The sample network’s `.gitignore` excludes generated artifacts (bin/, config/, etc.). Commit your chaincode source, not generated network assets.
- The frontend includes Fabric client libs for gateway interactions as needed.

## Features overview

- Auth (signup/login) with JWT (server/controllers)
- Profile + NFT: IPFS metadata via backend Pinata proxy; QR links to IPFS JSON
- Map with geofences, terrain, and style switching
- Fabric contract functions: registerTourist, createSOSAlert, generateEFIR

## Scripts

- Frontend
  - `npm run dev` – start Vite dev server
  - `npm run build` – production build

- Backend
  - `npm run dev` – start Express with nodemon

## Troubleshooting

- Frontend blank screen → ensure VITE_MAPBOX_TOKEN is set
- Backend 500 on /api/ipfs/upload → verify PINATA_JWT or API keys
- Fabric network issues → `./network.sh down` then `up createChannel`

## Contributing

PRs welcome. Keep secrets in .env (never commit). Add small docs for new features.

## License

MIT
