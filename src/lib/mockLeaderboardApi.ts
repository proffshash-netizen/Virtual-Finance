export interface LeaderboardPlayer {
  id: string;
  rank: number;
  displayName: string;
  netWorth: number; // Keep for backward compatibility if needed
  metricValue: string | number;
  metricLabel: string;
  isCurrentUser: boolean;
}

export const mockLeaderboardApi = {
  async getLeaderboard(_userId: string, _userNetWorth: number, _userDisplayName: string, metric: string = 'consistency'): Promise<LeaderboardPlayer[]> {
    const res = await fetch(`/api/leaderboard?metric=${metric}`);
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    const data = await res.json();
    return data.map((p: any) => ({
      id: p.userId,
      rank: p.rank,
      displayName: p.displayName,
      netWorth: 0, // Not used strictly anymore, but kept for interface compatibility
      metricValue: p.metricValue,
      metricLabel: p.metricLabel,
      isCurrentUser: p.isCurrentUser
    }));
  }
};
