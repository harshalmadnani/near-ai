const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory storage for bots
let bots = [];
let executionLogs = [];

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    },
    message: 'Trading Bot API is running'
  });
});

// API info
app.get('/api/info', (req, res) => {
  const activeBots = bots.filter(bot => bot.isActive);
  
  res.json({
    success: true,
    data: {
      name: 'AI Trading Bot API',
      version: '1.0.0',
      description: 'AI-powered trading bot platform using OpenAI o3-mini and NEAR Intents',
      endpoints: {
        'POST /api/bots': 'Create a new trading bot',
        'GET /api/bots': 'Get all bots',
        'GET /api/bots/:botId': 'Get specific bot',
        'POST /api/bots/:botId/activate': 'Activate a bot',
        'POST /api/bots/:botId/deactivate': 'Deactivate a bot',
        'DELETE /api/bots/:botId': 'Delete a bot',
        'GET /api/bots/:botId/logs': 'Get bot execution logs',
        'GET /api/bots/status/active': 'Get active bots',
        'GET /api/health': 'Health check',
        'GET /api/info': 'API information'
      },
      statistics: {
        totalBots: bots.length,
        activeBots: activeBots.length,
        inactiveBots: bots.length - activeBots.length
      }
    }
  });
});

// Create bot
app.post('/api/bots', async (req, res) => {
  try {
    console.log('🤖 Creating bot with config:', JSON.stringify(req.body, null, 2));
    
    const { name, prompt, swapConfig } = req.body;
    
    if (!name || !swapConfig) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name and swapConfig'
      });
    }

    // Test the swap configuration by calling NEAR Intents
    const https = require('https');
    
    const testSwap = () => {
      return new Promise((resolve, reject) => {
        const data = JSON.stringify(swapConfig);
        
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
          }
        };

        const req = https.request('https://near-api-4kbh.onrender.com/api/swap', options, (res) => {
          let body = '';
          res.on('data', (chunk) => body += chunk);
          res.on('end', () => {
            try {
              const response = JSON.parse(body);
              resolve(response);
            } catch (error) {
              reject(new Error(`Parse Error: ${error.message}`));
            }
          });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
      });
    };

    // Test the swap (skip validation for test bots)
    let swapResult;
    if (swapConfig.isTest) {
      console.log('⚠️ Test mode: Skipping swap validation');
      swapResult = { 
        success: true, 
        message: 'Test mode - validation skipped',
        quote: { quote: { amountOutFormatted: 'Test Amount' } }
      };
    } else {
      swapResult = await testSwap();
    }
    
    if (swapResult.success) {
      // Create bot entry
      const bot = {
        id: `bot-${Date.now()}`,
        name,
        prompt: prompt || 'No prompt provided',
        swapConfig,
        isActive: false, // Start as inactive
        createdAt: new Date().toISOString(),
        testResult: swapResult,
        deployedAt: null,
        activatedAt: null
      };

      bots.push(bot);

      console.log(`✅ Bot "${name}" created successfully!`);
      console.log(`   📊 Test swap result: ${swapResult.quote?.quote?.amountOutFormatted || 'N/A'}`);
      console.log(`   🆔 Bot ID: ${bot.id}`);

      res.status(201).json({
        success: true,
        data: bot,
        message: `Bot "${name}" created successfully`
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Swap configuration test failed',
        details: swapResult.error || swapResult
      });
    }

  } catch (error) {
    console.error('❌ Error creating bot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create bot',
      details: error.message
    });
  }
});

// Get all bots
app.get('/api/bots', (req, res) => {
  res.json({
    success: true,
    data: bots
  });
});

// Get specific bot
app.get('/api/bots/:botId', (req, res) => {
  const { botId } = req.params;
  const bot = bots.find(b => b.id === botId);
  
  if (!bot) {
    return res.status(404).json({
      success: false,
      error: 'Bot not found'
    });
  }
  
  res.json({
    success: true,
    data: bot
  });
});

// Activate bot
app.post('/api/bots/:botId/activate', (req, res) => {
  const { botId } = req.params;
  const bot = bots.find(b => b.id === botId);
  
  if (!bot) {
    return res.status(404).json({
      success: false,
      error: 'Bot not found'
    });
  }
  
  bot.isActive = true;
  bot.activatedAt = new Date().toISOString();
  
  // Log activation
  const logEntry = {
    botId: bot.id,
    action: 'activated',
    timestamp: new Date().toISOString(),
    message: `Bot "${bot.name}" activated`
  };
  executionLogs.push(logEntry);
  
  console.log(`🚀 Bot activated: ${bot.name} (${bot.id})`);
  
  res.json({
    success: true,
    data: bot,
    message: 'Bot activated successfully'
  });
});

// Deactivate bot
app.post('/api/bots/:botId/deactivate', (req, res) => {
  const { botId } = req.params;
  const bot = bots.find(b => b.id === botId);
  
  if (!bot) {
    return res.status(404).json({
      success: false,
      error: 'Bot not found'
    });
  }
  
  bot.isActive = false;
  bot.deactivatedAt = new Date().toISOString();
  
  // Log deactivation
  const logEntry = {
    botId: bot.id,
    action: 'deactivated',
    timestamp: new Date().toISOString(),
    message: `Bot "${bot.name}" deactivated`
  };
  executionLogs.push(logEntry);
  
  console.log(`⏹️ Bot deactivated: ${bot.name} (${bot.id})`);
  
  res.json({
    success: true,
    data: bot,
    message: 'Bot deactivated successfully'
  });
});

// Delete bot
app.delete('/api/bots/:botId', (req, res) => {
  const { botId } = req.params;
  const botIndex = bots.findIndex(b => b.id === botId);
  
  if (botIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Bot not found'
    });
  }
  
  const deletedBot = bots.splice(botIndex, 1)[0];
  
  // Log deletion
  const logEntry = {
    botId: deletedBot.id,
    action: 'deleted',
    timestamp: new Date().toISOString(),
    message: `Bot "${deletedBot.name}" deleted`
  };
  executionLogs.push(logEntry);
  
  console.log(`🗑️ Bot deleted: ${deletedBot.name} (${deletedBot.id})`);
  
  res.json({
    success: true,
    message: 'Bot deleted successfully'
  });
});

// Get bot logs
app.get('/api/bots/:botId/logs', (req, res) => {
  const { botId } = req.params;
  const botLogs = executionLogs.filter(log => log.botId === botId);
  
  res.json({
    success: true,
    data: botLogs
  });
});

// Get active bots
app.get('/api/bots/status/active', (req, res) => {
  const activeBots = bots.filter(bot => bot.isActive);
  
  res.json({
    success: true,
    data: activeBots,
    message: `${activeBots.length} active bots`
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Enhanced Trading Bot API Server started on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📖 API info: http://localhost:${PORT}/api/info`);
  console.log(`🤖 Create bot: POST http://localhost:${PORT}/api/bots`);
  console.log(`🔧 Full bot management features available!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('🔌 Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.emit('SIGTERM');
});

module.exports = app;
