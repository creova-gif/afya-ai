/**
 * Social Features Service for KUIMARISHA AI
 * Handles friends, leaderboards, challenges, and activity feed
 */

export interface Friend {
  id: string;
  userId: string;
  friendUserId: string;
  friendName: string;
  friendAvatar?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  acceptedAt?: string;
}

export interface Challenge {
  id: string;
  name: {
    sw: string;
    en: string;
  };
  description: {
    sw: string;
    en: string;
  };
  type: 'workout_count' | 'workout_minutes' | 'steps' | 'calories' | 'streak' | 'team';
  category: 'individual' | 'team' | 'school' | 'family';
  startDate: string;
  endDate: string;
  goal: number;
  participants: string[]; // user IDs
  teams?: {
    name: string;
    members: string[];
    progress: number;
  }[];
  rewards: {
    points: number;
    badge?: string;
    description: {
      sw: string;
      en: string;
    };
  };
  ageRestrictions?: {
    minAge?: number;
    maxAge?: number;
    prohibitedTypes?: string[];
  };
  status: 'upcoming' | 'active' | 'completed';
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  workouts: number;
  streak: number;
  achievements: number;
}

export interface Leaderboard {
  id: string;
  type: 'global' | 'regional' | 'school' | 'age_group' | 'friends';
  name: {
    sw: string;
    en: string;
  };
  region?: string;
  ageGroup?: string;
  schoolId?: string;
  entries: LeaderboardEntry[];
  updatedAt: string;
}

export interface ActivityFeedItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'workout' | 'achievement' | 'challenge_joined' | 'challenge_completed' | 'streak' | 'level_up';
  content: {
    sw: string;
    en: string;
  };
  metadata?: {
    workoutType?: string;
    achievementId?: string;
    challengeId?: string;
    level?: number;
    streak?: number;
  };
  imageUrl?: string;
  likes: number;
  comments: number;
  createdAt: string;
}

// Predefined challenges
export const CHALLENGES: Challenge[] = [
  {
    id: 'weekly_warrior',
    name: {
      sw: 'Shujaa wa Wiki',
      en: 'Weekly Warrior',
    },
    description: {
      sw: 'Fanya mazoezi angalau 5 kwa wiki hii',
      en: 'Complete at least 5 workouts this week',
    },
    type: 'workout_count',
    category: 'individual',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    goal: 5,
    participants: [],
    rewards: {
      points: 500,
      badge: '🏆',
      description: {
        sw: 'Shujaa wa Wiki Badge',
        en: 'Weekly Warrior Badge',
      },
    },
    status: 'active',
  },
  {
    id: 'step_master_30',
    name: {
      sw: 'Bingwa wa Hatua 30',
      en: 'Step Master 30',
    },
    description: {
      sw: 'Fanya hatua 10,000 kwa siku 30 mfululizo',
      en: 'Walk 10,000 steps for 30 consecutive days',
    },
    type: 'steps',
    category: 'individual',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    goal: 300000, // 10k * 30 days
    participants: [],
    rewards: {
      points: 1500,
      badge: '👟',
      description: {
        sw: 'Bingwa wa Hatua Badge',
        en: 'Step Master Badge',
      },
    },
    status: 'active',
  },
  {
    id: 'family_fitness',
    name: {
      sw: 'Afya ya Familia',
      en: 'Family Fitness',
    },
    description: {
      sw: 'Familia yako ifanye jumla ya mazoezi 20 wiki hii',
      en: 'Your family completes a total of 20 workouts this week',
    },
    type: 'workout_count',
    category: 'family',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    goal: 20,
    participants: [],
    rewards: {
      points: 750,
      badge: '👨‍👩‍👧‍👦',
      description: {
        sw: 'Familia Imara Badge',
        en: 'Strong Family Badge',
      },
    },
    status: 'active',
  },
  {
    id: 'school_pe_challenge',
    name: {
      sw: 'Changamoto ya PE',
      en: 'PE Challenge',
    },
    description: {
      sw: 'Darasa lifanye jumla ya dakika 500 za mazoezi wiki hii',
      en: 'Class completes a total of 500 workout minutes this week',
    },
    type: 'workout_minutes',
    category: 'school',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    goal: 500,
    participants: [],
    rewards: {
      points: 1000,
      badge: '🏫',
      description: {
        sw: 'Darasa Bora Badge',
        en: 'Top Class Badge',
      },
    },
    ageRestrictions: {
      minAge: 8,
      maxAge: 18,
      prohibitedTypes: ['HIIT', 'heavy_weights'],
    },
    status: 'active',
  },
  {
    id: 'hydration_hero',
    name: {
      sw: 'Shujaa wa Maji',
      en: 'Hydration Hero',
    },
    description: {
      sw: 'Kunywa glasi 8 za maji kwa siku 14 mfululizo',
      en: 'Drink 8 glasses of water for 14 consecutive days',
    },
    type: 'streak',
    category: 'individual',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    goal: 14,
    participants: [],
    rewards: {
      points: 600,
      badge: '💧',
      description: {
        sw: 'Shujaa wa Maji Badge',
        en: 'Hydration Hero Badge',
      },
    },
    status: 'active',
  },
];

class SocialService {
  private friends: Friend[] = [];
  private activityFeed: ActivityFeedItem[] = [];
  private userChallenges: Map<string, Challenge> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  // FRIENDS
  /**
   * Send friend request
   */
  async sendFriendRequest(
    userId: string,
    friendEmail: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // In production, this would lookup user by email and send request
      const friendRequest: Friend = {
        id: `FR-${Date.now()}`,
        userId,
        friendUserId: `user-${Date.now()}`, // Mock
        friendName: friendEmail.split('@')[0],
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      this.friends.push(friendRequest);
      this.saveToStorage();

      return { success: true };
    } catch (error) {
      console.error('Failed to send friend request:', error);
      return { success: false, error: 'Failed to send friend request' };
    }
  }

  /**
   * Accept friend request
   */
  async acceptFriendRequest(friendRequestId: string): Promise<{ success: boolean }> {
    const friend = this.friends.find(f => f.id === friendRequestId);
    if (!friend) return { success: false };

    friend.status = 'accepted';
    friend.acceptedAt = new Date().toISOString();
    this.saveToStorage();

    return { success: true };
  }

  /**
   * Get friends
   */
  getFriends(userId: string): Friend[] {
    return this.friends.filter(
      f => (f.userId === userId || f.friendUserId === userId) && f.status === 'accepted'
    );
  }

  /**
   * Get pending friend requests
   */
  getPendingRequests(userId: string): Friend[] {
    return this.friends.filter(f => f.friendUserId === userId && f.status === 'pending');
  }

  // CHALLENGES
  /**
   * Get available challenges
   */
  getAvailableChallenges(userAge?: number): Challenge[] {
    return CHALLENGES.filter(challenge => {
      if (challenge.status !== 'active') return false;
      
      if (challenge.ageRestrictions && userAge) {
        if (challenge.ageRestrictions.minAge && userAge < challenge.ageRestrictions.minAge) {
          return false;
        }
        if (challenge.ageRestrictions.maxAge && userAge > challenge.ageRestrictions.maxAge) {
          return false;
        }
      }
      
      return true;
    });
  }

  /**
   * Join challenge
   */
  async joinChallenge(userId: string, challengeId: string): Promise<{ success: boolean }> {
    const challenge = CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) return { success: false };

    if (!challenge.participants.includes(userId)) {
      challenge.participants.push(userId);
      this.userChallenges.set(`${userId}-${challengeId}`, challenge);
      this.saveToStorage();

      // Add to activity feed
      this.addActivityFeedItem({
        userId,
        userName: 'You',
        type: 'challenge_joined',
        content: {
          sw: `Umejiunga na changamoto: ${challenge.name.sw}`,
          en: `Joined challenge: ${challenge.name.en}`,
        },
        metadata: {
          challengeId: challenge.id,
        },
      });
    }

    return { success: true };
  }

  /**
   * Get user challenges
   */
  getUserChallenges(userId: string): Challenge[] {
    return Array.from(this.userChallenges.values()).filter(c =>
      c.participants.includes(userId)
    );
  }

  /**
   * Update challenge progress
   */
  updateChallengeProgress(
    userId: string,
    challengeId: string,
    progress: number
  ): void {
    const key = `${userId}-${challengeId}`;
    const challenge = this.userChallenges.get(key);
    
    if (challenge) {
      // Store progress in metadata (in production, this would be in database)
      const progressData = this.getChallengeProgress(userId, challengeId);
      progressData.progress = progress;
      
      if (progress >= challenge.goal && progressData.status !== 'completed') {
        progressData.status = 'completed';
        progressData.completedAt = new Date().toISOString();
        
        // Add to activity feed
        this.addActivityFeedItem({
          userId,
          userName: 'You',
          type: 'challenge_completed',
          content: {
            sw: `Umemaliza changamoto: ${challenge.name.sw}! 🎉`,
            en: `Completed challenge: ${challenge.name.en}! 🎉`,
          },
          metadata: {
            challengeId: challenge.id,
          },
        });
      }
      
      this.saveChallengeProgress(userId, challengeId, progressData);
    }
  }

  /**
   * Get challenge progress
   */
  getChallengeProgress(userId: string, challengeId: string): {
    progress: number;
    status: 'active' | 'completed';
    completedAt?: string;
  } {
    const stored = localStorage.getItem(`challenge_progress_${userId}_${challengeId}`);
    return stored ? JSON.parse(stored) : { progress: 0, status: 'active' };
  }

  /**
   * Save challenge progress
   */
  private saveChallengeProgress(
    userId: string,
    challengeId: string,
    data: any
  ): void {
    localStorage.setItem(`challenge_progress_${userId}_${challengeId}`, JSON.stringify(data));
  }

  // LEADERBOARDS
  /**
   * Get leaderboard
   */
  getLeaderboard(
    type: Leaderboard['type'],
    userId: string,
    options?: {
      region?: string;
      ageGroup?: string;
      schoolId?: string;
    }
  ): Leaderboard {
    // In production, this would fetch from database
    // For now, generate mock data
    const mockEntries: LeaderboardEntry[] = [
      {
        userId: userId,
        name: 'You',
        points: 2500,
        rank: 15,
        workouts: 45,
        streak: 7,
        achievements: 12,
      },
      ...Array.from({ length: 20 }, (_, i) => ({
        userId: `user-${i}`,
        name: `User ${i + 1}`,
        points: 3000 - i * 100,
        rank: i + 1,
        workouts: 50 - i,
        streak: 10 - Math.floor(i / 2),
        achievements: 15 - i,
      })),
    ];

    // Sort by points
    mockEntries.sort((a, b) => b.points - a.points);
    mockEntries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return {
      id: `leaderboard-${type}`,
      type,
      name: {
        sw: type === 'global' ? 'Ulimwengu' : type === 'regional' ? 'Mkoa' : 'Marafiki',
        en: type === 'global' ? 'Global' : type === 'regional' ? 'Regional' : 'Friends',
      },
      entries: mockEntries,
      updatedAt: new Date().toISOString(),
    };
  }

  // ACTIVITY FEED
  /**
   * Add activity feed item
   */
  addActivityFeedItem(item: Omit<ActivityFeedItem, 'id' | 'likes' | 'comments' | 'createdAt'>): void {
    const feedItem: ActivityFeedItem = {
      ...item,
      id: `FEED-${Date.now()}`,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
    };

    this.activityFeed.unshift(feedItem);
    
    // Keep only last 100 items
    if (this.activityFeed.length > 100) {
      this.activityFeed = this.activityFeed.slice(0, 100);
    }
    
    this.saveToStorage();
  }

  /**
   * Get activity feed
   */
  getActivityFeed(userId: string, limit: number = 20): ActivityFeedItem[] {
    // In production, filter by friends
    return this.activityFeed.slice(0, limit);
  }

  /**
   * Like activity
   */
  likeActivity(activityId: string): void {
    const activity = this.activityFeed.find(a => a.id === activityId);
    if (activity) {
      activity.likes += 1;
      this.saveToStorage();
    }
  }

  // STORAGE
  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem('kuimarisha_social_friends', JSON.stringify(this.friends));
      localStorage.setItem('kuimarisha_social_feed', JSON.stringify(this.activityFeed));
    } catch (error) {
      console.error('Failed to save social data:', error);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    try {
      const storedFriends = localStorage.getItem('kuimarisha_social_friends');
      if (storedFriends) {
        this.friends = JSON.parse(storedFriends);
      }

      const storedFeed = localStorage.getItem('kuimarisha_social_feed');
      if (storedFeed) {
        this.activityFeed = JSON.parse(storedFeed);
      }
    } catch (error) {
      console.error('Failed to load social data:', error);
    }
  }
}

// Export singleton
export const socialService = new SocialService();

// Export utility functions
export const sendFriendRequest = (userId: string, email: string) =>
  socialService.sendFriendRequest(userId, email);
export const getFriends = (userId: string) => socialService.getFriends(userId);
export const getAvailableChallenges = (userAge?: number) =>
  socialService.getAvailableChallenges(userAge);
export const joinChallenge = (userId: string, challengeId: string) =>
  socialService.joinChallenge(userId, challengeId);
export const getLeaderboard = (type: Leaderboard['type'], userId: string, options?: any) =>
  socialService.getLeaderboard(type, userId, options);
export const getActivityFeed = (userId: string, limit?: number) =>
  socialService.getActivityFeed(userId, limit);
export const addActivityFeedItem = (item: Omit<ActivityFeedItem, 'id' | 'likes' | 'comments' | 'createdAt'>) =>
  socialService.addActivityFeedItem(item);
