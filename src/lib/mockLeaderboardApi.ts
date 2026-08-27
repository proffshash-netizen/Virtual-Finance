const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface LeaderboardPlayer {
  id: string;
  rank: number;
  displayName: string;
  netWorth: number;
  isCurrentUser: boolean;
}

const mockLeaderboard: LeaderboardPlayer[] = [
  { id: 'u1', rank: 1, displayName: 'WarrenB', netWorth: 4500000, isCurrentUser: false },
  { id: 'u2', rank: 2, displayName: 'DiamondHands', netWorth: 3850000, isCurrentUser: false },
  { id: 'u3', rank: 3, displayName: 'AlphaSeeker', netWorth: 2900000, isCurrentUser: false },
  { id: 'u4', rank: 4, displayName: 'ValueInvestor', netWorth: 1750000, isCurrentUser: false },
  { id: 'u5', rank: 5, displayName: 'ToTheMoon', netWorth: 1200000, isCurrentUser: false },
  { id: 'mock_user_1', rank: 24, displayName: 'You', netWorth: 248500, isCurrentUser: true }, // will be overridden by actual user data
];

export const mockLeaderboardApi = {
  async getLeaderboard(userId: string, userNetWorth: number, userDisplayName: string): Promise<LeaderboardPlayer[]> {
    await delay(500);
    
    // Deep copy mock data
    const data: LeaderboardPlayer[] = JSON.parse(JSON.stringify(mockLeaderboard));
    
    // Inject current user dynamically if they have a new ID
    const userIndex = data.findIndex(p => p.id === 'mock_user_1');
    if (userIndex !== -1) {
      data[userIndex].id = userId;
      data[userIndex].displayName = userDisplayName;
      data[userIndex].netWorth = userNetWorth;
      
      // Basic mock ranking logic:
      if (userNetWorth > 4500000) data[userIndex].rank = 1;
      else if (userNetWorth > 1200000) data[userIndex].rank = 5;
      else data[userIndex].rank = 24;
    }
    
    // In a real app we'd sort here, but for mock we just return the hardcoded list
    return data;
  }
};
