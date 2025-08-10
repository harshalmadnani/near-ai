import { ApiError } from '@defuse-protocol/one-click-sdk-typescript';
import { getQuote } from './2-get-quote';
import { sendEVMTokens, TOKEN_ADDRESSES, RPC_URLS } from './3-send-evm-deposit';
import { pollStatusUntilSuccess } from './4-check-status';
import { displaySwapCostTable } from './utils';
import "dotenv/config";

/**
 *  Step 5: Full Swap Implementation
 *
 *  This combines steps 2, 3, and 4:
 *   1. Get a quote with deposit address
 *   2. Send deposit to the quote's deposit address
 *   3. Check the status of the swap
 * 
 *  NOTE: Configure this file independently of the other files in this directory
 */

// Example Swap Configuration - Base USDC to Arbitrum ARB
const isTest = false; // keep set to false for actual execution
const senderAddress = process.env.SENDER_ADDRESS || "0x0000000000000000000000000000000000000000";
const senderPrivateKey = process.env.SENDER_PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000"; 
const recipientAddress = process.env.RECIPIENT_ADDRESS || "0x0000000000000000000000000000000000000000"; // Token swap recipient address on Arbitrum
const originAsset = "nep141:base-0x833589fcd6edb6e08f4c7c32d4f71b54bda02913.omft.near" // Base USDC
const destinationAsset = "nep141:arb-0x912ce59144191c1204e64559fe8253a0e49e6548.omft.near" // Arbitrum ARB
const amount = "1000000"; // 1 USDC (6 decimals)
const tokenAddress = TOKEN_ADDRESSES.BASE.USDC; // USDC contract address on Base
const rpcUrl = RPC_URLS.BASE; // Base mainnet RPC


async function fullSwap() {
  try {
    console.log("Starting NEAR Intents full swap process w/ 1-Click API...\n");
    
    // Step 1: Get quote and extract deposit address
    console.log("Step 1: Getting quote...");
    console.log("--------------------------------");
    const quote = await getQuote(isTest, senderAddress, recipientAddress, originAsset, destinationAsset, amount);
    
    // Extract deposit address from quote response
    const depositAddress = quote.quote?.depositAddress;
    if (!depositAddress) {
      throw new Error("No deposit address found in quote response");
    }
    
    console.log(`💬 - Quote: ${quote.quote?.amountInFormatted} USDC → ${quote.quote?.amountOutFormatted} ARB`);
    console.log(`🎯 - Deposit address: ${depositAddress}`);
    
    // Display swap cost breakdown table
    displaySwapCostTable(quote);

    // Step 2: Send EVM deposit
    console.log("Step 2: Sending EVM deposit...");
    console.log("--------------------------------");
    
    // Convert amount to human readable format for EVM transaction (1 USDC)
    const depositAmount = "1"; // 1 USDC
    const depositResult = await sendEVMTokens(
      senderPrivateKey,
      depositAddress,
      tokenAddress,
      depositAmount,
      rpcUrl
    );
    console.log("✅ - EVM deposit sent successfully!");
    console.log(`🔍 - See transaction: https://basescan.org/tx/${depositResult.hash}\n\n`);
    
    // Step 3: Poll status until success
    console.log("Step 3: Monitoring swap status...");
    console.log("--------------------------------");
    console.log("⏳ Waiting 5 seconds before starting status checks...");
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const finalStatus = await pollStatusUntilSuccess(depositAddress);
    console.log("--------------------------------");
    console.log("✅ Full swap process completed! \n\n");
    console.log(`🔍 View full transaction on NEAR Intents Explorer: \n https://explorer.near-intents.org/transactions/${depositAddress} \n`);
    
    return { quote, depositAddress, depositResult, finalStatus };
    
  } catch (error) {
    console.error("❌ Full swap failed:", error as ApiError);
    throw error;
  }
}

fullSwap().catch(console.error);
