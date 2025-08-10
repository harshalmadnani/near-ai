import { ApiError } from '@defuse-protocol/one-click-sdk-typescript';
import { getQuote } from './2-get-quote';
import { sendEVMTokens, TOKEN_ADDRESSES, RPC_URLS } from './3-send-evm-deposit';
import { pollStatusUntilSuccess } from './4-check-status';
import { displaySwapCostTable } from './utils';
import { findTokenBySymbol, Token, TOKENS_DATABASE } from './tokens-database';

/**
 * Swap API - Simplified interface for cross-chain token swaps
 * 
 * Accepts human-readable parameters and handles all the complexity internally:
 * - Symbol-based token selection
 * - Automatic decimal adjustment
 * - Multi-chain support
 */

export interface SwapRequest {
  senderAddress: string;
  senderPrivateKey: string;
  recipientAddress: string;
  originSymbol: string;        // e.g., "USDC"
  originBlockchain: string;    // e.g., "BASE"
  destinationSymbol: string;   // e.g., "ARB"
  destinationBlockchain: string; // e.g., "ARB"
  amount: string;              // Human readable amount (e.g., "1.5" for 1.5 USDC)
  isTest?: boolean;            // Optional, defaults to false (always use false for real swaps)
}

export interface SwapResponse {
  success: boolean;
  quote?: any;
  depositAddress?: string;
  depositTxHash?: string;
  finalStatus?: any;
  error?: string;
  details?: {
    originToken: Token;
    destinationToken: Token;
    adjustedAmount: string;
    tokenContractAddress: string;
    rpcUrl: string;
  };
}

// RPC URL mapping for different blockchains
const BLOCKCHAIN_RPC_URLS: { [key: string]: string } = {
  'BASE': 'https://mainnet.base.org',
  'ARB': 'https://arb1.arbitrum.io/rpc',
  'ETH': 'https://cloudflare-eth.com',
  'OP': 'https://mainnet.optimism.io',
  'POL': 'https://polygon-rpc.com',
  'BSC': 'https://bsc-dataseed.binance.org',
  'AVAX': 'https://api.avax.network/ext/bc/C/rpc',
  'GNOSIS': 'https://rpc.gnosischain.com'
};

// Contract address mapping for all supported EVM tokens
// Using official Circle USDC addresses and verified contract addresses
const EVM_TOKEN_CONTRACTS: { [blockchain: string]: { [symbol: string]: string } } = {
  'BASE': {
    'USDC': '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Official Circle USDC
    'ETH': '0x0000000000000000000000000000000000000000', // Native ETH
    'cbBTC': '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf', // Coinbase Wrapped BTC
    'BRETT': '0x532f27101965dd16442e59d40670faf5ebb142e4', // BRETT token
    'FMS': '0xa5c67d8d37b88c2d88647814da5578128e2c93b2', // FMS token
    'KAITO': '0x98d0baa52b2d063e780de12f615f963fe8537553', // KAITO token
    'SWEAT': '0x227d920e20ebac8a40e7d6431b7d724bb64d7245' // SWEAT token
  },
  'ARB': {
    'USDC': '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // Official Circle USDC (native)
    'ARB': '0x912ce59144191c1204e64559fe8253a0e49e6548', // ARB token
    'ETH': '0x0000000000000000000000000000000000000000', // Native ETH
    'USDT': '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // Tether USD
    'GMX': '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a', // GMX token
    'SWEAT': '0xca7dec8550f43a5e46e3dfb95801f64280e75b27' // SWEAT token
  },
  'ETH': {
    'USDC': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Official Circle USDC
    'ETH': '0x0000000000000000000000000000000000000000', // Native ETH
    'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7', // Tether USD
    'LINK': '0x514910771AF9Ca656af840dff83E8264EcF986CA', // Chainlink
    'AAVE': '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', // AAVE token
    'AURORA': '0xAaaaAaAAaAAaAaAAaAaaaaAAaaAaaaaAaAAaAaAA', // Aurora token
    'cbBTC': '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf', // Coinbase Wrapped BTC
    'DAI': '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI stablecoin
    'HAPI': '0xD9c2D319CD7e6177336b0a9c93c21cb48d84fb54', // HAPI token
    'KNC': '0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202', // Kyber Network
    'MOG': '0xaaeE1A9723aaDB7afA2810263653A34bA2C21C7a', // MOG token
    'PEPE': '0x6982508145454Ce325dDbE47a25d4ec3d2311933', // PEPE token
    'SHIB': '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', // Shiba Inu
    'SWEAT': '0xb4b9dc1c77bdbb135ea907fd5a08094d98883a35', // SWEAT token
    'TURBO': '0xA35923162C49cF95e6BF26623385eb431ad920d3', // TURBO token
    'UNI': '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // Uniswap
    'USD1': '0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d', // USD1 token
    'USDf': '0xfa2b947eec368f42195f24f36d2af29f7c24cec2' // USDf token
  },
  'AVAX': {
    'AVAX': '0x0000000000000000000000000000000000000000', // Native AVAX
    'USDC': '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', // Official Circle USDC
    'USDT': '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7' // Tether USD
  },
  'OP': {
    'ETH': '0x0000000000000000000000000000000000000000', // Native ETH
    'OP': '0x4200000000000000000000000000000000000042', // Optimism token
    'USDC': '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // Official Circle USDC (native)
    'USDT': '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58' // Tether USD
  },
  'POL': {
    'POL': '0x0000000000000000000000000000000000000000', // Native POL (formerly MATIC)
    'USDC': '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // Official Circle USDC (native)
    'USDT': '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' // Tether USD
  },
  'BSC': {
    'BNB': '0x0000000000000000000000000000000000000000', // Native BNB
    'USDC': '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // USDC on BSC
    'USDT': '0x55d398326f99059fF775485246999027B3197955', // Tether USD
    'SWEAT': '0x250b211EE44459dAd5Cd3bCa803dD6a7EcB5d46C', // SWEAT token
    'RHEA': '0x4bE7e38a3c6d8E1E7DFe4E3afFF6f97e40C1a48F' // RHEA token (estimated)
  },
  'GNOSIS': {
    'xDAI': '0x0000000000000000000000000000000000000000', // Native xDAI
    'USDC': '0x2a22f9c3b484c3629090feed35f17ff8f88f76f0', // USDC on Gnosis
    'WETH': '0x6A023CCd1ff6F2045C3309768ead9E68F978f6e1', // Wrapped ETH
    'GNO': '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb', // Gnosis token
    'COW': '0x177127622c4A00F3d409B75571e12cB3c8973d3c', // CoW Protocol
    'SAFE': '0x4d18815d14fe5c3304e87b3fa18318baa5c23820' // Safe token
  }
};

/**
 * Converts human-readable amount to smallest unit based on token decimals
 */
function adjustAmountForDecimals(amount: string, decimals: number): string {
  const humanAmount = parseFloat(amount);
  const adjustedAmount = humanAmount * Math.pow(10, decimals);
  return Math.floor(adjustedAmount).toString();
}

/**
 * Gets the contract address for a token on a specific blockchain
 */
function getTokenContractAddress(symbol: string, blockchain: string): string | null {
  const blockchainContracts = EVM_TOKEN_CONTRACTS[blockchain.toUpperCase()];
  if (!blockchainContracts) return null;
  
  return blockchainContracts[symbol.toUpperCase()] || null;
}

/**
 * Validates if the blockchain supports EVM transactions
 */
function isEVMBlockchain(blockchain: string): boolean {
  const evmChains = ['BASE', 'ARB', 'ETH', 'OP', 'POL', 'BSC', 'AVAX'];
  return evmChains.includes(blockchain.toUpperCase());
}

/**
 * Main swap function that handles the entire process
 */
export async function executeSwap(request: SwapRequest): Promise<SwapResponse> {
  try {
    const {
      senderAddress,
      senderPrivateKey,
      recipientAddress,
      originSymbol,
      originBlockchain,
      destinationSymbol,
      destinationBlockchain,
      amount,
      isTest = false // Always use false for real swaps - test mode doesn't provide deposit addresses
    } = request;

    console.log(`🚀 Starting swap: ${amount} ${originSymbol} (${originBlockchain}) → ${destinationSymbol} (${destinationBlockchain})`);
    console.log(`   Mode: ${isTest ? 'TEST (no actual execution)' : 'LIVE (real swap)'}`);

    // Step 1: Find tokens by symbol and blockchain
    const originTokens = findTokenBySymbol(originSymbol, originBlockchain);
    const destinationTokens = findTokenBySymbol(destinationSymbol, destinationBlockchain);

    if (originTokens.length === 0) {
      throw new Error(`Origin token ${originSymbol} not found on ${originBlockchain} blockchain`);
    }

    if (destinationTokens.length === 0) {
      throw new Error(`Destination token ${destinationSymbol} not found on ${destinationBlockchain} blockchain`);
    }

    const originToken = originTokens[0];
    const destinationToken = destinationTokens[0];

    console.log(`✅ Found tokens:`);
    console.log(`   Origin: ${originToken.symbol} (${originToken.blockchain}) - ${originToken.assetId}`);
    console.log(`   Destination: ${destinationToken.symbol} (${destinationToken.blockchain}) - ${destinationToken.assetId}`);

    // Step 2: Adjust amount based on token decimals
    const adjustedAmount = adjustAmountForDecimals(amount, originToken.decimals);
    console.log(`💰 Amount adjustment: ${amount} ${originToken.symbol} = ${adjustedAmount} smallest units (${originToken.decimals} decimals)`);

    // Step 3: Get quote
    console.log(`\n📊 Getting quote...`);
    console.log(`   Origin Asset: ${originToken.assetId}`);
    console.log(`   Destination Asset: ${destinationToken.assetId}`);
    
    const quote = await getQuote(
      isTest,
      senderAddress,
      recipientAddress,
      originToken.assetId,
      destinationToken.assetId,
      adjustedAmount
    );

    console.log(`   Quote response:`, JSON.stringify(quote, null, 2));

    const depositAddress = quote.quote?.depositAddress;
    if (!depositAddress) {
      console.error(`❌ No deposit address in quote response. This may indicate:`);
      console.error(`   - The token pair is not supported`);
      console.error(`   - The asset format (${destinationToken.assetId.startsWith('nep245:') ? 'nep245' : 'nep141'}) requires different handling`);
      console.error(`   - The amount is too low or too high`);
      console.error(`   - The destination blockchain doesn't support this swap type`);
      throw new Error(`No deposit address found in quote response. Asset IDs: ${originToken.assetId} -> ${destinationToken.assetId}`);
    }

    console.log(`💬 Quote: ${quote.quote?.amountInFormatted} ${originToken.symbol} → ${quote.quote?.amountOutFormatted} ${destinationToken.symbol}`);
    console.log(`🎯 Deposit address: ${depositAddress}`);

    // Display cost breakdown
    displaySwapCostTable(quote);

    // Step 4: Handle deposit based on blockchain type
    let depositTxHash: string;
    let tokenContractAddress: string | null = null;
    let rpcUrl: string | null = null;

    if (isEVMBlockchain(originBlockchain)) {
      // EVM-based deposit
      console.log(`\n💸 Sending EVM deposit on ${originBlockchain}...`);
      
      tokenContractAddress = getTokenContractAddress(originSymbol, originBlockchain);
      rpcUrl = BLOCKCHAIN_RPC_URLS[originBlockchain.toUpperCase()];

      if (!rpcUrl) {
        throw new Error(`RPC URL not configured for blockchain: ${originBlockchain}`);
      }

      const depositResult = await sendEVMTokens(
        senderPrivateKey,
        depositAddress,
        tokenContractAddress || "0x0000000000000000000000000000000000000000", // Use zero address for native tokens
        amount, // Use human-readable amount for EVM function (it handles decimals internally)
        rpcUrl
      );

      depositTxHash = depositResult.hash;
      
      // Get blockchain explorer URL
      const explorerUrls: { [key: string]: string } = {
        'BASE': 'https://basescan.org/tx/',
        'ARB': 'https://arbiscan.io/tx/',
        'ETH': 'https://etherscan.io/tx/',
        'OP': 'https://optimistic.etherscan.io/tx/',
        'POL': 'https://polygonscan.com/tx/'
      };
      
      const explorerUrl = explorerUrls[originBlockchain.toUpperCase()] || '';
      console.log(`✅ EVM deposit sent successfully!`);
      console.log(`🔍 See transaction: ${explorerUrl}${depositTxHash}\n`);
      
    } else {
      throw new Error(`Blockchain ${originBlockchain} not supported for deposits yet. Currently only EVM chains are supported.`);
    }

    // Step 5: Monitor swap status
    console.log(`\n⏳ Monitoring swap status...`);
    console.log("Waiting 5 seconds before starting status checks...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    const finalStatus = await pollStatusUntilSuccess(depositAddress);
    
    console.log(`\n🎉 Swap completed successfully!`);
    console.log(`🔍 View on NEAR Intents Explorer: https://explorer.near-intents.org/transactions/${depositAddress}\n`);

    return {
      success: true,
      quote,
      depositAddress,
      depositTxHash,
      finalStatus,
      details: {
        originToken,
        destinationToken,
        adjustedAmount,
        tokenContractAddress: tokenContractAddress || '',
        rpcUrl: rpcUrl || ''
      }
    };

  } catch (error) {
    console.error("❌ Swap failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Validates swap request parameters
 */
export function validateSwapRequest(request: SwapRequest): string[] {
  const errors: string[] = [];

  if (!request.senderAddress || !request.senderAddress.startsWith('0x')) {
    errors.push('Invalid sender address');
  }

  if (!request.senderPrivateKey || !request.senderPrivateKey.startsWith('0x')) {
    errors.push('Invalid sender private key');
  }

  if (!request.recipientAddress) {
    errors.push('Recipient address is required');
  }

  if (!request.originSymbol) {
    errors.push('Origin token symbol is required');
  }

  if (!request.originBlockchain) {
    errors.push('Origin blockchain is required');
  }

  if (!request.destinationSymbol) {
    errors.push('Destination token symbol is required');
  }

  if (!request.destinationBlockchain) {
    errors.push('Destination blockchain is required');
  }

  if (!request.amount || isNaN(parseFloat(request.amount)) || parseFloat(request.amount) <= 0) {
    errors.push('Invalid amount');
  }

  return errors;
}

// Example usage function - DO NOT USE IN PRODUCTION
export async function exampleSwap() {
  // This is just an example - never hardcode real addresses or private keys
  const swapRequest: SwapRequest = {
    senderAddress: process.env.EXAMPLE_SENDER_ADDRESS || "0x0000000000000000000000000000000000000000",
    senderPrivateKey: process.env.EXAMPLE_PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000",
    recipientAddress: process.env.EXAMPLE_RECIPIENT_ADDRESS || "0x0000000000000000000000000000000000000000",
    originSymbol: "USDC",
    originBlockchain: "BASE",
    destinationSymbol: "ARB",
    destinationBlockchain: "ARB",
    amount: "1.0", // 1 USDC
    isTest: false
  };

  console.log("⚠️  Example swap - not executing with placeholder addresses");
  return { success: false, error: "Example only - provide real addresses via environment variables" };
}

// Only run example if this file is executed directly AND env vars are set
if (require.main === module && process.env.EXAMPLE_SENDER_ADDRESS) {
  exampleSwap().catch(console.error);
}