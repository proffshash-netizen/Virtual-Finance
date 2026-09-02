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

export const mockPortfolioApi = {
  async getPortfolio(_userId: string): Promise<PortfolioData> {
    try {
      const res = await fetch('/api/portfolio');
      if (!res.ok) throw new Error('Failed to fetch portfolio');
      return await res.json();
    } catch (error) {
      console.warn("Backend unavailable or unauthorized, falling back to mock portfolio data", error);
      return {
        tiers: {
          foundation: { instruments: [
            { id: "fd_1", name: "State Bank FD", type: "FD", amountInvested: 10000, currentValue: 10500, interestRate: 6.5 },
            { id: "ppf_1", name: "Public Provident Fund", type: "PPF", amountInvested: 50000, currentValue: 52000, interestRate: 7.1 }
          ] },
          growth: { instruments: [
            { id: "mf_1", name: "Nifty 50 Index Fund", type: "mutual_fund", amountInvested: 20000, currentValue: 22400, riskLevel: "medium" },
            { id: "stock_1", name: "Reliance Industries", type: "stock", amountInvested: 15000, currentValue: 14200, riskLevel: "high" }
          ] },
          sandbox: { instruments: [
            { id: "crypto_1", name: "Bitcoin", type: "crypto", amountInvested: 5000, currentValue: 3200, volatility: "extreme" },
            { id: "startup_1", name: "Tech Startup Angel", type: "startup", amountInvested: 10000, currentValue: 15000, volatility: "extreme" }
          ] }
        },
        totalNetWorth: 110000
      };
    }
  },

  async invest(_userId: string, tier: TierType, instrumentId: string, amount: number): Promise<{ success: boolean; updatedInstrument: Instrument; updatedNetWorth: number }> {
    try {
      const res = await fetch('/api/portfolio/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, instrumentId, amount })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to invest');
      }
      return await res.json();
    } catch (error) {
      console.warn("Backend unavailable, falling back to mock invest", error);
      return {
        success: true,
        updatedInstrument: {
          id: instrumentId,
          name: "Mock Investment",
          type: "stock",
          amountInvested: amount,
          currentValue: amount
        },
        updatedNetWorth: 110000 + amount
      };
    }
  },

  async withdraw(_userId: string, tier: TierType, instrumentId: string, amount: number): Promise<{ success: boolean; updatedInstrument: Instrument; updatedNetWorth: number }> {
    try {
      const res = await fetch('/api/portfolio/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, instrumentId, amount })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to withdraw');
      }
      return await res.json();
    } catch (error) {
      console.warn("Backend unavailable, falling back to mock withdraw", error);
      return {
        success: true,
        updatedInstrument: {
          id: instrumentId,
          name: "Mock Investment",
          type: "stock",
          amountInvested: 0,
          currentValue: 0
        },
        updatedNetWorth: 110000 - amount
      };
    }
  }
};
