# 🚀 NEAR-API: Cross-Chain Swap API

> **Production-ready examples and REST API for cross-chain token swaps using NEAR Intents 1-Click SDK**

[![API Ready](https://img.shields.io/badge/API-Production%20Ready-brightgreen.svg)](./API-README.md)
[![94 Tokens](https://img.shields.io/badge/Tokens-94-orange.svg)](./API-README.md#supported-assets)
[![19 Chains](https://img.shields.io/badge/Chains-19-purple.svg)](./API-README.md#supported-blockchains)
[![Security Hardened](https://img.shields.io/badge/Security-Hardened-blue.svg)](./SECURITY-CHECKLIST.md)

A comprehensive tutorial and production-ready REST API demonstrating cross-chain token swaps with [**NEAR Intents**](https://docs.near-intents.org) using [**1-Click API**](https://docs.near-intents.org/near-intents/integration/distribution-channels/1click-api).

## 📚 Documentation

- **[🌐 Complete API Documentation](./API-README.md)** - REST API endpoints, examples & integration
- **[🚀 Deployment Guide](./DEPLOYMENT.md)** - Deploy to Render, Vercel, Railway & more
- **[🔒 Security Checklist](./SECURITY-CHECKLIST.md)** - Production security best practices

## ⚡ Quick Start

### **🌐 REST API Server (New!)**

Get a production-ready API running in 30 seconds:

```bash
# Clone and install
git clone https://github.com/harshalmadnani/near-api
cd near-api
pnpm install

# Start the API server
pnpm start:server

# Server runs on http://localhost:3000
# API docs: http://localhost:3000
```

#### **Execute Your First Swap**

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

### **📋 SDK Examples**

Follow step-by-step tutorials:

```bash
pnpm getTokens        # 1. Fetch 94 available tokens
pnpm getQuote         # 2. Get swap quotes
pnpm sendDeposit      # 3. Send deposit
pnpm checkStatus      # 4. Monitor status
pnpm fullSwap         # 5. Complete swap flow
```

## 🎯 What This Repository Includes

### **🌐 Production REST API**
- **Express.js server** with comprehensive endpoints
- **94 tokens** across 19 blockchains support
- **Automatic decimal handling** and validation
- **Real-time swap monitoring** with status updates
- **Production security** features (rate limiting, CORS, validation)
- **Ready for deployment** to Render, Vercel, Railway

### **📋 Step-by-Step Examples**
- **Individual components**: tokens, quotes, deposits, status checks
- **Full integration**: complete swap implementation
- **EVM support**: direct EVM chain transactions
- **Test scenarios**: AVAX, Base, Arbitrum swap examples

### **🚀 Deployment Ready**
- **Multiple platforms**: Render, Vercel, Railway, Heroku
- **Environment configuration**: secure variable management
- **Health checks**: monitoring and diagnostics
- **Documentation**: complete guides and examples

## 🛠️ Available Scripts

### **🌐 API Server**
```bash
pnpm start:server      # Start production API server (recommended)
pnpm dev              # Start development server with hot reload
```

### **📋 SDK Examples**
```bash
pnpm getTokens        # Fetch all available tokens (94 tokens)
pnpm getQuote         # Get swap quote with pricing
pnpm sendDeposit      # Send deposit transaction  
pnpm checkStatus      # Check swap status
pnpm fullSwap         # Complete end-to-end swap
```

### **🧪 Testing**
```bash
# Test specific swap scenarios
ts-node 1click-example/test-avax-swap.ts
```

### **🚀 Production**
```bash
pnpm build           # Build for production
pnpm start           # Start built server
```

## 🗂️ Project Structure

```
near-intents-examples/
├── 1click-example/
│   ├── swap-server.ts           # 🌐 Express API server
│   ├── swap-api.ts              # 🔧 Core swap logic
│   ├── tokens-database.ts       # 🪙 94 token database
│   ├── 3-send-evm-deposit.ts    # 💸 EVM transactions
│   ├── 1-get-tokens.ts          # 📋 Fetch tokens
│   ├── 2-get-quote.ts           # 💰 Get quotes
│   ├── 4-check-status.ts        # 🔍 Status monitoring
│   ├── 5-full-swap.ts           # 🔄 Complete swaps
│   ├── test-avax-swap.ts        # 🧪 AVAX tests
│   ├── near.ts                  # 🔗 NEAR utilities
│   └── utils.ts                 # 🛠️ Helper functions
├── API-README.md                # 📖 Complete API docs
├── DEPLOYMENT.md                # 🚀 Deploy guide
├── SECURITY-CHECKLIST.md        # 🔒 Security docs
├── render.yaml                  # ☁️ Render config
└── env.example                  # 🔧 Environment template
```

## 🚀 Features

### **🌐 REST API Features**
- ✅ **94 tokens** across 19 blockchains
- ✅ **Automatic decimal adjustment** for all tokens
- ✅ **Real-time status monitoring** with polling
- ✅ **Production security** (rate limiting, CORS, validation)
- ✅ **EVM chain support** (Base, Arbitrum, Avalanche, etc.)
- ✅ **Complete swap orchestration** in one API call
- ✅ **Deployment ready** for multiple platforms

### **📋 Educational Examples**
- ✅ **Step-by-step tutorials** for each swap component
- ✅ **NEAR and EVM integration** examples
- ✅ **Status monitoring** and error handling
- ✅ **Complete swap flows** with real transactions
- ✅ **Test scenarios** for popular token pairs

## Prerequisites

- [pnpm >= 8](https://pnpm.io/) or npm
- [Node.js >=16](https://nodejs.org/en)
- [TypeScript](https://www.typescriptlang.org/)
- **For examples**: NEAR account with sufficient balance (~0.05 $NEAR)
- **For examples**: 1-Click SDK JWT token → [Request here](https://docs.google.com/forms/d/e/1FAIpQLSdrSrqSkKOMb_a8XhwF0f7N5xZ0Y5CYgyzxiAuoC2g4a2N68g/viewform)

## 🔧 Configuration

### **For API Server (Production)**
```bash
# Copy environment template
cp env.example .env

# Configure for production (optional)
NODE_ENV=production
PORT=3000
```

⚠️ **Security Note**: The API accepts wallet details via request body - environment variables are only for examples/testing.

### **For SDK Examples (Development)**

Create a `.env` file with your credentials _(see [env.example](./env.example))_:

```env
# For NEAR examples
SENDER_NEAR_ACCOUNT=your-account.near
SENDER_PRIVATE_KEY=your_near_private_key
ONE_CLICK_JWT=your_json_web_token

# For EVM examples (use test wallets only!)
TEST_SENDER_ADDRESS=0x...
TEST_PRIVATE_KEY=0x...
TEST_RECIPIENT_ADDRESS=0x...
```

## 🎯 Swap Flow

1. **Quote Generation**: Get token swap pricing quote with a `depositAddress`
2. **Token Deposit**: Send token amount to the `depositAddress`  
3. **Intent Execution**: 1-Click executes swap on specified chain(s) with NEAR Intents
4. **Status Monitoring**: Track progress until completion

## 📚 Tutorial Steps

### **🌐 API Usage (Recommended)**

See [**API Documentation**](./API-README.md) for complete REST API usage.

### **📋 SDK Examples**

Open each file _before_ executing to understand the detailed comments and configuration options.

#### **Step 1: Get Available Tokens**
```bash
pnpm getTokens
```
- **File**: [1-get-tokens.ts](./1click-example/1-get-tokens.ts)
- **Purpose**: Fetches 94 supported tokens across 19 blockchains
- **Output**: Organized token list with `assetId` for quotes

#### **Step 2: Get Quote**
```bash
pnpm getQuote
```
- **File**: [2-get-quote.ts](./1click-example/2-get-quote.ts)  
- **Purpose**: Retrieves swap quotes with pricing and deposit addresses
- **Output**: Quote details with expected amounts and fees

#### **Step 3: Send Deposit**
```bash
pnpm sendDeposit
```
- **File**: [3-send-deposit.ts](./1click-example/3-send-deposit.ts)
- **Purpose**: Sends tokens to deposit address to initiate swap
- **Output**: Transaction hash for tracking

#### **Step 4: Check Status**
```bash
pnpm checkStatus
```
- **File**: [4-check-status.ts](./1click-example/4-check-status.ts)
- **Purpose**: Monitors swap progress through completion
- **Output**: Real-time status updates

#### **Step 5: Full Swap**
```bash
pnpm fullSwap
```
- **File**: [5-full-swap.ts](./1click-example/5-full-swap.ts)
- **Purpose**: Complete swap flow with automatic monitoring
- **Output**: End-to-end swap execution

## 🎯 Example Responses

### **Successful API Swap**
```json
{
  "success": true,
  "quote": {
    "amountInFormatted": "1.0",
    "amountOutFormatted": "0.797598", 
    "amountInUsd": "0.9998",
    "amountOutUsd": "0.7974"
  },
  "depositTxHash": "0x...",
  "finalStatus": {
    "status": "SUCCESS",
    "swapDetails": {
      "slippage": 0,
      "destinationChainTxHashes": [{"hash": "0x..."}]
    }
  }
}
```

### **Popular Swap Examples**
- ✅ **BASE USDC → ARB ARB** (~30s, $0.02 fee)
- ✅ **BASE USDC → AVAX USDC** (~45s, $0.03 fee)  
- ✅ **AVAX USDC → BASE USDC** (~35s, $0.02 fee)
- ✅ **ETH USDC → BASE USDC** (~60s, $0.05 fee)

## 🔍 Status Monitoring

The system tracks swaps through these stages:
- `PENDING_DEPOSIT`: Waiting for deposit confirmation
- `KNOWN_DEPOSIT_TX`: Deposit transaction detected
- `PROCESSING`: Swap being executed
- `SUCCESS`: Swap completed successfully
- `REFUNDED`: Swap failed, tokens refunded

## 🚀 Deployment

Deploy your API to production in minutes:

1. **[Render](https://render.com)** (recommended): See [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **Vercel**: `vercel --prod`
3. **Railway**: Connect GitHub repo
4. **Heroku**: `git push heroku main`

## 🔗 Dependencies

- **[@defuse-protocol/one-click-sdk-typescript](https://www.npmjs.com/package/@defuse-protocol/one-click-sdk-typescript)**: Official 1-Click SDK
- **[@near-js/*](https://github.com/near/near-api-js)**: NEAR blockchain interaction
- **[ethers](https://ethers.org/)**: Ethereum and EVM chain interaction
- **[express](https://expressjs.com/)**: REST API server framework
- **[cors](https://github.com/expressjs/cors)**: Cross-origin resource sharing
- **TypeScript**: Type-safe development

## 📖 Learn More

- **[API Documentation](./API-README.md)** - Complete REST API guide
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment
- **[Security Checklist](./SECURITY-CHECKLIST.md)** - Security best practices
- [1-Click API Docs](https://docs.near-intents.org/near-intents/integration/distribution-channels/1click-api)
- [1-Click TypeScript SDK Repo](https://github.com/defuse-protocol/one-click-sdk-typescript)
- [NEAR Intents Explorer](https://explorer.near-intents.org)
- [NEAR Protocol Documentation](https://docs.near.org)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Add tests for new features
4. Ensure security compliance
5. Submit pull request

Contributions are welcome! Please feel free to submit issues and enhancement requests.

## 📄 License

This project is provided as educational examples for the 1-Click SDK and NEAR Intents ecosystem.

---

## 🎯 What's Next?

- [ ] WebSocket support for real-time swap updates
- [ ] Batch swap operations  
- [ ] Advanced routing optimization
- [ ] Additional blockchain support
- [ ] SDK packages for popular languages

---

**🚀 Ready to integrate cross-chain swaps?**

- **For API integration**: Start with [API Documentation](./API-README.md)
- **For learning**: Follow the step-by-step examples above
- **For production**: Check out the [Deployment Guide](./DEPLOYMENT.md)