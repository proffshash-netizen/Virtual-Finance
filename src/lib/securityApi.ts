export type ScenarioType = "upi_request" | "phishing_link" | "otp_share" | "fake_offer";

export interface SecurityScenario {
  id: string;
  title: string;
  scenarioText: string;
  scenarioType: ScenarioType;
}

export interface SecurityAttemptResponse {
  correct: boolean;
  xpAwarded: number;
  explanation: string;
}

export const mockSecurityApi = {
  async getScenarios(): Promise<SecurityScenario[]> {
    const res = await fetch('/api/player/security/scenarios');
    if (!res.ok) throw new Error('Failed to fetch scenarios');
    return res.json();
  },

  async attemptScenario(id: string, playerAnswer: boolean): Promise<SecurityAttemptResponse> {
    const res = await fetch('/api/player/security/attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, playerAnswer })
    });
    if (!res.ok) throw new Error('Failed to attempt scenario');
    return res.json();
  }
};
