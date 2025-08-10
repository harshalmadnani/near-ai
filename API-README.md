# 🚀 NEAR Intents Cross-Chain Swap API

> **Enterprise-ready REST API for seamless cross-chain token swaps powered by NEAR Intents**

[![Production Ready](https://img.shields.io/badge/Production-Ready-brightgreen.svg)](./DEPLOYMENT.md)
[![Security Hardened](https://img.shields.io/badge/Security-Hardened-blue.svg)](./SECURITY-CHECKLIST.md)
[![94 Tokens](https://img.shields.io/badge/Tokens-94-orange.svg)](#supported-tokens)
[![19 Chains](https://img.shields.io/badge/Chains-19-purple.svg)](#supported-blockchains)

## 📋 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [🌐 Live API Endpoints](#-live-api-endpoints)
- [💱 Swap API](#-swap-api)
- [🪙 Token Management APIs](#-token-management-apis)
- [🔗 Blockchain APIs](#-blockchain-apis)
- [❤️ System APIs](#️-system-apis)
- [📊 Supported Assets](#-supported-assets)
- [🛠️ Development](#️-development)
- [🚀 Deployment](#-deployment)
- [🔒 Security](#-security)
- [📈 Examples](#-examples)

## 🚀 Quick Start

### **Local Development**

```bash
# Clone and install
git clone <your-repo>
cd near-intents-examples
pnpm install

# Start the server
pnpm start:server

# Server runs on http://localhost:3000
```

### **Health Check**

```bash
curl http://localhost:3000/api/health
```

### **First Swap**

```bash
curl -X POST http://localhost:3000/api/swap \
  -H "Content-Type: application/json" \
  -d '{
    "senderAddress": "0xYourWalletAddress",
    "senderPrivateKey": "0xYourPrivateKey",
    "recipientAddress": "0xYourRecipientAddress",
    "originSymbol": "USDC",
    "originBlockchain": "BASE",
    "destinationSymbol": "ARB",
    "destinationBlockchain": "ARB",
    "amount": "1.0"
  }'
```

## 🌐 Live API Endpoints

| Endpoint | Method | Description | Example |
|----------|--------|-------------|---------|
| `/api/swap` | POST | Execute cross-chain swap | [Example](#swap-execution) |
| `/api/tokens` | GET | List all supported tokens | [Example](#all-tokens) |
| `/api/tokens/:blockchain` | GET | Get tokens for specific chain | [Example](#chain-tokens) |
| `/api/blockchains` | GET | List supported blockchains | [Example](#blockchains) |
| `/api/symbols` | GET | List supported token symbols | [Example](#symbols) |
| `/api/health` | GET | API health check | [Example](#health-check) |

## 💱 Swap API

### **POST /api/swap**

Execute cross-chain token swaps with automatic decimal handling and real-time status monitoring.

#### **Request Body**

```typescript
{
  senderAddress: string;      // EVM wallet address (0x...)
  senderPrivateKey: string;   // Private key for signing (0x...)
  recipientAddress: string;   // Recipient wallet address (0x...)
  originSymbol: string;       // Token symbol (e.g., "USDC", "ETH")
  originBlockchain: string;   // Source chain (e.g., "BASE", "ETH")
  destinationSymbol: string;  // Target token symbol
  destinationBlockchain: string; // Target chain
  amount: string;            // Amount in human-readable format (e.g., "1.5")
}
```

#### **Response**

```typescript
{
  success: boolean;
  quote: {
    quote: {
      amountIn: string;           // Amount in smallest units
      amountInFormatted: string;  // Human-readable input amount
      amountOut: string;          // Output amount in smallest units
      amountOutFormatted: string; // Human-readable output amount
      amountInUsd: string;        // USD value of input
      amountOutUsd: string;       // USD value of output
      timeEstimate: number;       // Estimated completion time (seconds)
      depositAddress: string;     // Address to send tokens to
      deadline: string;           // Quote expiration time
    }
  };
  depositAddress: string;       // Deposit address
  depositTxHash: string;        // Transaction hash of deposit
  finalStatus: {
    status: string;             // "SUCCESS" | "PENDING" | "FAILED"
    swapDetails: {
      amountIn: string;
      amountOut: string;
      slippage: number;
      destinationChainTxHashes: Array<{
        hash: string;
        explorerUrl: string;
      }>;
    }
  };
  details: {
    originToken: Token;         // Source token details
    destinationToken: Token;    // Target token details
    adjustedAmount: string;     // Amount in smallest units
    tokenContractAddress: string; // ERC-20 contract address
    rpcUrl: string;            // RPC endpoint used
  }
}
```

#### **Example Usage**

<details>
<summary><b>Base USDC → Arbitrum ARB</b></summary>

```bash
curl -X POST http://localhost:3000/api/swap \
  -H "Content-Type: application/json" \
  -d '{
    "senderAddress": "0xYourWalletAddress",
    "senderPrivateKey": "0xYourPrivateKey",
    "recipientAddress": "0xYourRecipientAddress",
    "originSymbol": "USDC",
    "originBlockchain": "BASE",
    "destinationSymbol": "ARB",
    "destinationBlockchain": "ARB",
    "amount": "1.0"
  }'
```

</details>

<details>
<summary><b>AVAX USDC → Base USDC</b></summary>

```bash
curl -X POST http://localhost:3000/api/swap \
  -H "Content-Type: application/json" \
  -d '{
    "senderAddress": "0xYourWalletAddress",
    "senderPrivateKey": "0xYourPrivateKey",
    "recipientAddress": "0xYourRecipientAddress",
    "originSymbol": "USDC",
    "originBlockchain": "AVAX",
    "destinationSymbol": "USDC",
    "destinationBlockchain": "BASE",
    "amount": "0.8"
  }'
```

</details>

<details>
<summary><b>Base USDC → AVAX Native</b></summary>

```bash
curl -X POST http://localhost:3000/api/swap \
  -H "Content-Type: application/json" \
  -d '{
    "senderAddress": "0xYourWalletAddress",
    "senderPrivateKey": "0xYourPrivateKey",
    "recipientAddress": "0xYourRecipientAddress",
    "originSymbol": "USDC",
    "originBlockchain": "BASE",
    "destinationSymbol": "AVAX",
    "destinationBlockchain": "AVAX",
    "amount": "1.0"
  }'
```

</details>

## 🪙 Token Management APIs

### **GET /api/tokens**

Get all supported tokens across all blockchains.

#### **Response**

```typescript
{
  success: boolean;
  tokens: Array<{
    symbol: string;       // Token symbol (e.g., "USDC")
    assetId: string;      // NEAR asset ID
    decimals: number;     // Token decimals
    blockchain: string;   // Blockchain name
  }>;
  summary: {
    totalTokens: number;
    blockchains: number;
    uniqueSymbols: number;
  }
}
```

#### **Example**

```bash
curl http://localhost:3000/api/tokens
```

### **GET /api/tokens/:blockchain**

Get tokens for a specific blockchain.

#### **Parameters**
- `blockchain`: Blockchain name (e.g., "BASE", "ETH", "AVAX")

#### **Example**

```bash
# Get all Base tokens
curl http://localhost:3000/api/tokens/BASE

# Get all Ethereum tokens
curl http://localhost:3000/api/tokens/ETH
```

## 🔗 Blockchain APIs

### **GET /api/blockchains**

List all supported blockchains.

#### **Response**

```typescript
{
  success: boolean;
  blockchains: string[];  // Array of blockchain names
  count: number;
}
```

#### **Example**

```bash
curl http://localhost:3000/api/blockchains
```

### **GET /api/symbols**

Get all unique token symbols.

#### **Response**

```typescript
{
  success: boolean;
  symbols: string[];      // Array of unique symbols
  count: number;
}
```

#### **Example**

```bash
curl http://localhost:3000/api/symbols
```

## ❤️ System APIs

### **GET /api/health**

API health check and system status.

#### **Response**

```typescript
{
  success: boolean;
  status: "healthy" | "unhealthy";
  timestamp: string;      // ISO timestamp
  uptime: number;         // Server uptime in seconds
  version: string;        // API version
}
```

#### **Example**

```bash
curl http://localhost:3000/api/health
```

### **GET /**

API documentation and overview.

#### **Response**

Complete API documentation with examples, supported chains, and usage instructions.

#### **Example**

```bash
curl http://localhost:3000/
```

## 📊 Supported Assets

### **Supported Blockchains (19)**

| Chain | Symbol | Type | RPC Support |
|-------|--------|------|-------------|
| Arbitrum | ARB | EVM | ✅ |
| Avalanche | AVAX | EVM | ✅ |
| Base | BASE | EVM | ✅ |
| Berachain | BERA | EVM | ✅ |
| BSC | BSC | EVM | ✅ |
| Ethereum | ETH | EVM | ✅ |
| Gnosis | GNOSIS | EVM | ✅ |
| Optimism | OP | EVM | ✅ |
| Polygon | POL | EVM | ✅ |
| NEAR | NEAR | NEAR | ✅ |
| Bitcoin | BTC | UTXO | ❌ |
| Cardano | CARDANO | - | ❌ |
| Dogecoin | DOGE | UTXO | ❌ |
| Solana | SOL | - | ❌ |
| Sui | SUI | - | ❌ |
| Ton | TON | - | ❌ |
| Tron | TRON | - | ❌ |
| XRP | XRP | - | ❌ |
| Zcash | ZEC | UTXO | ❌ |

### **Popular Token Pairs**

| From | To | Fee | Time |
|------|----|----|------|
| BASE USDC | ARB ARB | ~$0.02 | 30s |
| BASE USDC | AVAX USDC | ~$0.03 | 45s |
| AVAX USDC | BASE USDC | ~$0.02 | 35s |
| ETH USDC | BASE USDC | ~$0.05 | 60s |
| BASE ETH | ARB ETH | ~$0.04 | 40s |

### **Token Statistics**

- **Total Tokens**: 94
- **Unique Symbols**: 60
- **EVM Chains**: 9 (with direct support)
- **Cross-Chain Routes**: 200+

## 🛠️ Development

### **Prerequisites**

- Node.js 18+
- pnpm (recommended) or npm
- TypeScript knowledge

### **Installation**

```bash
# Clone repository
git clone <your-repo-url>
cd near-intents-examples

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### **Available Scripts**

```bash
# Development
pnpm dev                 # Start dev server with hot reload
pnpm start:server        # Start production server

# Examples
pnpm getTokens           # Fetch available tokens
pnpm getQuote            # Get swap quote
pnpm fullSwap            # Execute full swap

# Build & Deploy
pnpm build               # Build for production
pnpm start               # Start built server
```

### **Environment Variables**

Create `.env` from `env.example`:

```bash
cp env.example .env
```

Required variables:
```bash
NODE_ENV=development
PORT=3000

# Optional test variables (use test wallets only!)
TEST_SENDER_ADDRESS=0x...
TEST_PRIVATE_KEY=0x...
TEST_RECIPIENT_ADDRESS=0x...
```

### **Project Structure**

```
near-intents-examples/
├── 1click-example/
│   ├── swap-server.ts           # Express API server
│   ├── swap-api.ts              # Core swap logic
│   ├── tokens-database.ts       # Token metadata
│   ├── 3-send-evm-deposit.ts    # EVM transaction handling
│   ├── 5-full-swap.ts           # Full swap example
│   └── test-avax-swap.ts        # AVAX swap tests
├── DEPLOYMENT.md                # Deployment guide
├── SECURITY-CHECKLIST.md        # Security documentation
├── render.yaml                  # Render config
└── package.json
```

## 🚀 Deployment

### **Render (Recommended)**

1. **Push to GitHub** (ensure no sensitive data)
2. **Create Web Service** on [Render](https://render.com)
3. **Configure**:
   ```
   Build Command: pnpm install
   Start Command: pnpm start:server
   ```
4. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   ```
5. **Deploy!**

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### **Other Platforms**

- **Vercel**: Use `vercel.json` configuration
- **Railway**: Direct GitHub integration
- **Heroku**: Set buildpacks and config vars
- **DigitalOcean**: Use App Platform

## 🔒 Security

### **Security Features**

✅ **No sensitive data in code**  
✅ **Environment variable configuration**  
✅ **Rate limiting (100 req/15min)**  
✅ **Input validation**  
✅ **CORS protection**  
✅ **Error handling without data exposure**  

### **Security Best Practices**

1. **Never commit private keys**
2. **Use test wallets for development**
3. **Validate all inputs**
4. **Monitor API usage**
5. **Use HTTPS in production**

See [SECURITY-CHECKLIST.md](./SECURITY-CHECKLIST.md) for complete security documentation.

## 📈 Examples

### **Frontend Integration**

#### **React/Next.js**

```javascript
const executeSwap = async (swapData) => {
  const response = await fetch('https://your-api.onrender.com/api/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(swapData)
  });
  
  if (!response.ok) {
    throw new Error(`Swap failed: ${response.statusText}`);
  }
  
  return await response.json();
};

// Usage
const swapResult = await executeSwap({
  senderAddress: "0x...",
  senderPrivateKey: "0x...",
  recipientAddress: "0x...",
  originSymbol: "USDC",
  originBlockchain: "BASE",
  destinationSymbol: "ARB",
  destinationBlockchain: "ARB",
  amount: "1.0"
});
```

#### **Node.js/Backend**

```javascript
const axios = require('axios');

const swap = async (params) => {
  try {
    const response = await axios.post('https://your-api.onrender.com/api/swap', params);
    return response.data;
  } catch (error) {
    console.error('Swap failed:', error.response?.data || error.message);
    throw error;
  }
};
```

### **Python Integration**

```python
import requests

def execute_swap(swap_data):
    response = requests.post(
        'https://your-api.onrender.com/api/swap',
        json=swap_data
    )
    response.raise_for_status()
    return response.json()

# Usage
result = execute_swap({
    "senderAddress": "0x...",
    "senderPrivateKey": "0x...",
    "recipientAddress": "0x...",
    "originSymbol": "USDC",
    "originBlockchain": "BASE",
    "destinationSymbol": "ARB",
    "destinationBlockchain": "ARB",
    "amount": "1.0"
})
```

### **cURL Examples**

<details>
<summary><b>Complete cURL Examples</b></summary>

```bash
# Health Check
curl https://your-api.onrender.com/api/health

# Get all tokens
curl https://your-api.onrender.com/api/tokens

# Get Base tokens only
curl https://your-api.onrender.com/api/tokens/BASE

# Execute swap
curl -X POST https://your-api.onrender.com/api/swap \
  -H "Content-Type: application/json" \
  -d '{
    "senderAddress": "0xYourAddress",
    "senderPrivateKey": "0xYourPrivateKey",
    "recipientAddress": "0xRecipientAddress",
    "originSymbol": "USDC",
    "originBlockchain": "BASE",
    "destinationSymbol": "ARB",
    "destinationBlockchain": "ARB",
    "amount": "1.0"
  }'
```

</details>

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: [API Documentation](http://localhost:3000)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Security**: [Security Policy](./SECURITY-CHECKLIST.md)
- **Deployment**: [Deployment Guide](./DEPLOYMENT.md)

---

## 🎯 What's Next?

- [ ] WebSocket support for real-time swap updates
- [ ] Batch swap operations
- [ ] Advanced routing optimization
- [ ] Additional blockchain support
- [ ] SDK packages for popular languages

---

**🚀 Ready to integrate cross-chain swaps into your application?**

Start with the [Quick Start](#-quick-start) guide and have your first swap running in minutes!
