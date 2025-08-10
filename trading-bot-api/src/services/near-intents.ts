import axios from 'axios';
import { SwapRequest } from '../types';

export interface NearIntentsAPIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class NearIntentsService {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://near-api-4kbh.onrender.com') {
    this.baseUrl = baseUrl;
  }

  async executeSwap(swapRequest: SwapRequest): Promise<NearIntentsAPIResponse> {
    try {
      console.log('🔄 Executing swap via NEAR Intents API...');
      console.log(`   ${swapRequest.amount} ${swapRequest.originSymbol} (${swapRequest.originBlockchain}) → ${swapRequest.destinationSymbol} (${swapRequest.destinationBlockchain})`);

      const response = await axios.post(`${this.baseUrl}/api/swap`, swapRequest, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });

      if (response.data.success) {
        console.log('✅ Swap executed successfully');
        console.log(`   Transaction Hash: ${response.data.depositTxHash || 'N/A'}`);
        console.log(`   Final Status: ${response.data.finalStatus?.status || 'N/A'}`);
      } else {
        console.error('❌ Swap failed:', response.data.error);
      }

      return {
        success: response.data.success,
        data: response.data,
        error: response.data.error
      };

    } catch (error) {
      console.error('❌ NEAR Intents API error:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;
        return {
          success: false,
          error: `API Error: ${errorMessage}`
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getTokens(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tokens`);
      return response.data.tokens || response.data || [];
    } catch (error) {
      console.error('Error fetching tokens:', error);
      return [];
    }
  }

  async getTokensByBlockchain(blockchain: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tokens/${blockchain}`);
      return response.data.tokens || response.data || [];
    } catch (error) {
      console.error(`Error fetching tokens for ${blockchain}:`, error);
      return [];
    }
  }

  async getSupportedBlockchains(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/blockchains`);
      return response.data.blockchains || response.data || [];
    } catch (error) {
      console.error('Error fetching supported blockchains:', error);
      return [];
    }
  }

  async getTokenSymbols(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/symbols`);
      return response.data.symbols || response.data || [];
    } catch (error) {
      console.error('Error fetching token symbols:', error);
      return [];
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/health`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Helper method to validate swap request
  validateSwapRequest(swapRequest: SwapRequest): string[] {
    const errors: string[] = [];

    if (!swapRequest.senderAddress) {
      errors.push('Sender address is required');
    }

    if (!swapRequest.senderPrivateKey) {
      errors.push('Sender private key is required');
    }

    if (!swapRequest.recipientAddress) {
      errors.push('Recipient address is required');
    }

    if (!swapRequest.originSymbol) {
      errors.push('Origin token symbol is required');
    }

    if (!swapRequest.originBlockchain) {
      errors.push('Origin blockchain is required');
    }

    if (!swapRequest.destinationSymbol) {
      errors.push('Destination token symbol is required');
    }

    if (!swapRequest.destinationBlockchain) {
      errors.push('Destination blockchain is required');
    }

    if (!swapRequest.amount || isNaN(parseFloat(swapRequest.amount)) || parseFloat(swapRequest.amount) <= 0) {
      errors.push('Valid amount is required');
    }

    return errors;
  }

  // Method to estimate swap output (if API supports it)
  async getSwapQuote(
    originSymbol: string,
    originBlockchain: string,
    destinationSymbol: string,
    destinationBlockchain: string,
    amount: string
  ): Promise<any> {
    try {
      // This would depend on if the NEAR Intents API has a quote endpoint
      // For now, we'll return a placeholder
      console.log(`💭 Getting quote for ${amount} ${originSymbol} → ${destinationSymbol}`);
      
      // If the API had a quote endpoint, it would be something like:
      // const response = await axios.post(`${this.baseUrl}/api/quote`, {
      //   originSymbol,
      //   originBlockchain,
      //   destinationSymbol,
      //   destinationBlockchain,
      //   amount
      // });
      
      return {
        estimatedOutput: 'Quote endpoint not available',
        exchangeRate: 'N/A',
        fees: 'N/A'
      };
    } catch (error) {
      console.error('Error getting swap quote:', error);
      return null;
    }
  }

  // Method to check swap status by transaction hash
  async getSwapStatus(txHash: string): Promise<any> {
    try {
      // This would depend on if the NEAR Intents API has a status endpoint
      console.log(`🔍 Checking status for transaction: ${txHash}`);
      
      // Placeholder implementation
      return {
        status: 'pending',
        txHash,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error checking swap status:', error);
      return null;
    }
  }
}