export interface Badge {
  id: string;
  name: string;
  description: string;
  iconType: string;
  earnedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const mockBadgesApi = {
  async getBadges(_userId: string): Promise<Badge[]> {
    try {
      const res = await fetch('/api/badges');
      if (!res.ok) throw new Error('Failed to fetch badges');
      const data = await res.json();
      return data.map((b: any) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        iconType: b.iconId || 'star', // fallback mapping
        earnedAt: b.earnedAt,
        rarity: 'common' // default fallback since not provided by DB
      }));
    } catch (error) {
      console.warn("Backend unavailable, falling back to mock badges", error);
      return [
        { id: "badge_1", name: "First Investment", description: "You made your first investment.", iconType: "star", rarity: "common" }
      ];
    }
  }
};
