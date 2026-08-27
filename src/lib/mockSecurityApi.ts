export type ScenarioType = "upi_request" | "phishing_link" | "otp_share" | "fake_offer";

export interface SecurityScenario {
  id: string;
  title: string;
  scenarioText: string;
  scenarioType: ScenarioType;
  isFraudulent: boolean;
  explanation: string;
  xpReward: number;
}

export interface SecurityAttemptResponse {
  correct: boolean;
  xpAwarded: number;
  explanation: string;
}

const mockScenarios: SecurityScenario[] = [
  {
    id: "sec_upi_1",
    title: "Payment Request via UPI",
    scenarioText: "You received a UPI request for ₹5,000 from 'KycSupport@bank'. Message: 'Refund processing fee, enter PIN to receive refund.'",
    scenarioType: "upi_request",
    isFraudulent: true,
    explanation: "You never need to enter your UPI PIN to RECEIVE money. Entering your PIN means you are sending money to them.",
    xpReward: 50
  },
  {
    id: "sec_phish_1",
    title: "Account Blocked Alert",
    scenarioText: "SMS: 'Dear Customer, your HDFC netbanking will be blocked today. Please update PAN immediately on http://hdfc-update-kyc.com/login'",
    scenarioType: "phishing_link",
    isFraudulent: true,
    explanation: "Banks will never send links like 'hdfc-update-kyc.com'. Always check the official domain (e.g. hdfcbank.com) or use the official banking app.",
    xpReward: 50
  },
  {
    id: "sec_otp_1",
    title: "Customer Care Call",
    scenarioText: "A caller claiming to be from Amazon says your order is stuck. They ask you to read out the 6-digit verification code you just received to 'verify your identity'.",
    scenarioType: "otp_share",
    isFraudulent: true,
    explanation: "Never share OTPs (One Time Passwords) with anyone, not even customer care. OTPs act as your final digital signature.",
    xpReward: 50
  },
  {
    id: "sec_safe_1",
    title: "Swiggy Payment",
    scenarioText: "You ordered food on Swiggy for ₹450. Swiggy app redirects you to GPay, and you see a payment page asking for ₹450 to 'Bundl Technologies Pvt Ltd'.",
    scenarioType: "upi_request",
    isFraudulent: false,
    explanation: "This is a legitimate payment. You initiated it, the amount matches, and Bundl Technologies is the registered corporate name for Swiggy.",
    xpReward: 30
  },
  {
    id: "sec_offer_1",
    title: "Lottery Winner",
    scenarioText: "WhatsApp message from an unknown international number: 'Congratulations! Your mobile number won ₹25,00,000 in KBC Jio draw. Pay ₹10,500 tax processing fee to claim.'",
    scenarioType: "fake_offer",
    isFraudulent: true,
    explanation: "Legitimate lotteries deduct taxes from your winnings directly. If you have to pay upfront to get a prize, it's always a scam.",
    xpReward: 50
  },
  {
    id: "sec_safe_2",
    title: "Netflix Subscription",
    scenarioText: "You get an SMS from your credit card company: '₹649 spent on Netflix via Card ending in 1234.'",
    scenarioType: "fake_offer",
    isFraudulent: false,
    explanation: "This is a standard transaction alert for a subscription you likely signed up for. No action is required unless you didn't authorize it.",
    xpReward: 30
  },
  {
    id: "sec_phish_2",
    title: "Free AirDrop",
    scenarioText: "Twitter (X) post from an account that looks like Elon Musk: 'Giving back to the community! Send 0.1 BTC to this wallet and I will send back 0.5 BTC immediately.'",
    scenarioType: "phishing_link",
    isFraudulent: true,
    explanation: "This is a classic crypto scam. No one doubles your money for free. The verified checkmark can often be bought or hacked.",
    xpReward: 50
  },
  {
    id: "sec_otp_2",
    title: "Bank Login Notification",
    scenarioText: "You are trying to log into your own net banking on your laptop. You receive an SMS: 'Your OTP for login is 582914. Do not share this.'",
    scenarioType: "otp_share",
    isFraudulent: false,
    explanation: "This is a legitimate OTP triggered by your own action. As long as you only enter it on the official website yourself, it is perfectly safe.",
    xpReward: 30
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockSecurityApi = {
  async getScenarios(): Promise<SecurityScenario[]> {
    await delay(600); // Simulate network load
    // Return a shuffled subset of 5 scenarios for a typical session
    const shuffled = [...mockScenarios].sort(() => 0.5 - Math.random());
    return JSON.parse(JSON.stringify(shuffled.slice(0, 5)));
  },

  async attemptScenario(id: string, playerAnswer: boolean): Promise<SecurityAttemptResponse> {
    await delay(300); // Simulate checking
    
    const scenario = mockScenarios.find(s => s.id === id);
    if (!scenario) {
      throw new Error("Scenario not found");
    }

    const isCorrect = (playerAnswer === !scenario.isFraudulent);
    
    return {
      correct: isCorrect,
      xpAwarded: isCorrect ? scenario.xpReward : 0,
      explanation: scenario.explanation
    };
  }
};
