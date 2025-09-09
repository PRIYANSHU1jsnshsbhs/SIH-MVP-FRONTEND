const express = require('express');
const axios = require('axios');

const router = express.Router();

// POST /api/ipfs/upload - pin JSON (NFT metadata) to IPFS via Pinata
router.post('/upload', async (req, res) => {
  try {
    const metadata = req.body;

    if (!metadata || typeof metadata !== 'object') {
      return res.status(400).json({ error: 'Invalid metadata payload' });
    }

    // Prefer JWT for Pinata
    const { PINATA_JWT, PINATA_API_KEY, PINATA_SECRET } = process.env;
    if (!PINATA_JWT && (!PINATA_API_KEY || !PINATA_SECRET)) {
      return res.status(500).json({ error: 'Pinata credentials not configured on server' });
    }

    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

    const headers = PINATA_JWT
      ? { Authorization: `Bearer ${PINATA_JWT}` }
      : {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET,
        };

    const pinataBody = {
      pinataOptions: { cidVersion: 1 },
      pinataMetadata: {
        name: metadata?.name || 'tourist-nft',
        keyvalues: {
          app: 'tourist-safety',
          digitalId: metadata?.properties?.digitalId || '',
        },
      },
      pinataContent: metadata,
    };

    const response = await axios.post(url, pinataBody, { headers });
    const ipfsHash = response?.data?.IpfsHash;
    if (!ipfsHash) {
      return res.status(502).json({ error: 'Pinata did not return IpfsHash', data: response?.data });
    }

    res.json({ ipfsHash, pinSize: response?.data?.PinSize, timestamp: response?.data?.Timestamp });
  } catch (err) {
    console.error('❌ Pinata upload failed:', err?.response?.data || err.message);
    const status = err?.response?.status || 500;
    res.status(status).json({ error: 'IPFS upload failed', details: err?.response?.data || err.message });
  }
});

module.exports = router;
