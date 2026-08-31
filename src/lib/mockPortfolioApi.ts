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
    const res = await fetch('/api/portfolio');
    if (!res.ok) throw new Error('Failed to fetch portfolio');
    return res.json();
  },

  async invest(_userId: string, tier: TierType, instrumentId: string, amount: number): Promise<{ success: boolean; updatedInstrument: Instrument; updatedNetWorth: number }> {
    const res = await fetch('/api/portfolio/invest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier, instrumentId, amount })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to invest');
    }
    return res.json();
  },

  async withdraw(_userId: string, tier: TierType, instrumentId: string, amount: number): Promise<{ success: boolean; updatedInstrument: Instrument; updatedNetWorth: number }> {
    const res = await fetch('/api/portfolio/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier, instrumentId, amount })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to withdraw');
    }
    return res.json();
  }
};
