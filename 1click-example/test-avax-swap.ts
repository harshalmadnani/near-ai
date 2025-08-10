import { executeSwap, SwapRequest } from './swap-api';

/**
 * Test AVAX swap to see what happens
 */

async function testAvaxSwap() {
  console.log('🧪 Testing BASE USDC → AVAX swap...\n');

  const swapRequest: SwapRequest = {
    senderAddress: process.env.TEST_SENDER_ADDRESS || "0x0000000000000000000000000000000000000000",
    senderPrivateKey: process.env.TEST_PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000",
    recipientAddress: process.env.TEST_RECIPIENT_ADDRESS || "0x0000000000000000000000000000000000000000",
    originSymbol: "USDC",
    originBlockchain: "BASE",
    destinationSymbol: "AVAX", // Try with AVAX token
    destinationBlockchain: "AVAX",
    amount: "1.0",
    isTest: false // Use live mode - test mode doesn't provide deposit addresses
  };

  console.log('Request parameters:');
  console.log(JSON.stringify(swapRequest, null, 2));
  console.log('\n');

  try {
    const result = await executeSwap(swapRequest);
    console.log('✅ Swap result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Swap failed:', error);
  }
}

// Also test USDC to USDC
async function testUsdcToUsdcSwap() {
  console.log('\n🧪 Testing BASE USDC → AVAX USDC swap...\n');

  const swapRequest: SwapRequest = {
    senderAddress: process.env.TEST_SENDER_ADDRESS || "0x0000000000000000000000000000000000000000",
    senderPrivateKey: process.env.TEST_PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000",
    recipientAddress: process.env.TEST_RECIPIENT_ADDRESS || "0x0000000000000000000000000000000000000000",
    originSymbol: "USDC",
    originBlockchain: "BASE",
    destinationSymbol: "USDC", // USDC to USDC
    destinationBlockchain: "AVAX",
    amount: "1.0",
    isTest: false // Use live mode - test mode doesn't provide deposit addresses
  };

  console.log('Request parameters:');
  console.log(JSON.stringify(swapRequest, null, 2));
  console.log('\n');

  try {
    const result = await executeSwap(swapRequest);
    console.log('✅ Swap result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Swap failed:', error);
  }
}

async function main() {
  await testAvaxSwap();
  await testUsdcToUsdcSwap();
}

main().catch(console.error);