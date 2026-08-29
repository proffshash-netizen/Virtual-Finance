export type ScenarioType = "upi_request" | "phishing_link" | "otp_share" | "fake_offer" | "caller_spam" | "stock_scam" | "ad_scam";
export type SecurityAnswer = "safe" | "fraud" | "verify";
export type Difficulty = "obvious" | "subtle";

export interface SecurityScenario {
  id: string;
  title: string;
  narrativeSetup: string;
  messageContent: string;
  scenarioType: ScenarioType;
  correctAnswer: SecurityAnswer;
  difficulty: Difficulty;
  explanation: string;
  xpReward: number;
}

export interface SecurityAttemptResponse {
  correct: boolean;
  playerAnswer: SecurityAnswer;
  correctAnswer: SecurityAnswer;
  xpAwarded: number;
  explanation: string;
}

import advancedScenariosRaw from '../data/securityScenarios.json';

const mockScenarios: SecurityScenario[] = [
  // 1. UPI Scams
  {
    id: "upi_1",
    title: "Payment Request via UPI",
    narrativeSetup: "You're at a local market buying groceries. Suddenly, a notification pops up on your phone.",
    messageContent: "You received a UPI request for ₹5,000 from 'KycSupport@bank'. Message: 'Refund processing fee, enter PIN to receive refund.'",
    scenarioType: "upi_request",
    correctAnswer: "fraud",
    difficulty: "obvious",
    explanation: "You never need to enter your UPI PIN to RECEIVE money. Entering your PIN means you are sending money to them.",
    xpReward: 30
  },
  {
    id: "upi_2",
    title: "Market QR Code",
    narrativeSetup: "You are paying a shopkeeper using their QR code stand, but their phone buzzes instead and sends you a link.",
    messageContent: "Shopkeeper: 'My QR code is broken, please click this payment link to send the ₹50: http://pay-merchant-portal.in/50'",
    scenarioType: "upi_request",
    correctAnswer: "verify",
    difficulty: "subtle",
    explanation: "While the shopkeeper might be telling the truth, clicking unofficial links is highly dangerous. Verify by asking them for their mobile number to pay directly instead.",
    xpReward: 60
  },
  {
    id: "upi_safe_1",
    title: "Swiggy Payment",
    narrativeSetup: "You just ordered dinner on Swiggy. The app redirects you to your UPI app to complete the transaction.",
    messageContent: "Payment request for ₹450 to 'Bundl Technologies Pvt Ltd'.",
    scenarioType: "upi_request",
    correctAnswer: "safe",
    difficulty: "obvious",
    explanation: "This is a legitimate payment. You initiated it, the amount matches, and 'Bundl Technologies Pvt Ltd' is the registered corporate name for Swiggy.",
    xpReward: 30
  },

  // 2. OTP Scams
  {
    id: "otp_1",
    title: "Unexpected OTP",
    narrativeSetup: "You're watching TV when your phone buzzes with a standard OTP message.",
    messageContent: "Your OTP for login is 582914. Do not share this with anyone.",
    scenarioType: "otp_share",
    correctAnswer: "verify",
    difficulty: "subtle",
    explanation: "You didn't initiate a login, which means someone else is trying to access your account. The correct action is to immediately log in securely (not using the message) and change your password.",
    xpReward: 60
  },
  {
    id: "otp_2",
    title: "Customer Care Refund",
    narrativeSetup: "An agent claiming to be from Amazon calls about a refund for a missing package.",
    messageContent: "\"I'm processing your ₹1,500 refund now. I just sent a verification code to your phone. Please read it back to me so I can release the funds.\"",
    scenarioType: "otp_share",
    correctAnswer: "fraud",
    difficulty: "obvious",
    explanation: "Customer care will never ask for an OTP to process a refund. The OTP they sent is actually them trying to reset your password or approve a transaction from your account.",
    xpReward: 30
  },

  // 3. Caller Spam
  {
    id: "caller_1",
    title: "Fraud Department Call",
    narrativeSetup: "Your phone rings. The caller ID shows your bank's name. The caller says there's a fraudulent charge on your card.",
    messageContent: "\"Hello, this is the Fraud Department. We've blocked a ₹10,000 charge. Please confirm the last 4 digits of your card and the CVV on the back so we can secure your account.\"",
    scenarioType: "caller_spam",
    correctAnswer: "verify",
    difficulty: "subtle",
    explanation: "While they didn't ask for an OTP immediately, asking for your CVV is a major red flag. The correct action is to hang up and independently call your bank's official number to verify.",
    xpReward: 60
  },
  {
    id: "caller_2",
    title: "Income Tax Department",
    narrativeSetup: "You receive an automated voice call claiming to be from the government.",
    messageContent: "\"This is the Income Tax Department. You have an outstanding penalty of ₹25,000. Press 1 to speak to an agent or an arrest warrant will be issued.\"",
    scenarioType: "caller_spam",
    correctAnswer: "fraud",
    difficulty: "obvious",
    explanation: "Government agencies do not call and threaten arrest for immediate payment over the phone. This is a classic intimidation scam.",
    xpReward: 30
  },

  // 4. Stock Market / Trading Scams
  {
    id: "stock_1",
    title: "WhatsApp Stock Tip",
    narrativeSetup: "You are added to a WhatsApp group called 'VIP Trading Signals' without your permission.",
    messageContent: "Admin: 'Buy XYZ Corp immediately! Guaranteed 200% returns by tomorrow. Insider news confirmed!'",
    scenarioType: "stock_scam",
    correctAnswer: "fraud",
    difficulty: "obvious",
    explanation: "Guaranteed returns do not exist in the stock market. This is a 'Pump and Dump' scheme where scammers artificially inflate the price to sell their own shares, leaving you with worthless stock.",
    xpReward: 30
  },
  {
    id: "stock_2",
    title: "Broker Cold Call",
    narrativeSetup: "A representative from a well-known brokerage firm calls you with an exclusive offer.",
    messageContent: "\"We are opening a pre-IPO investment opportunity. The minimum investment is ₹1 Lakh, but the returns are contractually guaranteed to be 15% per month.\"",
    scenarioType: "stock_scam",
    correctAnswer: "verify",
    difficulty: "subtle",
    explanation: "While the firm might be real, the caller is likely an impersonator. A guaranteed 15% monthly return is a massive red flag. Always verify by hanging up and calling the official broker line.",
    xpReward: 60
  },

  // 5. Advertisement Scams
  {
    id: "ad_1",
    title: "Celebrity Crypto Ad",
    narrativeSetup: "You are scrolling through Instagram and see a sponsored video featuring a famous billionaire.",
    messageContent: "\"I'm giving back to my fans! Send 0.1 BTC to the link below and I'll send back 0.5 BTC instantly through my new foundation.\"",
    scenarioType: "ad_scam",
    correctAnswer: "fraud",
    difficulty: "obvious",
    explanation: "This is a classic deepfake or hijacked account scam. No one doubles your money for free.",
    xpReward: 30
  },
  {
    id: "ad_2",
    title: "Instant Loan Approval",
    narrativeSetup: "You see an ad for a loan app offering instant approval with zero credit check.",
    messageContent: "\"Congratulations! You are pre-approved for ₹5 Lakhs. Please pay a ₹2,500 file processing fee upfront to disburse the loan.\"",
    scenarioType: "ad_scam",
    correctAnswer: "fraud",
    difficulty: "subtle",
    explanation: "Legitimate lenders deduct processing fees from the loan amount itself. If you have to pay upfront to get a loan, it's an advance-fee scam.",
    xpReward: 50
  },

  // 6. Phishing Links
  {
    id: "phish_1",
    title: "Account Alert SMS",
    narrativeSetup: "It's late evening and you receive an urgent text message about your main bank account.",
    messageContent: "Dear Customer, suspicious login attempt on your account. Verify identity immediately at http://hdfc-auth-secure.com/login",
    scenarioType: "phishing_link",
    correctAnswer: "fraud",
    difficulty: "subtle",
    explanation: "The domain 'hdfc-auth-secure.com' is not HDFC's real domain. Banks never ask you to verify identity via a random link in an SMS.",
    xpReward: 50
  },
  {
    id: "phish_2",
    title: "Failed Delivery Notice",
    narrativeSetup: "You are waiting for a package. You get an SMS claiming your delivery was missed.",
    messageContent: "IndiaPost: Your package delivery failed due to unpaid customs fee of ₹15. Pay here to reschedule: http://india-post-fees.in/track",
    scenarioType: "phishing_link",
    correctAnswer: "verify",
    difficulty: "subtle",
    explanation: "Scammers send these blindly hoping you're expecting a package. The domain is fake. Go directly to the official courier website and type in your tracking number manually to verify.",
    xpReward: 60
  },
  {
    id: "phish_3",
    title: "Job Offer WhatsApp",
    narrativeSetup: "An HR recruiter from a top multinational company messages you on WhatsApp.",
    messageContent: "\"You have been selected for a Work From Home role earning ₹5,000/day. Click this link to register and pay the ₹500 uniform fee.\"",
    scenarioType: "phishing_link",
    correctAnswer: "fraud",
    difficulty: "obvious",
    explanation: "Legitimate companies do not hire via unsolicited WhatsApp messages, and they never ask you to pay for your own uniform or registration fees upfront.",
    xpReward: 30
  }
];

const advancedScenarios: SecurityScenario[] = advancedScenariosRaw.map(s => ({
  id: s.id,
  title: s.title,
  narrativeSetup: s.narrativeSetup,
  messageContent: s.messageContent,
  scenarioType: s.scenarioType as ScenarioType,
  correctAnswer: s.correctAnswer as SecurityAnswer,
  difficulty: "subtle",
  explanation: s.explanation,
  xpReward: 100
}));

const allScenarios = [...mockScenarios, ...advancedScenarios];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockSecurityApi = {
  async getScenarios(): Promise<SecurityScenario[]> {
    await delay(600); // Simulate network load
    const shuffled = [...allScenarios].sort(() => 0.5 - Math.random());
    return JSON.parse(JSON.stringify(shuffled.slice(0, 5)));
  },

  async attemptScenario(id: string, playerAnswer: SecurityAnswer): Promise<SecurityAttemptResponse> {
    await delay(300); // Simulate checking
    
    const scenario = allScenarios.find(s => s.id === id);
    if (!scenario) {
      throw new Error("Scenario not found");
    }

    const isCorrect = (playerAnswer === scenario.correctAnswer);
    
    return {
      correct: isCorrect,
      playerAnswer,
      correctAnswer: scenario.correctAnswer,
      xpAwarded: isCorrect ? scenario.xpReward : 0,
      explanation: scenario.explanation
    };
  }
};
