# 🤖 AI Trading Bot Frontend

A React-based frontend application for creating and managing AI trading bots across multiple EVM networks.

## Features

- 🔐 **EVM Wallet Generation**: Create new wallets or import existing ones
- 🌐 **Multi-Network Support**: Base, Ethereum, BNB, Avalanche, Arbitrum, Polygon, Optimism
- ⚙️ **Bot Configuration**: Easy setup for trading pairs, amounts, and strategies
- 💰 **Funding Guidance**: Step-by-step wallet funding instructions with QR codes
- 🚀 **One-Click Deployment**: Deploy bots to the trading API with validation
- 📊 **Bot Management**: Activate, deactivate, and monitor deployed bots
- 📋 **Real-time Logs**: View execution logs and bot activity

## Getting Started

### Prerequisites

- Node.js 14+ 
- npm or yarn
- Trading Bot API running at https://near-ai.onrender.com

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### Dependencies

- **React**: Frontend framework
- **ethers.js**: Ethereum wallet and blockchain interactions
- **axios**: HTTP client for API calls
- **react-qr-code**: QR code generation for wallet addresses
- **qrcode**: QR code utilities

## Usage Flow

### 1. 🔐 Wallet Setup
- Generate a new EVM wallet or import existing one
- Wallet works across all supported networks
- Copy address, private key, and mnemonic phrase
- Scan QR code for easy mobile access

### 2. ⚙️ Bot Configuration
- Enter bot name and description
- Select trading pair (e.g., ETH → USDC)
- Choose origin and destination networks
- Set amount per trade
- Enable test mode for safe testing

### 3. 💰 Wallet Funding
- Send tokens to your generated wallet address
- Follow network-specific funding instructions
- Use QR code for easy transfers
- Complete pre-deployment checklist

### 4. 🚀 Bot Deployment
- Review final configuration
- Deploy to trading bot API
- Real-time validation with your funds
- Automatic bot creation and testing

### 5. 📊 Bot Management
- View all deployed bots
- Activate/deactivate trading bots
- Monitor execution logs
- Track bot performance

## Supported Networks

| Network | Symbol | Native Token |
|---------|--------|--------------|
| Base | BASE | ETH |
| Ethereum | ETHEREUM | ETH |
| BNB Smart Chain | BNB | BNB |
| Avalanche | AVAX | AVAX |
| Arbitrum | ARBITRUM | ETH |
| Polygon | POLYGON | MATIC |
| Optimism | OPTIMISM | ETH |

## Supported Tokens

- ETH (Ethereum)
- USDC (USD Coin)
- USDT (Tether USD)
- DAI (Dai Stablecoin)
- BTC (Bitcoin)
- WETH (Wrapped ETH)

## Security Features

- 🔐 Client-side wallet generation
- 🔒 Private keys never leave your browser
- ⚠️ Clear warnings for real vs test mode
- ✅ Pre-deployment validation
- 🛡️ Secure API communication

## API Integration

The frontend integrates with the Trading Bot API at `https://near-ai.onrender.com`:

- `POST /api/bots` - Create new trading bot
- `GET /api/bots` - List all bots
- `POST /api/bots/:id/activate` - Activate bot
- `POST /api/bots/:id/deactivate` - Deactivate bot
- `GET /api/bots/:id/logs` - Get bot logs
- `GET /api/health` - Check API health

## Development

### Project Structure

```
src/
├── App.js          # Main React component
├── App.css         # Application styles
├── index.js        # React entry point
└── index.css       # Global styles
```

### Key Components

- **App**: Main application container
- **BotCard**: Individual bot management component
- **Step Components**: Wallet, Configure, Fund, Deploy, Manage

### State Management

- React useState for local state
- Wallet information (address, private key, mnemonic)
- Bot configuration settings
- Deployed bots list and logs
- Loading and error states

## Building for Production

```bash
# Create production build
npm run build

# Serve static files
npx serve -s build
```

## Security Considerations

⚠️ **Important Security Notes:**

1. **Private Keys**: Generated locally, never sent to servers
2. **Test Mode**: Always test with small amounts first
3. **Real Funds**: Only use real funds when you understand the risks
4. **Network Validation**: Verify network and token addresses
5. **Backup**: Save your mnemonic phrase securely

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if trading bot API is running
   - Verify network connectivity
   - Check browser console for errors

2. **Wallet Import Failed**
   - Verify private key or mnemonic format
   - Ensure no extra spaces or characters

3. **Bot Deployment Failed**
   - Check wallet has sufficient funds
   - Verify token and network configuration
   - Review API error messages

### Getting Help

- Check browser console for error messages
- Verify API health at https://near-ai.onrender.com/api/health
- Review bot configuration before deployment

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy Trading! 🚀💰**