// Stellar Contract Client for No-Loss Auction
// This client handles transaction building and submission for auction operations

export const CONTRACT_CONFIG = {
  networkPassphrase: 'Test SDF Network ; May 28, 2015',
  rpcUrl: 'https://soroban-testnet.stellar.org',
  contractId: process.env.VITE_CONTRACT_ID || '',
};

// Auction data types
export interface Auction {
  id: number;
  title: string;
  token: string;
  minimumBid: number;
  deadline: number;
  highestBidder: string | null;
  highestBid: number;
  bidCount: number;
  status: 'Active' | 'Finalized' | 'Cancelled';
  creator: string;
}

export interface Bid {
  bidder: string;
  amount: number;
  timestamp: number;
}

// Stellar RPC client
export class StellarContractClient {
  private contractId: string;
  private rpcUrl: string;

  constructor(contractId: string = CONTRACT_CONFIG.contractId) {
    this.contractId = contractId;
    this.rpcUrl = CONTRACT_CONFIG.rpcUrl;
  }

  /**
   * Get account details from Stellar RPC
   */
  async getAccount(publicKey: string): Promise<any> {
    try {
      const response = await fetch(`${this.rpcUrl}/api/v1/accounts/${publicKey}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get account: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting account:', error);
      throw error;
    }
  }

  /**
   * Get latest ledger for transaction building
   */
  async getLatestLedger(): Promise<any> {
    try {
      const response = await fetch(`${this.rpcUrl}/api/v1/ledgers/latest`);
      
      if (!response.ok) {
        throw new Error(`Failed to get ledger: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting ledger:', error);
      throw error;
    }
  }

  /**
   * Simulate transaction to get resource costs
   */
  async simulateTransaction(xdr: string): Promise<any> {
    try {
      const response = await fetch(`${this.rpcUrl}/api/v1/transactions/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx: xdr,
        }),
      });

      if (!response.ok) {
        throw new Error(`Simulation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error simulating transaction:', error);
      throw error;
    }
  }

  /**
   * Submit signed transaction
   */
  async submitTransaction(signedXdr: string): Promise<any> {
    try {
      const response = await fetch(`${this.rpcUrl}/api/v1/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx: signedXdr,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Transaction submission failed: ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting transaction:', error);
      throw error;
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(hash: string): Promise<any> {
    try {
      const response = await fetch(`${this.rpcUrl}/api/v1/transactions/${hash}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get transaction status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw error;
    }
  }

  /**
   * Get events for an auction
   */
  async getEvents(filters: any): Promise<any> {
    try {
      const response = await fetch(`${this.rpcUrl}/api/v1/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error(`Failed to get events: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting events:', error);
      throw error;
    }
  }

  /**
   * Get contract info
   */
  async getContractInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.rpcUrl}/api/v1/contracts/${this.contractId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get contract info: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting contract info:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const stellarClient = new StellarContractClient();
