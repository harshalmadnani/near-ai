import { ethers } from 'ethers';

/**
 *  Step 3: Send EVM Token Deposit
 *
 *  This process sends ERC-20 tokens or ETH to the `depositAddress` on EVM chains
 *  For EVM to EVM swaps, you need to send tokens from the origin EVM chain, not NEAR
 * 
 */

// ERC-20 Token ABI (just the functions we need)
const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

export async function sendEVMTokens(
  senderPrivateKey: string,
  depositAddress: string,
  tokenAddress: string, // Contract address of the token (use null for ETH)
  amount: string,
  rpcUrl: string = "https://mainnet.base.org" // Default to Base mainnet
) {
  try {
    // Create provider and wallet
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(senderPrivateKey, provider);
    
    let txResponse;
    
    if (tokenAddress === null || tokenAddress === "0x0000000000000000000000000000000000000000") {
      // Send native ETH
      txResponse = await wallet.sendTransaction({
        to: depositAddress,
        value: ethers.parseEther(amount)
      });
    } else {
      // Send ERC-20 token
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
      
      // Get token decimals
      const decimals = await tokenContract.decimals();
      const tokenAmount = ethers.parseUnits(amount, decimals);
      
      // Send the token
      txResponse = await tokenContract.transfer(depositAddress, tokenAmount);
    }
    
    console.log(`Transaction sent: ${txResponse.hash}`);
    
    // Wait for confirmation
    const receipt = await txResponse.wait();
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
    
    return {
      hash: txResponse.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
    
  } catch (error) {
    console.error('Error sending EVM tokens:', error);
    throw error;
  }
}

// Helper function to get common token addresses
export const TOKEN_ADDRESSES = {
  BASE: {
    USDC: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    ETH: null // Native ETH
  },
  ARBITRUM: {
    ARB: "0x912ce59144191c1204e64559fe8253a0e49e6548",
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    ETH: null // Native ETH
  }
};

// Helper function to get RPC URLs
export const RPC_URLS = {
  BASE: "https://mainnet.base.org",
  ARBITRUM: "https://arb1.arbitrum.io/rpc",
  ETHEREUM: "https://cloudflare-eth.com"
};