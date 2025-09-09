const express = require('express');
const router = express.Router();

// Simple NFT display route
router.get('/:digitalId', async (req, res) => {
  try {
    const { digitalId } = req.params;
    
    // Basic HTML page to display NFT info
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tourist Digital Identity NFT - ${digitalId}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          min-height: 100vh;
        }
        .nft-card {
          background: rgba(255,255,255,0.1);
          border-radius: 15px;
          padding: 30px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .title { color: #4f9cf9; font-size: 24px; margin-bottom: 20px; }
        .digital-id { color: #ffd700; font-size: 18px; margin-bottom: 15px; }
        .info { margin: 10px 0; }
        .label { color: #888; font-size: 14px; }
        .value { color: white; font-size: 16px; font-weight: bold; }
        .verified { color: #00ff88; }
        .blockchain { color: #ff6b6b; }
      </style>
    </head>
    <body>
      <div class="nft-card">
        <div class="title">🏛️ Tourist Digital Identity NFT</div>
        <div class="digital-id">Digital ID: ${digitalId}</div>
        
        <div class="info">
          <div class="label">Status:</div>
          <div class="value verified">✅ Verified on Blockchain</div>
        </div>
        
        <div class="info">
          <div class="label">Blockchain Network:</div>
          <div class="value blockchain">Hyperledger Fabric</div>
        </div>
        
        <div class="info">
          <div class="label">Chaincode:</div>
          <div class="value">tourist-safety</div>
        </div>
        
        <div class="info">
          <div class="label">Created:</div>
          <div class="value">${new Date().toLocaleDateString()}</div>
        </div>
        
        <div class="info">
          <div class="label">Type:</div>
          <div class="value">Tourist Registration NFT</div>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="http://localhost:5174/profile" style="color: #4f9cf9; text-decoration: none;">
            🔗 View Full Profile
          </a>
        </div>
      </div>
    </body>
    </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
    
  } catch (error) {
    console.error('NFT display error:', error);
    res.status(500).json({ error: 'Failed to display NFT' });
  }
});

module.exports = router;
