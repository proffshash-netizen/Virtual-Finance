export interface LessonPart {
  type: 'hook' | 'explanation' | 'visual' | 'real-life' | 'game-example' | 'quiz' | 'challenge' | 'takeaway';
  content?: string | React.ReactNode;
  visualId?: string; // used to load specific component in StudyVisuals
  question?: string;
  options?: { id: string; text: string; isCorrect: boolean; explanation: string }[];
  rewardXP?: number;
}

export interface Lesson {
  id: string;
  title: string;
  parts: LessonPart[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name or emoji
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeEstimate: string;
  rewardXP: number;
  locked: boolean;
  lesson: Lesson;
}

export const STUDY_PATHS: LearningPath[] = [
  {
    id: 'investing-basics',
    title: '💰 INVESTING BASICS',
    description: 'Learn what investing means.',
    icon: '💰',
    difficulty: 'Beginner',
    timeEstimate: '2 mins',
    rewardXP: 100,
    locked: false,
    lesson: {
      id: 'investing-basics-1',
      title: 'WHAT IS INVESTING?',
      parts: [
        { type: 'hook', content: 'What if you could put your money to work today so it grows for your future?' },
        { type: 'explanation', content: 'Think of investing as putting your money to work today because you want it to grow in the future. You are committing money to an asset with the expectation of earning a return.' },
        { type: 'visual', visualId: 'basics-visual' },
        { type: 'real-life', content: 'Imagine you save ₹1,000 in a drawer. Next year, it is still ₹1,000, but things might be more expensive. If you invest that ₹1,000, it might grow to ₹1,080 over time.' },
        { type: 'game-example', content: 'In FINLIT, your money (₹) can be used to buy assets in the Investment District, which generate more coins.' },
        { type: 'quiz', question: 'What does investing fundamentally mean?', options: [
            { id: 'a', text: 'Putting money in a safe at home', isCorrect: false, explanation: 'Almost! But putting money in a safe does not help it grow.' },
            { id: 'b', text: 'Putting money to work to earn a return', isCorrect: true, explanation: 'Correct! Investing is committing money with the expectation it will grow.' },
            { id: 'c', text: 'Spending money on expensive things', isCorrect: false, explanation: 'Nope, spending is the opposite of investing.' }
        ]},
        { type: 'takeaway', content: 'Investing is how you build wealth over time by making your money work for you.' }
      ]
    }
  },
  {
    id: 'stocks',
    title: '📈 STOCKS',
    description: 'Understand how stocks can generate returns.',
    icon: '📈',
    difficulty: 'Beginner',
    timeEstimate: '3 mins',
    rewardXP: 150,
    locked: false,
    lesson: {
      id: 'stocks-1',
      title: 'WHAT IS A STOCK?',
      parts: [
        { type: 'hook', content: 'What if you could own a tiny piece of your favorite company?' },
        { type: 'explanation', content: 'A stock represents ownership in a company. When you buy a share, you become a part-owner of that business.' },
        { type: 'visual', visualId: 'stock-metaphor' },
        { type: 'real-life', content: 'Example: You buy 10 shares of a company at ₹180 each. If the price rises to ₹220, your gain before fees is ₹40 × 10 = ₹400. \n\nRemember: Stock prices can also fall! 📈 can become 📉.' },
        { type: 'game-example', content: 'In FINLIT, you can buy shares of fictional companies. Some might pay you "dividend coins" while you hold them.' },
        { type: 'challenge', content: 'BUILD YOUR FIRST COMPANY', visualId: 'stock-challenge', rewardXP: 100 },
        { type: 'quiz', question: 'You buy a stock. What do you own?', options: [
            { id: 'a', text: 'A loan to the company', isCorrect: false, explanation: 'Almost! That describes a bond, not a stock.' },
            { id: 'b', text: 'A tiny ownership share', isCorrect: true, explanation: 'Correct! A stock represents ownership in the company.' },
            { id: 'c', text: 'A guaranteed profit', isCorrect: false, explanation: 'Careful! Stocks involve risk and are never guaranteed to profit.' }
        ]},
        { type: 'takeaway', content: 'Stocks give you ownership and potential for growth, but they come with market risk.' }
      ]
    }
  },
  {
    id: 'bonds',
    title: '🏦 BONDS',
    description: 'Learn how lending money works.',
    icon: '🏦',
    difficulty: 'Beginner',
    timeEstimate: '3 mins',
    rewardXP: 150,
    locked: false,
    lesson: {
      id: 'bonds-1',
      title: 'WHAT IS A BOND?',
      parts: [
        { type: 'hook', content: 'What if instead of owning a company, you lent it money?' },
        { type: 'explanation', content: 'Bonds are basically loans made by investors to governments or companies. They pay you interest over time and return your money at maturity.' },
        { type: 'visual', visualId: 'bond-metaphor' },
        { type: 'real-life', content: 'Example: You buy a ₹1,000 bond with a 4% annual coupon. You receive ₹40 every year, and at maturity, you get your ₹1,000 back.' },
        { type: 'game-example', content: 'In FINLIT, lending to a Stable Tower guarantees steady interest payments over a set number of days.' },
        { type: 'quiz', question: 'When you buy a bond, what are you doing?', options: [
            { id: 'a', text: 'Buying a piece of the company', isCorrect: false, explanation: 'That is a stock! With a bond, you do not own the company.' },
            { id: 'b', text: 'Lending money in exchange for interest', isCorrect: true, explanation: 'Correct! You are the lender, and they pay you interest.' },
            { id: 'c', text: 'Donating money', isCorrect: false, explanation: 'Nope! You expect your money back plus interest.' }
        ]},
        { type: 'takeaway', content: 'Bonds are loans you make to entities, providing steady income but generally lower potential returns than stocks.' }
      ]
    }
  },
  {
    id: 'diversification',
    title: '🌳 DIVERSIFICATION',
    description: 'Build a diversified simulated portfolio.',
    icon: '🌳',
    difficulty: 'Intermediate',
    timeEstimate: '4 mins',
    rewardXP: 250,
    locked: false,
    lesson: {
      id: 'div-1',
      title: 'DON\'T PUT YOUR WHOLE FINANCIAL VILLAGE IN ONE BUILDING.',
      parts: [
        { type: 'hook', content: 'Would you put all your savings into one company?' },
        { type: 'explanation', content: 'Diversification means spreading your money across different investments to reduce concentration risk. It does not eliminate risk, but helps balance it.' },
        { type: 'visual', visualId: 'diversification-metaphor' },
        { type: 'real-life', content: 'Imagine you have ₹10,000. If you put it all in one stock and it falls 50%, you lose ₹5,000. If you spread it across 10 different stocks, one falling 50% only impacts you by ₹500.' },
        { type: 'game-example', content: 'In FINLIT, if a storm hits the Market City, a diversified portfolio of buildings, farms, and towers will survive better than just one skyscraper.' },
        { type: 'quiz', question: 'What is the main purpose of diversification?', options: [
            { id: 'a', text: 'To guarantee profits', isCorrect: false, explanation: 'Diversification cannot guarantee profits or eliminate all risk.' },
            { id: 'b', text: 'To reduce concentration risk', isCorrect: true, explanation: 'Correct! By spreading your money, you reduce the risk of one bad investment ruining your portfolio.' },
            { id: 'c', text: 'To pay fewer taxes', isCorrect: false, explanation: 'Diversification does not directly lower your taxes.' }
        ]},
        { type: 'takeaway', content: 'Spread your investments! Diversification can reduce risk, but it cannot eliminate investment risk completely.' }
      ]
    }
  },
  {
    id: 'compounding',
    title: '⏳ COMPOUNDING',
    description: 'Understand compound growth.',
    icon: '⏳',
    difficulty: 'Beginner',
    timeEstimate: '3 mins',
    rewardXP: 200,
    locked: false,
    lesson: {
      id: 'comp-1',
      title: 'LET YOUR MONEY START WORKING FOR YOUR MONEY.',
      parts: [
        { type: 'hook', content: 'What happens when your money starts earning money... and then that money earns money too?' },
        { type: 'explanation', content: 'Compounding means your returns can themselves generate additional returns over time. It creates a snowball effect.' },
        { type: 'visual', visualId: 'compounding-metaphor' },
        { type: 'real-life', content: 'Imagine you start with ₹5,000 and it earns a 10% return. You now have ₹5,500. Next year, you earn 10% on the ₹5,500, which is ₹550. Your money is growing faster!' },
        { type: 'game-example', content: 'In FINLIT, reinvesting your dividend coins back into more buildings speeds up your wealth generation.' },
        { type: 'quiz', question: 'What describes compound growth?', options: [
            { id: 'a', text: 'Earning a fixed amount every year', isCorrect: false, explanation: 'That is simple interest. Compounding accelerates.' },
            { id: 'b', text: 'Your returns generating their own returns', isCorrect: true, explanation: 'Correct! It is the snowball effect in action.' }
        ]},
        { type: 'takeaway', content: 'Time is your best friend in investing. The earlier you start, the more compounding works for you.' }
      ]
    }
  },
  {
    id: 'risk',
    title: '🛡️ RISK & RETURN',
    description: 'Identify different investment risks.',
    icon: '🛡️',
    difficulty: 'Intermediate',
    timeEstimate: '4 mins',
    rewardXP: 200,
    locked: false,
    lesson: {
      id: 'risk-1',
      title: 'RISK VS RETURN',
      parts: [
        { type: 'hook', content: 'Why can two investments earn different returns?' },
        { type: 'explanation', content: 'Higher potential return usually comes with greater uncertainty and possibility of loss. There is no such thing as a high-return, zero-risk investment.' },
        { type: 'visual', visualId: 'risk-scale' },
        { type: 'real-life', content: 'A bank savings account is low risk, but gives low returns. A startup company could double your money, but it could also go bankrupt.' },
        { type: 'game-example', content: 'In FINLIT, the High-Tech Lab can produce huge coin rewards, but it has a 30% chance of failing and producing nothing.' },
        { type: 'quiz', question: 'If an investment promises very high returns, what is likely true?', options: [
            { id: 'a', text: 'It is a scam', isCorrect: false, explanation: 'Not always, but it is definitely risky!' },
            { id: 'b', text: 'It has higher risk and uncertainty', isCorrect: true, explanation: 'Correct! Higher potential return comes with higher risk.' },
            { id: 'c', text: 'It is safe because it is expensive', isCorrect: false, explanation: 'Price does not equal safety.' }
        ]},
        { type: 'takeaway', content: 'Always balance your desire for returns with your ability to handle risk.' }
      ]
    }
  }
];
