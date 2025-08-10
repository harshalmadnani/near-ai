const WebSocket = require('ws');

// Test Hyperliquid WebSocket connection
async function testHyperliquidWebSocket() {
  console.log('🧪 Testing Hyperliquid WebSocket connection...');
  
  const ws = new WebSocket('wss://api.hyperliquid.xyz/ws');
  
  ws.on('open', function open() {
    console.log('✅ Connected to Hyperliquid WebSocket');
    
    // Send subscription message for SOL trades
    const subscriptionMessage = {
      method: 'subscribe',
      subscription: {
        type: 'trades',
        coin: 'SOL'
      }
    };
    
    console.log('📡 Subscribing to SOL trades...');
    ws.send(JSON.stringify(subscriptionMessage));
  });

  ws.on('message', function message(data) {
    try {
      const message = JSON.parse(data.toString());
      console.log('📨 Received message:', JSON.stringify(message, null, 2));
      
      if (message.channel === 'subscriptionResponse') {
        console.log('✅ Subscription confirmed!');
      } else if (message.channel === 'trades') {
        console.log('💰 Trade data received!');
        const trades = message.data;
        trades.forEach(trade => {
          console.log(`   ${trade.coin}: $${trade.px} (Size: ${trade.sz}, Side: ${trade.side})`);
        });
      }
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  });

  ws.on('error', function error(err) {
    console.error('❌ WebSocket error:', err.message);
  });

  ws.on('close', function close() {
    console.log('🔌 WebSocket connection closed');
  });

  // Test for 30 seconds then close
  setTimeout(() => {
    console.log('⏰ Test timeout - closing connection');
    ws.close();
  }, 30000);
}

// Test NEAR Intents API health
async function testNearIntentsAPI() {
  console.log('\n🧪 Testing NEAR Intents API...');
  
  try {
    const response = await fetch('https://near-api-4kbh.onrender.com/api/health');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ NEAR Intents API is healthy');
      console.log('   Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('⚠️ NEAR Intents API returned:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ NEAR Intents API error:', error.message);
  }
}

// Test our local API
async function testLocalAPI() {
  console.log('\n🧪 Testing local Trading Bot API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/health');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Local API is healthy');
      console.log('   Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('⚠️ Local API returned:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Local API error:', error.message);
    console.log('💡 Make sure the server is running with: npm start');
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Updated Trading Bot API Tests\n');
  
  await testLocalAPI();
  await testNearIntentsAPI();
  
  console.log('\n⏳ Starting Hyperliquid WebSocket test (will run for 30 seconds)...');
  testHyperliquidWebSocket();
}

runTests().catch(console.error);