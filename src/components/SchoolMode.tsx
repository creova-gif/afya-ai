import { ArrowLeft, GraduationCap, Users, Trophy, Target, Play } from 'lucide-react';
import { UserProfile } from '../App';

interface SchoolModeProps {
  profile: UserProfile;
  onBack: () => void;
  onStartWorkout: (workout: any) => void;
}

export function SchoolMode({ profile, onBack, onStartWorkout }: SchoolModeProps) {
  const text = profile.language === 'sw' ? {
    schoolMode: 'Hali ya Shule',
    peClasses: 'Madarasa ya Michezo',
    groupWorkouts: 'Mazoezi ya Kikundi',
    challenges: 'Changamoto',
    leaderboard: 'Orodha ya Washindi',
    students: 'Wanafunzi',
    duration: 'Muda',
    difficulty: 'Ugumu',
    start: 'Anza',
    viewAll: 'Angalia Zote',
  } : {
    schoolMode: 'School Mode',
    peClasses: 'PE Classes',
    groupWorkouts: 'Group Workouts',
    challenges: 'Challenges',
    leaderboard: 'Leaderboard',
    students: 'Students',
    duration: 'Duration',
    difficulty: 'Difficulty',
    start: 'Start',
    viewAll: 'View All',
  };

  const peClasses = [
    {
      id: 1,
      name: 'Morning Warmup',
      nameSwahili: 'Maandalizi ya Asubuhi',
      duration: 15,
      students: 30,
      difficulty: 'Easy',
      icon: '🌅',
      color: 'from-[#FF6B35] to-[#E85A2A]',
    },
    {
      id: 2,
      name: 'Team Sports',
      nameSwahili: 'Michezo ya Timu',
      duration: 45,
      students: 40,
      difficulty: 'Medium',
      icon: '⚽',
      color: 'from-[#1EB53A] to-[#0F7A28]',
    },
    {
      id: 3,
      name: 'Fitness Circuit',
      nameSwahili: 'Mzunguko wa Afya',
      duration: 30,
      students: 25,
      difficulty: 'Hard',
      icon: '💪',
      color: 'from-[#00A3DD] to-[#0077A3]',
    },
  ];

  const challenges = [
    { name: '100 Jumps Challenge', nameSwahili: 'Changamoto ya Kuruka 100', participants: 156, icon: '🏃' },
    { name: 'Push-up Marathon', nameSwahili: 'Marathon ya Push-ups', participants: 89, icon: '💪' },
    { name: 'Plank Challenge', nameSwahili: 'Changamoto ya Plank', participants: 124, icon: '🧘' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Juma M.', points: 2450, streak: 15, icon: '🥇' },
    { rank: 2, name: 'Amina K.', points: 2380, streak: 12, icon: '🥈' },
    { rank: 3, name: 'Hassan B.', points: 2290, streak: 10, icon: '🥉' },
    { rank: 4, name: 'Fatuma S.', points: 2150, streak: 9, icon: '👤' },
    { rank: 5, name: 'Ibrahim L.', points: 2080, streak: 8, icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-[#000000] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#000000]/90 backdrop-blur-xl border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00A3DD] to-[#0077A3] flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl text-white tracking-tight" style={{ fontWeight: 800 }}>
                  {text.schoolMode}
                </h1>
                <p className="text-sm text-white/60" style={{ fontWeight: 600 }}>
                  Physical Education
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* PE Classes */}
        <div>
          <h2 className="text-xl text-white mb-4 px-1" style={{ fontWeight: 700 }}>
            {text.peClasses}
          </h2>
          <div className="space-y-3">
            {peClasses.map((peClass) => (
              <div
                key={peClass.id}
                className={`bg-gradient-to-br ${peClass.color}/20 backdrop-blur-xl border border-white/20 rounded-3xl p-6`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{peClass.icon}</div>
                    <div>
                      <h3 className="text-lg text-white" style={{ fontWeight: 700 }}>
                        {profile.language === 'sw' ? peClass.nameSwahili : peClass.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-white/60" style={{ fontWeight: 500 }}>
                          {peClass.duration} min
                        </span>
                        <span className="text-white/40">•</span>
                        <span className="text-sm text-white/60" style={{ fontWeight: 500 }}>
                          {peClass.students} {text.students.toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs text-white ${
                    peClass.difficulty === 'Easy' ? 'bg-[#1EB53A]/30' :
                    peClass.difficulty === 'Medium' ? 'bg-[#FF6B35]/30' :
                    'bg-[#E85A2A]/30'
                  }`} style={{ fontWeight: 700 }}>
                    {peClass.difficulty}
                  </span>
                </div>

                <button
                  onClick={() => onStartWorkout(peClass)}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{ fontWeight: 700 }}
                >
                  <Play className="w-5 h-5" strokeWidth={2.5} />
                  {text.start}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Challenges */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl text-white" style={{ fontWeight: 700 }}>
              {text.challenges}
            </h2>
            <button className="text-sm text-[#1EB53A]" style={{ fontWeight: 600 }}>
              {text.viewAll}
            </button>
          </div>
          <div className="space-y-3">
            {challenges.map((challenge, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{challenge.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-base text-white" style={{ fontWeight: 700 }}>
                      {profile.language === 'sw' ? challenge.nameSwahili : challenge.name}
                    </h3>
                    <p className="text-sm text-white/60 mt-1" style={{ fontWeight: 500 }}>
                      {challenge.participants} participants
                    </p>
                  </div>
                  <Target className="w-6 h-6 text-[#1EB53A]" strokeWidth={2.5} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <div className="flex items-center gap-3 mb-4 px-1">
            <Trophy className="w-6 h-6 text-[#FFD700]" strokeWidth={2.5} />
            <h2 className="text-xl text-white" style={{ fontWeight: 700 }}>
              {text.leaderboard}
            </h2>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
            {leaderboard.map((entry, idx) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-4 p-5 ${
                  idx < leaderboard.length - 1 ? 'border-b border-white/5' : ''
                } ${entry.rank <= 3 ? 'bg-white/5' : ''}`}
              >
                <div className="text-3xl">{entry.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-white" style={{ fontWeight: 700 }}>
                      #{entry.rank}
                    </span>
                    <span className="text-base text-white" style={{ fontWeight: 600 }}>
                      {entry.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-white/60" style={{ fontWeight: 500 }}>
                      {entry.points} pts
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-sm text-white/60" style={{ fontWeight: 500 }}>
                      {entry.streak} day streak
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Class Stats */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6">
          <h3 className="text-xl text-white mb-4" style={{ fontWeight: 700 }}>
            Class Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-2xl">
              <div className="text-3xl text-white mb-1" style={{ fontWeight: 800 }}>
                156
              </div>
              <div className="text-sm text-white/60" style={{ fontWeight: 600 }}>
                Active {text.students}
              </div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-2xl">
              <div className="text-3xl text-white mb-1" style={{ fontWeight: 800 }}>
                24
              </div>
              <div className="text-sm text-white/60" style={{ fontWeight: 600 }}>
                Classes This Week
              </div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-2xl">
              <div className="text-3xl text-white mb-1" style={{ fontWeight: 800 }}>
                89%
              </div>
              <div className="text-sm text-white/60" style={{ fontWeight: 600 }}>
                Attendance Rate
              </div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-2xl">
              <div className="text-3xl text-white mb-1" style={{ fontWeight: 800 }}>
                4.8★
              </div>
              <div className="text-sm text-white/60" style={{ fontWeight: 600 }}>
                Avg Rating
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
