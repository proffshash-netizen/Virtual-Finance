const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconType: string;
  earnedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const mockBadges: Badge[] = [
  { id: 'b1', name: 'First Steps', description: 'Created an account and entered the world.', iconType: 'star', earnedAt: new Date().toISOString(), rarity: 'common' },
  { id: 'b2', name: 'Saver', description: 'Saved your first ₹10,000.', iconType: 'shield', earnedAt: new Date(Date.now() - 86400000).toISOString(), rarity: 'common' },
  { id: 'b3', name: 'Fraud Spotter', description: 'Identified scams with high accuracy.', iconType: 'alert', rarity: 'rare' },
  { id: 'b4', name: 'Market Bull', description: 'Grew your portfolio by 20% in a single day.', iconType: 'trending-up', rarity: 'epic' },
  { id: 'b5', name: 'Diamond Hands', description: 'Held a volatile asset during a market crash without selling.', iconType: 'diamond', rarity: 'legendary' },
];

export const mockBadgesApi = {
  async getBadges(_userId: string): Promise<Badge[]> {
    await delay(400); // Simulate network
    return JSON.parse(JSON.stringify(mockBadges));
  }
};
