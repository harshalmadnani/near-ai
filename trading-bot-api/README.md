# AI Trading Bot API

An AI-powered trading bot platform that uses OpenAI o3-mini to generate custom trading bots, monitors real-time price data via Mobula WebSocket, executes trades through NEAR Intents, and deploys bots to Vercel.

## Features

- 🤖 **AI Bot Generation**: Uses OpenAI o3-mini to generate custom trading bot code based on user prompts
- 📊 **Real-time Price Monitoring**: Connects to Mobula WebSocket for live token price data
- 🔄 **Cross-chain Trading**: Executes swaps via NEAR Intents API across multiple blockchains
- ☁️ **Auto-deployment**: Automatically deploys generated bots to Vercel as serverless functions
- 🎯 **Smart Strategies**: Supports price thresholds, ranges, intervals, and custom trading logic
- 📈 **Performance Tracking**: Logs all trades and provides optimization suggestions

## Quick Start

### 1. Environment Setup

```bash
# Clone and setup
git clone <repo>
cd trading-bot-api
npm install

# Copy environment file and configure
cp env.example .env
```

Edit `.env` with your API keys:
```env
OPENAI_API_KEY=sk-proj-your-openai-key-here
VERCEL_TOKEN=your-vercel-token-here
MOBULA_API_KEY=your-mobula-api-key-here
TARGET_TOKEN_ID=e26c7e73-d918-44d9-9de3-7cbe55b63b99
```

### 2. Build and Run

```bash
# Build the project
npm run build

# Start the server
npm start

# Or run in development mode
npm run dev
```

### 3. Test the API

```bash
# Check health
curl http://localhost:3000/api/health

# Get API info
curl http://localhost:3000/api/info

# Get example bot configuration
curl -X POST http://localhost:3000/api/example-bot
```

## API Endpoints

### Bot Management

#### Create Bot
```bash
POST /api/bots
Content-Type: application/json

{
  "name": "My Trading Bot",
  "prompt": "Create a bot that buys when price drops below $1.50 and sells when it goes above $2.00",
  "swapConfig": {
    "senderAddress": "0x...",
    "senderPrivateKey": "0x...",
    "recipientAddress": "0x...",
    "originSymbol": "USDC",
    "originBlockchain": "BASE",
    "destinationSymbol": "ARB",
    "destinationBlockchain": "ARB",
    "amount": "10.0",
    "isTest": false
  }
}
```

#### List All Bots
```bash
GET /api/bots
```

#### Get Specific Bot
```bash
GET /api/bots/:botId
```

#### Activate Bot
```bash
POST /api/bots/:botId/activate
```

#### Deactivate Bot
```bash
POST /api/bots/:botId/deactivate
```

#### Delete Bot
```bash
DELETE /api/bots/:botId
```

#### Get Bot Logs
```bash
GET /api/bots/:botId/logs
```

#### Optimize Bot Strategy
```bash
POST /api/bots/:botId/optimize
```

### Market Data

#### Get Active Bots
```bash
GET /api/bots/status/active
```

#### Get Price History
```bash
GET /api/bots/market/price-history?limit=100
```

## Trading Strategies

The API supports several trading strategy types:

### 1. Price Threshold
```javascript
{
  "type": "price_threshold",
  "parameters": {
    "buyThreshold": 1.50,
    "sellThreshold": 2.00
  }
}
```

### 2. Price Range
```javascript
{
  "type": "price_range",
  "parameters": {
    "minPrice": 1.00,
    "maxPrice": 2.50
  }
}
```

### 3. Interval-based
```javascript
{
  "type": "interval",
  "parameters": {
    "interval": 1800000 // 30 minutes in milliseconds
  }
}
```

### 4. Custom Logic
```javascript
{
  "type": "custom",
  "parameters": {
    "customLogic": "Your custom trading logic description"
  }
}
```

## Supported Blockchains

- **BASE**: Base network
- **ARB**: Arbitrum
- **ETH**: Ethereum mainnet
- **OP**: Optimism
- **POL**: Polygon
- **BSC**: Binance Smart Chain
- **AVAX**: Avalanche

## Example Bot Prompts

### DCA Bot
```
"Create a dollar-cost averaging bot that buys $10 worth of ARB tokens every hour when the price is below $1.50"
```

### Momentum Bot
```
"Create a momentum bot that buys when price increases by 5% in the last hour and sells when it drops by 3%"
```

### Range Trading Bot
```
"Create a range trading bot that buys USDC with ETH when ETH price is below $3000 and sells when above $3500"
```

### Volatility Bot
```
"Create a volatility bot that executes trades when price volatility exceeds 10% in a 15-minute window"
```

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Prompt   │───▶│   OpenAI o3-mini │───▶│  Generated Bot  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
┌─────────────────┐    ┌──────────────────┐             │
│ Mobula WebSocket│───▶│  Price Monitoring│◀────────────┘
└─────────────────┘    └──────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ NEAR Intents API│◀───│ Trading Execution│───▶│ Vercel Deployment│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Testing

The API includes comprehensive testing endpoints:

```bash
# Test health
curl http://localhost:3000/api/health

# Test with example configuration
curl -X POST http://localhost:3000/api/example-bot

# Create a test bot (requires valid API keys)
curl -X POST http://localhost:3000/api/bots \
  -H "Content-Type: application/json" \
  -d @test-bot-request.json
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Private Keys**: Never hardcode private keys. Use environment variables or secure key management.
2. **API Keys**: Store all API keys securely and rotate them regularly.
3. **Test Mode**: Always test with `isTest: true` before live trading.
4. **Validation**: The API validates all inputs but additional validation is recommended.
5. **Rate Limits**: Be aware of rate limits on OpenAI, Mobula, and Vercel APIs.

## Deployment to Vercel

The generated bots are automatically deployed to Vercel. Each bot becomes a serverless function that:

1. Monitors price data via WebSocket
2. Executes trading logic based on generated strategy
3. Logs all activities and errors
4. Can be monitored and controlled via the main API

## Error Handling

The API includes comprehensive error handling:

- **OpenAI Errors**: Invalid API keys, rate limits, model issues
- **WebSocket Errors**: Connection failures, subscription issues
- **Trading Errors**: Invalid swap configurations, insufficient funds
- **Deployment Errors**: Vercel deployment failures, configuration issues

## Monitoring and Logs

All bot activities are logged and can be accessed via:

```bash
# Get execution logs for a specific bot
GET /api/bots/:botId/logs

# Get price history
GET /api/bots/market/price-history

# Get active bots status
GET /api/bots/status/active
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Check the API health endpoint: `/api/health`
- Review the API info: `/api/info`  
- Check server logs for detailed error information