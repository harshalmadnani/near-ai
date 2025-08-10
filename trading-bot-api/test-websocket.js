const WebSocket = require('ws');

// Test Mobula WebSocket connection
async function testMobulaWebSocket() {
  console.log('🧪 Testing Mobula WebSocket connection...');
  
  const ws = new WebSocket('wss://api.mobula.io');
  
  ws.on('open', function open() {
    console.log('✅ Connected to Mobula WebSocket');
    
    // Send subscription message
    const subscriptionMessage = {
      type: 'market',
      authorization: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99', // Using token ID as API key for test
      payload: {
        assets: [
          {
            name: 'TestToken',
            address: 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'
          }
        ],
        interval: 15,
        subscriptionTracking: 'true'
      }
    };
    
    console.log('📡 Sending subscription message...');
    ws.send(JSON.stringify(subscriptionMessage));
  });

  ws.on('message', function message(data) {
    try {
      const message = JSON.parse(data.toString());
      console.log('📨 Received message:', JSON.stringify(message, null, 2));
      
      if (Array.isArray(message)) {
        console.log('💰 Price data received!');
        message.forEach(priceData => {
          if (priceData.price) {
            console.log(`   ${priceData.baseSymbol}/${priceData.quoteSymbol}: $${priceData.price}`);
          }
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
  console.log('🚀 Starting Trading Bot API Tests\n');
  
  await testLocalAPI();
  await testNearIntentsAPI();
  
  console.log('\n⏳ Starting WebSocket test (will run for 30 seconds)...');
  testMobulaWebSocket();
}

runTests().catch(console.error);