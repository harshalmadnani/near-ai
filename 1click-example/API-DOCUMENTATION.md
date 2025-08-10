# 🚀 NEAR Intents Cross-Chain Swap API

A comprehensive REST API for executing cross-chain token swaps using NEAR Intents and the 1-Click API. This API accepts human-readable parameters (token symbols, readable amounts) and handles all the complexity internally.

## ✨ Features

- **Symbol-Based Token Selection**: Use familiar token symbols like "USDC", "ARB", "ETH" instead of complex asset IDs
- **Automatic Decimal Handling**: Enter human-readable amounts (e.g., "1.5") - decimals are handled automatically
- **Multi-Chain Support**: 19 blockchains with 94+ tokens supported
- **Real-Time Status Monitoring**: Automatic swap status tracking until completion
- **Type-Safe**: Full TypeScript support with comprehensive error handling
- **RESTful Design**: Standard HTTP endpoints with JSON request/response

## 🏗️ Architecture

### Core Components

1. **`swap-api.ts`** - Core swap logic with symbol-to-assetId conversion
2. **`swap-server.ts`** - Express.js REST API server
3. **`tokens-database.ts`** - Comprehensive database of 94 supported tokens
4. **`3-send-evm-deposit.ts`** - EVM blockchain transaction handling

### Supported Features

- ✅ **EVM to EVM Swaps**: Base ↔ Arbitrum ↔ Ethereum ↔ Optimism ↔ Polygon
- ✅ **Symbol-Based Selection**: Use "USDC" instead of "nep141:base-0x833589..."
- ✅ **Decimal Adjustment**: Enter "1.5 USDC" instead of "1500000"
- ✅ **Multi-Chain Support**: 19 blockchains, 60+ unique symbols
- ✅ **Real-Time Monitoring**: Status polling until swap completion
- ✅ **Error Handling**: Comprehensive validation and error messages

## 🌐 API Endpoints

### POST /api/swap
Execute a cross-chain token swap

**Request Body:**
```json
{
  "senderAddress": "0x6dd0d673c0c434839a344328b4cdcff53a53fb9b",
  "senderPrivateKey": "0x9f0890725e0d332841bb908eb5d5e6d54056d736eeb087c6832b0a1ad5a2ef39",
  "recipientAddress": "0x6dd0d673c0c434839a344328b4cdcff53a53fb9b",
  "originSymbol": "USDC",
  "originBlockchain": "BASE",
  "destinationSymbol": "ARB", 
  "destinationBlockchain": "ARB",
  "amount": "1.0",
  "isTest": false
}
```

**Response:**
```json
{
  "success": true,
  "quote": { /* Quote details */ },
  "depositAddress": "0x4781ee553868271cD4b5490d3c0d8dc58940D617",
  "depositTxHash": "0x1e20d97442be1972120242ea74abc717...",
  "finalStatus": { /* Final swap status */ },
  "details": {
    "originToken": {
      "symbol": "USDC",
      "assetId": "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near",
      "decimals": 6,
      "blockchain": "BASE"
    },
    "destinationToken": {
      "symbol": "ARB", 
      "assetId": "nep141:arb-0x912ce59144191c1204e64559fe8253a0e49e6548.omft.near",
      "decimals": 18,
      "blockchain": "ARB"
    },
    "adjustedAmount": "1000000",
    "tokenContractAddress": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    "rpcUrl": "https://mainnet.base.org"
  }
}
```

### GET /api/tokens
Get information about all supported tokens

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTokens": 94,
    "totalBlockchains": 19,
    "uniqueSymbols": 60,
    "blockchains": ["ARB", "AVAX", "BASE", "ETH", "..."]
  },
  "summary": { /* Token summary */ }
}
```

### GET /api/tokens/:blockchain
Get tokens for a specific blockchain

**Example:** `GET /api/tokens/BASE`

**Response:**
```json
{
  "success": true,
  "blockchain": "BASE",
  "tokenCount": 7,
  "tokens": [
    {
      "symbol": "USDC",
      "assetId": "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near",
      "decimals": 6,
      "blockchain": "BASE"
    },
    // ... more tokens
  ]
}
```

### GET /api/blockchains
Get list of supported blockchains

### GET /api/symbols  
Get list of all supported token symbols

### GET /api/health
Health check endpoint

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start the API Server
```bash
pnpm server
# Server starts on http://localhost:3000
```

### 3. Test with cURL
```bash
curl -X POST http://localhost:3000/api/swap \
  -H "Content-Type: application/json" \
  -d '{
    "senderAddress": "0x...",
    "senderPrivateKey": "0x...", 
    "recipientAddress": "0x...",
    "originSymbol": "USDC",
    "originBlockchain": "BASE",
    "destinationSymbol": "ARB",
    "destinationBlockchain": "ARB", 
    "amount": "1.0"
  }'
```

### 4. Use the API Programmatically
```typescript
import { executeSwap, SwapRequest } from './swap-api';

const swapRequest: SwapRequest = {
  senderAddress: "0x...",
  senderPrivateKey: "0x...",
  recipientAddress: "0x...",
  originSymbol: "USDC",
  originBlockchain: "BASE", 
  destinationSymbol: "ARB",
  destinationBlockchain: "ARB",
  amount: "1.5", // 1.5 USDC
  isTest: false
};

const result = await executeSwap(swapRequest);
console.log(result);
```

## 🔧 Configuration

### Supported Swaps

| Origin Chain | Destination Chain | Example Tokens |
|-------------|------------------|----------------|
| BASE | ARB | USDC → ARB |
| ARB | BASE | ARB → USDC |
| ETH | BASE | USDC → USDC |
| BASE | ETH | ETH → ETH |
| All EVM chains | All EVM chains | Various pairs |

### Popular Token Symbols

| Symbol | Supported Chains | Decimals |
|--------|-----------------|----------|
| USDC | BASE, ARB, ETH, OP, POL | 6 |
| ETH | BASE, ARB, ETH | 18 |
| ARB | ARB | 18 |
| USDT | ARB, ETH, TRON | 6 |
| BTC | BTC, ETH (cbBTC) | 8 |

### Environment Variables

```bash
PORT=3000  # API server port (optional, defaults to 3000)
```

## 📊 Response Examples

### Successful Swap
```json
{
  "success": true,
  "quote": {
    "quote": {
      "amountInFormatted": "1.0",
      "amountOutFormatted": "2.164861289857789633",
      "amountInUsd": "0.9998",
      "amountOutUsd": "1.0003",
      "depositAddress": "0x4781ee553868271cD4b5490d3c0d8dc58940D617"
    }
  },
  "depositTxHash": "0x1e20d97442be1972120242ea74abc717...",
  "finalStatus": {
    "status": "SUCCESS",
    "swapDetails": {
      "amountOutFormatted": "2.174375118772303149"
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Origin token INVALID not found on BASE blockchain"
}
```

### Validation Error
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Invalid sender address",
    "Invalid amount"
  ]
}
```

## 🛠️ Development

### Available Scripts
```bash
pnpm swapAPI      # Test the swap API directly
pnpm server       # Start the REST API server  
pnpm getTokens    # View all supported tokens
```

### Testing
```bash
# Test direct API
pnpm swapAPI

# Test server endpoints
pnpm server &
curl http://localhost:3000/api/health
curl http://localhost:3000/api/tokens
```

## 🔒 Security Notes

- **Private Keys**: Never expose private keys in production. Use environment variables or secure key management.
- **Rate Limiting**: Consider adding rate limiting for production deployments
- **HTTPS**: Always use HTTPS in production
- **Input Validation**: All inputs are validated, but ensure additional security measures for production

## 🌍 Supported Blockchains

| Blockchain | Chain ID | Example Tokens |
|------------|----------|----------------|
| BASE | 8453 | USDC, ETH, cbBTC |
| ARB | 42161 | ARB, USDC, ETH |
| ETH | 1 | ETH, USDC, USDT |
| OP | 10 | OP, USDC, ETH |
| POL | 137 | POL, USDC, USDT |
| BSC | 56 | BNB, USDC, USDT |
| AVAX | 43114 | AVAX, USDC, USDT |

## 📈 Performance

- **Swap Execution**: ~30-60 seconds end-to-end
- **Quote Generation**: ~1-3 seconds
- **Status Polling**: Every 2 seconds until completion
- **Supported Volume**: No artificial limits (subject to underlying DEX liquidity)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support, please:
1. Check the error messages (they're comprehensive)
2. Verify token symbols and blockchain names
3. Ensure sufficient balance for swaps
4. Check network connectivity

---

**Ready to swap tokens across chains with ease! 🚀**