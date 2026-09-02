export type ScenarioType = "upi_request" | "phishing_link" | "otp_share" | "fake_offer" | "caller_spam" | "stock_scam" | "ad_scam" | "upi" | "otp" | "caller" | "trading" | "advertisement" | "phishing";
export type SecurityAnswer = "safe" | "fraud" | "verify";
export type Difficulty = "obvious" | "subtle";

export interface SecurityScenario {
  id: string;
  title: string;
  narrativeSetup: string;
  messageContent: string;
  scenarioType: ScenarioType;
  difficulty: Difficulty;
  xpReward: number;
}

export interface SecurityAttemptResponse {
  correct: boolean;
  correctAnswer: SecurityAnswer;
  explanation: string;
  xpAwarded: number;
}

export const mockSecurityApi = {
  async getScenarios(): Promise<SecurityScenario[]> {
    try {
      const res = await fetch('/api/security-scenarios');
      if (!res.ok) throw new Error('Failed to fetch scenarios');
      const data = await res.json();
      return data.map((d: any) => ({
        id: d.id,
        title: d.category === 'upi' ? 'Payment Request' :
               d.category === 'otp' ? 'Unexpected OTP' :
               d.category === 'phishing' ? 'Suspicious Link' :
               d.category === 'trading' ? 'Trading Tip' :
               d.category === 'caller' ? 'Unknown Caller' : 'Security Alert',
        narrativeSetup: d.narrativeSetup,
        messageContent: d.messageContent,
        scenarioType: d.category,
        difficulty: d.difficulty,
        xpReward: d.xpReward
      }));
    } catch (error) {
      console.warn("Backend unavailable, falling back to mock security scenarios", error);
      return [
        {
          id: "mock_sec_1",
          title: "Payment Request",
          narrativeSetup: "You receive a payment request on your UPI app from an unknown person.",
          messageContent: "Dear customer, you have won ₹5000. Enter your UPI PIN to claim the prize.",
          scenarioType: "upi",
          difficulty: "obvious",
          xpReward: 50
        }
      ];
    }
  },

  async attemptScenario(id: string, playerAnswer: SecurityAnswer): Promise<SecurityAttemptResponse> {
    try {
      const res = await fetch(`/api/security-scenarios/${id}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerAnswer })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to attempt scenario');
      }
      return await res.json();
    } catch (error) {
      console.warn("Backend unavailable, falling back to mock security attempt response", error);
      return {
        correct: true,
        correctAnswer: "fraud",
        explanation: "This is a mock fallback explanation.",
        xpAwarded: 50
      };
    }
  }
};
