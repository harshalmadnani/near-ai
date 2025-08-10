# 🚀 NEAR Intents Swap API - Render Deployment Guide

## 📋 Prerequisites

- GitHub repository with this code
- Render account (free tier available)
- Basic understanding of environment variables

## 🛠️ Deployment Steps

### 1. **Prepare Your Repository**

Ensure all sensitive information has been removed from your code:
- ✅ No hardcoded private keys
- ✅ No hardcoded wallet addresses
- ✅ Environment variables configured

### 2. **Deploy to Render**

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```
   Name: near-intents-swap-api
   Environment: Node
   Build Command: npm install
   Start Command: npx ts-node 1click-example/swap-server.ts
   Node Version: 18 (or latest)
   ```

3. **Set Environment Variables**
   
   In Render Dashboard → Environment:
   ```
   NODE_ENV=production
   PORT=10000
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### 3. **Environment Variables Setup**

Copy from `env.example` and set these in Render:

**Required:**
- `NODE_ENV=production`
- `PORT=10000` (Render sets this automatically)

**Optional (for examples/testing):**
- `EXAMPLE_SENDER_ADDRESS=0x...` (test wallet only)
- `EXAMPLE_PRIVATE_KEY=0x...` (test wallet only)
- `EXAMPLE_RECIPIENT_ADDRESS=0x...` (test wallet only)

⚠️ **Security Note**: Only use test wallets with minimal funds for examples.

### 4. **API Endpoints**

Your deployed API will be available at: `https://your-app-name.onrender.com`

**Available Endpoints:**
- `GET /api/health` - Health check
- `POST /api/swap` - Execute cross-chain swap
- `GET /api/tokens` - List supported tokens
- `GET /api/tokens/:blockchain` - Get tokens for specific chain
- `GET /api/blockchains` - List supported blockchains

### 5. **Test Your Deployment**

```bash
# Health check
curl https://your-app-name.onrender.com/api/health

# Get supported tokens
curl https://your-app-name.onrender.com/api/tokens

# Execute a swap (with your wallet details)
curl -X POST https://your-app-name.onrender.com/api/swap \
  -H "Content-Type: application/json" \
  -d '{
    "senderAddress": "0xYourAddress",
    "senderPrivateKey": "0xYourPrivateKey",
    "recipientAddress": "0xYourRecipientAddress",
    "originSymbol": "USDC",
    "originBlockchain": "BASE",
    "destinationSymbol": "ARB",
    "destinationBlockchain": "ARB",
    "amount": "1.0"
  }'
```

## 🔧 Configuration

### **Render.yaml (Auto-Deploy)**

The `render.yaml` file enables automatic deployments:

```yaml
services:
  - type: web
    name: near-intents-swap-api
    env: node
    buildCommand: pnpm install && pnpm build
    startCommand: pnpm start:server
    plan: starter
    healthCheckPath: /api/health
```

### **Production Features**

✅ **Rate Limiting**: 100 requests per 15 minutes per IP  
✅ **CORS Configuration**: Configurable origins  
✅ **Error Handling**: Comprehensive error responses  
✅ **Health Checks**: Built-in health monitoring  
✅ **Security**: No sensitive data in code  

## 🌐 Usage Examples

### **Frontend Integration**

```javascript
// React/Next.js example
const executeSwap = async (swapData) => {
  const response = await fetch('https://your-app.onrender.com/api/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(swapData)
  });
  
  const result = await response.json();
  return result;
};
```

### **Supported Swap Examples**

```bash
# Base USDC → Arbitrum ARB
curl -X POST https://your-app.onrender.com/api/swap \
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

# AVAX USDC → Base USDC
curl -X POST https://your-app.onrender.com/api/swap \
  -H "Content-Type: application/json" \
  -d '{
    "senderAddress": "0x...",
    "senderPrivateKey": "0x...",
    "recipientAddress": "0x...",
    "originSymbol": "USDC",
    "originBlockchain": "AVAX",
    "destinationSymbol": "USDC",
    "destinationBlockchain": "BASE",
    "amount": "0.8"
  }'
```

## 🔒 Security Best Practices

1. **Never commit private keys to version control**
2. **Use environment variables for all sensitive data**
3. **Implement additional authentication if needed**
4. **Monitor API usage and set appropriate rate limits**
5. **Use HTTPS only in production**
6. **Validate all inputs on the server side**

## 📊 Monitoring

- **Health Endpoint**: `/api/health`
- **Render Logs**: Available in Render dashboard
- **Error Tracking**: Built-in error responses
- **Performance**: Monitor response times

## 🆘 Troubleshooting

**Common Issues:**

1. **Build Failed**: Check package.json scripts
2. **Port Issues**: Render automatically sets PORT
3. **Environment Variables**: Verify all required vars are set
4. **CORS Errors**: Update allowed origins in production

**Logs Access:**
- Go to Render Dashboard → Your Service → Logs
- Real-time logs available during deployment and runtime

**Common Render Issues:**

1. **"pnpm install" command not found**
   - Solution: Use `npm install` instead of `pnpm install` in build command
   - Alternative: Add `npm install -g pnpm` before the build command

2. **"Service Root Directory missing"**
   - Solution: Ensure your repository is properly connected
   - Check that all files are committed and pushed to GitHub

3. **Build timeout**
   - Solution: Use npm instead of pnpm for faster builds
   - Alternative: Increase build timeout in Render dashboard

4. **Port issues**
   - Render automatically sets PORT environment variable
   - Your app should use `process.env.PORT` (already configured)

## 🎯 Next Steps

1. **Custom Domain**: Add your own domain in Render
2. **SSL Certificate**: Automatically provided by Render
3. **Scaling**: Upgrade to paid plans for better performance
4. **Monitoring**: Add services like DataDog or LogRocket
5. **Authentication**: Implement API keys or JWT tokens

---

**Your API is now ready for production use! 🚀**

All sensitive information has been secured and the API is deployment-ready.