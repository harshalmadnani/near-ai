import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { executeSwap, validateSwapRequest, SwapRequest, SwapResponse } from './swap-api';
import { getAllBlockchains, getAllSymbols, getTokensByBlockchain, TOKENS_SUMMARY } from './tokens-database';

/**
 * Express.js REST API Server for Cross-Chain Token Swaps
 * 
 * Endpoints:
 * - POST /api/swap - Execute a token swap
 * - GET /api/tokens - Get supported tokens info
 * - GET /api/blockchains - Get supported blockchains
 * - GET /api/health - Health check
 */

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors({
  origin: NODE_ENV === 'production' ? 
    ['https://your-domain.com', 'https://your-frontend.vercel.app'] : 
    true, // Allow all origins in development
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Security middleware for production
if (NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  
  // Basic rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      error: 'Too many requests, please try again later',
      retryAfter: '15 minutes'
    }
  });
  app.use('/api/', limiter);
}

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * POST /api/swap
 * Execute a cross-chain token swap
 */
app.post('/api/swap', async (req, res) => {
  try {
    const swapRequest: SwapRequest = req.body;

    // Validate request
    const validationErrors = validateSwapRequest(swapRequest);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      });
    }

    console.log(`\n🔄 New swap request: ${swapRequest.amount} ${swapRequest.originSymbol} → ${swapRequest.destinationSymbol}`);

    // Execute swap
    const result: SwapResponse = await executeSwap(swapRequest);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }

  } catch (error) {
    console.error('Swap API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/tokens
 * Get information about supported tokens
 */
app.get('/api/tokens', (req, res) => {
  const { blockchain, symbol } = req.query;

  try {
    let tokens;

    if (blockchain) {
      tokens = getTokensByBlockchain(blockchain as string);
    } else {
      tokens = TOKENS_SUMMARY;
    }

    res.json({
      success: true,
      data: tokens,
      summary: TOKENS_SUMMARY
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tokens',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/tokens/:blockchain
 * Get tokens for a specific blockchain
 */
app.get('/api/tokens/:blockchain', (req, res) => {
  try {
    const { blockchain } = req.params;
    const tokens = getTokensByBlockchain(blockchain);

    res.json({
      success: true,
      blockchain: blockchain.toUpperCase(),
      tokenCount: tokens.length,
      tokens
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blockchain tokens',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/blockchains
 * Get list of supported blockchains
 */
app.get('/api/blockchains', (req, res) => {
  try {
    const blockchains = getAllBlockchains();
    
    res.json({
      success: true,
      totalBlockchains: blockchains.length,
      blockchains
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blockchains',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/symbols
 * Get list of all supported token symbols
 */
app.get('/api/symbols', (req, res) => {
  try {
    const symbols = getAllSymbols();
    
    res.json({
      success: true,
      totalSymbols: symbols.length,
      symbols
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch symbols',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

/**
 * GET /
 * API documentation
 */
app.get('/', (req, res) => {
  res.json({
    name: 'NEAR Intents Cross-Chain Swap API',
    version: '1.0.0',
    description: 'REST API for executing cross-chain token swaps using NEAR Intents and 1-Click API',
    endpoints: {
      'POST /api/swap': 'Execute a token swap',
      'GET /api/tokens': 'Get supported tokens',
      'GET /api/tokens/:blockchain': 'Get tokens for specific blockchain',
      'GET /api/blockchains': 'Get supported blockchains',
      'GET /api/symbols': 'Get supported token symbols',
      'GET /api/health': 'Health check'
    },
    example: {
      'swap_request': {
        senderAddress: '0xYourWalletAddress',
        senderPrivateKey: '0xYourPrivateKey',
        recipientAddress: '0xYourRecipientAddress',
        originSymbol: 'USDC',
        originBlockchain: 'BASE',
        destinationSymbol: 'ARB',
        destinationBlockchain: 'ARB',
        amount: '1.0',
        isTest: false
      }
    },
    security: {
      note: 'This API does not store any private keys or sensitive information.',
      recommendation: 'Always use HTTPS and never expose private keys in client-side code.',
      environment: NODE_ENV
    },
    supportedChains: getAllBlockchains(),
    totalTokens: TOKENS_SUMMARY.totalTokens
  });
});

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: error.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    availableEndpoints: [
      'POST /api/swap',
      'GET /api/tokens',
      'GET /api/tokens/:blockchain',
      'GET /api/blockchains',
      'GET /api/symbols',
      'GET /api/health'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 NEAR Intents Swap API Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🪙  Supported Tokens: http://localhost:${PORT}/api/tokens`);
  console.log(`\n📊 Database Summary:`);
  console.log(`   Total Tokens: ${TOKENS_SUMMARY.totalTokens}`);
  console.log(`   Blockchains: ${TOKENS_SUMMARY.totalBlockchains}`);
  console.log(`   Unique Symbols: ${TOKENS_SUMMARY.uniqueSymbols}`);
  console.log(`\n💡 Example swap request:`);
  console.log(`   curl -X POST http://localhost:${PORT}/api/swap \\`);
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -d '{`);
  console.log(`       "senderAddress": "0x...",`);
  console.log(`       "senderPrivateKey": "0x...",`);
  console.log(`       "recipientAddress": "0x...",`);
  console.log(`       "originSymbol": "USDC",`);
  console.log(`       "originBlockchain": "BASE",`);
  console.log(`       "destinationSymbol": "ARB",`);
  console.log(`       "destinationBlockchain": "ARB",`);
  console.log(`       "amount": "1.0"`);
  console.log(`     }'`);
  console.log(`\n🔗 Ready to process cross-chain swaps!\n`);
});

export default app;