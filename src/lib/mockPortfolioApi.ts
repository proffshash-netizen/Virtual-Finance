export type InstrumentType = 
  | "FD" | "RD" | "PPF" | "bond" 
  | "mutual_fund" | "gold" | "real_estate" 
  | "stock" | "crypto" | "startup";

export type TierType = "foundation" | "growth" | "sandbox";

export interface Instrument {
  id: string;
  name: string;
  type: InstrumentType;
  amountInvested: number;
  currentValue: number;
  interestRate?: number; // Foundation
  riskLevel?: "low" | "medium" | "high"; // Growth
  volatility?: "high" | "extreme"; // Sandbox
}

export interface PortfolioData {
  tiers: {
    foundation: { instruments: Instrument[] };
    growth: { instruments: Instrument[] };
    sandbox: { instruments: Instrument[] };
  };
  totalNetWorth: number;
}

// Initial mock data state
let mockPortfolioData: PortfolioData = {
  tiers: {
    foundation: {
      instruments: [
        { id: "inst_fd_1", name: "State Bank Fixed Deposit", type: "FD", amountInvested: 50000, currentValue: 52100, interestRate: 6.5 },
        { id: "inst_ppf_1", name: "Public Provident Fund", type: "PPF", amountInvested: 20000, currentValue: 21400, interestRate: 7.1 },
      ]
    },
    growth: {
      instruments: [
        { id: "inst_mf_1", name: "Nifty 50 Index Fund", type: "mutual_fund", amountInvested: 30000, currentValue: 34500, riskLevel: "medium" },
        { id: "inst_gold_1", name: "Sovereign Gold Bond", type: "gold", amountInvested: 10000, currentValue: 11200, riskLevel: "low" },
      ]
    },
    sandbox: {
      instruments: [
        { id: "inst_crypto_1", name: "Bitcoin (BTC)", type: "crypto", amountInvested: 5000, currentValue: 4200, volatility: "extreme" },
        { id: "inst_stock_1", name: "Tech Growth Corp", type: "stock", amountInvested: 15000, currentValue: 18500, volatility: "high" },
      ]
    }
  },
  totalNetWorth: 245000 // Just a base total; we will calculate this dynamically in the game state
};

// Simulated network delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockPortfolioApi = {
  async getPortfolio(_userId: string): Promise<PortfolioData> {
    await delay(400); // Simulate network
    return JSON.parse(JSON.stringify(mockPortfolioData)); // Return deep copy
  },

  async invest(_userId: string, tier: TierType, instrumentId: string, amount: number): Promise<{ success: boolean; updatedInstrument: Instrument; updatedNetWorth: number }> {
    await delay(500); // Simulate network
    
    const instruments = mockPortfolioData.tiers[tier].instruments;
    const instrument = instruments.find(i => i.id === instrumentId);
    
    if (!instrument) {
      throw new Error("Instrument not found");
    }

    instrument.amountInvested += amount;
    instrument.currentValue += amount; // Immediately add to value
    
    mockPortfolioData.totalNetWorth += amount;

    return {
      success: true,
      updatedInstrument: { ...instrument },
      updatedNetWorth: mockPortfolioData.totalNetWorth
    };
  },

  async withdraw(_userId: string, tier: TierType, instrumentId: string, amount: number): Promise<{ success: boolean; updatedInstrument: Instrument; updatedNetWorth: number }> {
    await delay(500); // Simulate network
    
    const instruments = mockPortfolioData.tiers[tier].instruments;
    const instrument = instruments.find(i => i.id === instrumentId);
    
    if (!instrument) {
      throw new Error("Instrument not found");
    }

    if (amount > instrument.currentValue) {
      throw new Error("Insufficient funds in instrument");
    }

    // Rough calculation to maintain proportion of invested vs current value (simplification for mock)
    const withdrawalRatio = amount / instrument.currentValue;
    const principalReduction = instrument.amountInvested * withdrawalRatio;

    instrument.currentValue -= amount;
    instrument.amountInvested = Math.max(0, instrument.amountInvested - principalReduction);
    
    mockPortfolioData.totalNetWorth -= amount;

    return {
      success: true,
      updatedInstrument: { ...instrument },
      updatedNetWorth: mockPortfolioData.totalNetWorth
    };
  }
};
