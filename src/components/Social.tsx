import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Users, Target, TrendingUp, Medal, Award, Flame, Plus } from 'lucide-react';
import { UserProfile } from '../App';
import {
  socialService,
  getLeaderboard,
  getAvailableChallenges,
  joinChallenge,
  getFriends,
  getActivityFeed,
  type Challenge,
  type Leaderboard,
  type Friend,
  type ActivityFeedItem,
} from '../services/social';
import { toast } from 'sonner@2.0.3';

interface SocialProps {
  profile: UserProfile;
  onBack: () => void;
}

export function Social({ profile, onBack }: SocialProps) {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges' | 'friends' | 'feed'>('leaderboard');
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [feed, setFeed] = useState<ActivityFeedItem[]>([]);
  const [leaderboardType, setLeaderboardType] = useState<'global' | 'regional' | 'friends'>('global');

  useEffect(() => {
    loadData();
  }, [activeTab, leaderboardType]);

  const loadData = () => {
    if (activeTab === 'leaderboard') {
      const lb = getLeaderboard(leaderboardType, profile.id);
      setLeaderboard(lb);
    } else if (activeTab === 'challenges') {
      const availableChallenges = getAvailableChallenges(profile.age);
      setChallenges(availableChallenges);
    } else if (activeTab === 'friends') {
      const friendsList = getFriends(profile.id);
      setFriends(friendsList);
    } else if (activeTab === 'feed') {
      const activityFeed = getActivityFeed(profile.id, 20);
      setFeed(activityFeed);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    const result = await joinChallenge(profile.id, challengeId);
    if (result.success) {
      toast.success(profile.language === 'sw' ? 'Umejiunga na changamoto!' : 'Joined challenge!');
      loadData();
    }
  };

  const text = profile.language === 'sw' ? {
    title: 'Ushindani',
    tabs: {
      leaderboard: 'Orodha',
      challenges: 'Changamoto',
      friends: 'Marafiki',
      feed: 'Shughuli',
    },
    leaderboardTypes: {
      global: 'Ulimwengu',
      regional: 'Mkoa',
      friends: 'Marafiki',
    },
    rank: 'Nafasi',
    points: 'Pointi',
    workouts: 'Mazoezi',
    streak: 'Mfululizo',
    achievements: 'Mafanikio',
    joinChallenge: 'Jiunga',
    joined: 'Umejiunga',
    startsIn: 'Inaanza',
    endsIn: 'Inaisha',
    participants: 'Washiriki',
    reward: 'Zawadi',
    days: 'siku',
    noFriends: 'Hakuna marafiki bado',
    addFriends: 'Ongeza marafiki',
    noActivity: 'Hakuna shughuli',
  } : {
    title: 'Social',
    tabs: {
      leaderboard: 'Leaderboard',
      challenges: 'Challenges',
      friends: 'Friends',
      feed: 'Feed',
    },
    leaderboardTypes: {
      global: 'Global',
      regional: 'Regional',
      friends: 'Friends',
    },
    rank: 'Rank',
    points: 'Points',
    workouts: 'Workouts',
    streak: 'Streak',
    achievements: 'Achievements',
    joinChallenge: 'Join',
    joined: 'Joined',
    startsIn: 'Starts in',
    endsIn: 'Ends in',
    participants: 'Participants',
    reward: 'Reward',
    days: 'days',
    noFriends: 'No friends yet',
    addFriends: 'Add friends',
    noActivity: 'No activity',
  };

  const getRankMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getDaysUntil = (dateString: string) => {
    const diff = new Date(dateString).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0A1F0F] to-[#000000] text-white pb-20">
      {/* Header */}
      <div className="bg-[#0A1F0F]/80 backdrop-blur-md border-b border-[#1EB53A]/20 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{text.title}</h1>
            </div>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['leaderboard', 'challenges', 'friends', 'feed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-[#1EB53A] text-white'
                  : 'bg-black/30 text-white/60 hover:bg-black/50'
              }`}
            >
              {text.tabs[tab]}
            </button>
          ))}
        </div>

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && leaderboard && (
          <div className="space-y-4">
            {/* Leaderboard Type Filter */}
            <div className="flex gap-2">
              {(['global', 'regional', 'friends'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setLeaderboardType(type)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    leaderboardType === type
                      ? 'bg-[#1EB53A] text-white'
                      : 'bg-black/30 text-white/60'
                  }`}
                >
                  {text.leaderboardTypes[type]}
                </button>
              ))}
            </div>

            {/* Leaderboard Entries */}
            <div className="space-y-2">
              {leaderboard.entries.map((entry, index) => {
                const isCurrentUser = entry.userId === profile.id;
                const medal = getRankMedal(entry.rank);

                return (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border ${
                      isCurrentUser
                        ? 'bg-gradient-to-r from-[#1EB53A]/20 to-emerald-500/10 border-[#1EB53A]/30'
                        : 'bg-black/30 border-white/10'
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-12 text-center">
                      {medal ? (
                        <div className="text-3xl">{medal}</div>
                      ) : (
                        <div className="text-2xl font-bold text-white/60">
                          #{entry.rank}
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-white">
                        {entry.name} {isCurrentUser && '(You)'}
                      </h3>
                      <div className="flex gap-4 mt-1 text-xs text-white/60">
                        <span>{entry.workouts} {text.workouts}</span>
                        <span>🔥 {entry.streak}d</span>
                        <span>🏆 {entry.achievements}</span>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <div className="text-xl font-bold text-[#1EB53A]">
                        {entry.points.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/40">{text.points}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="space-y-4">
            {challenges.map((challenge, index) => {
              const daysUntilEnd = getDaysUntil(challenge.endDate);
              const isJoined = challenge.participants.includes(profile.id);

              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/30 border border-white/10 rounded-3xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {challenge.name[profile.language]}
                      </h3>
                      <p className="text-sm text-white/60">
                        {challenge.description[profile.language]}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-2xl flex-shrink-0 ml-3">
                      {challenge.type === 'workout_count' && '💪'}
                      {challenge.type === 'steps' && '👟'}
                      {challenge.type === 'streak' && '🔥'}
                      {challenge.type === 'team' && '👥'}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{challenge.participants.length} {text.participants}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>{text.endsIn} {daysUntilEnd} {text.days}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <div className="text-[#1EB53A] font-semibold">
                        {text.reward}: +{challenge.rewards.points} {text.points}
                      </div>
                      {challenge.rewards.badge && (
                        <div className="text-white/60">
                          {challenge.rewards.badge} {challenge.rewards.description[profile.language]}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => !isJoined && handleJoinChallenge(challenge.id)}
                      disabled={isJoined}
                      className={`px-6 py-2 rounded-full font-semibold transition-all ${
                        isJoined
                          ? 'bg-white/10 text-white/40 cursor-default'
                          : 'bg-[#1EB53A] text-white hover:shadow-lg'
                      }`}
                    >
                      {isJoined ? text.joined : text.joinChallenge}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="space-y-4">
            {friends.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/40 mb-4">{text.noFriends}</p>
                <button className="px-6 py-3 bg-[#1EB53A] text-white rounded-full font-semibold hover:shadow-lg transition-all">
                  <Plus className="w-5 h-5 inline mr-2" />
                  {text.addFriends}
                </button>
              </div>
            ) : (
              friends.map((friend, index) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-black/30 border border-white/10 rounded-2xl"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1EB53A] to-emerald-500 flex items-center justify-center text-xl font-bold text-white">
                    {friend.friendName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{friend.friendName}</h3>
                    <p className="text-sm text-white/60">
                      {profile.language === 'sw' ? 'Rafiki' : 'Friend'}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Activity Feed Tab */}
        {activeTab === 'feed' && (
          <div className="space-y-4">
            {feed.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/40">{text.noActivity}</p>
              </div>
            ) : (
              feed.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-black/30 border border-white/10 rounded-2xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1EB53A] to-emerald-500 flex items-center justify-center text-lg font-bold text-white">
                      {item.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-1">{item.userName}</h4>
                      <p className="text-sm text-white/80">
                        {item.content[profile.language]}
                      </p>
                      <p className="text-xs text-white/40 mt-2">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
