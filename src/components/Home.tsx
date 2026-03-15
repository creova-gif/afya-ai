import { Activity, Sparkles, Heart, Zap, Droplet, Moon, TrendingUp, Users } from 'lucide-react';

interface HomeProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export function Home({ onGetStarted, onSignIn }: HomeProps) {
  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1EB53A]/20 via-[#000000] to-[#00A3DD]/20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1EB53A]/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00A3DD]/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm mx-auto space-y-10">
          {/* Hero Section - Reimagined */}
          <div className="text-center space-y-8">
            {/* Main Logo with Pulsing Effect */}
            <div className="relative">
              <div className="absolute inset-0 w-32 h-32 mx-auto bg-[#1EB53A]/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-[#1EB53A] via-[#1EB53A] to-[#0F7A28] rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(30,181,58,0.4)]">
                <Activity className="w-16 h-16 text-white" strokeWidth={3} />
              </div>
            </div>

            {/* Hero Text */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-6xl text-white tracking-tight leading-none" style={{ fontWeight: 900 }}>Afya AI</h1>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1EB53A]/20 border border-[#1EB53A]/30 rounded-full">
                  <div className="w-2 h-2 bg-[#1EB53A] rounded-full animate-pulse"></div>
                  <span className="text-sm text-[#1EB53A]" style={{ fontWeight: 600 }}>AI-Powered</span>
                </div>
              </div>
              <p className="text-xl text-white/70 leading-relaxed px-4" style={{ fontWeight: 500 }}>
                Mwongozo wako wa kibinafsi wa<br />afya na fitness kwa Kiswahili
              </p>
            </div>
          </div>

          {/* Feature Grid - Modern Cards */}
          <div className="space-y-4">
            {/* Main Feature - Large Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1EB53A]/10 via-[#1EB53A]/5 to-transparent backdrop-blur-xl border border-[#1EB53A]/20 rounded-3xl p-6 hover:border-[#1EB53A]/40 transition-all group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1EB53A]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-2xl text-white" style={{ fontWeight: 800 }}>
                      AI Coach
                    </h3>
                    <p className="text-sm text-white/60" style={{ fontWeight: 500 }}>
                      Mshauri wako wa kibinafsi
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                    <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/80">Swahili</span>
                  <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/80">24/7</span>
                  <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/80">Personalised</span>
                </div>
              </div>
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Workouts Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 to-transparent backdrop-blur-xl border border-orange-500/20 rounded-3xl p-5 hover:border-orange-500/40 transition-all group">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl"></div>
                <div className="relative space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                    <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-base text-white mb-1" style={{ fontWeight: 700 }}>Mazoezi</h4>
                    <p className="text-xs text-white/60 leading-relaxed">Progressive workouts</p>
                  </div>
                </div>
              </div>

              {/* Nutrition Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-pink-500/10 to-transparent backdrop-blur-xl border border-pink-500/20 rounded-3xl p-5 hover:border-pink-500/40 transition-all group">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl"></div>
                <div className="relative space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                    <Heart className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-base text-white mb-1" style={{ fontWeight: 700 }}>Lishe</h4>
                    <p className="text-xs text-white/60 leading-relaxed">Chakula cha Tanzania</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Three Column Grid */}
            <div className="grid grid-cols-3 gap-3">
              {/* Habits */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/8 transition-all">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto">
                    <Droplet className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-xs text-white text-center" style={{ fontWeight: 600 }}>Tabia</p>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/8 transition-all">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto">
                    <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-xs text-white text-center" style={{ fontWeight: 600 }}>Maendeleo</p>
                </div>
              </div>

              {/* Family */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/8 transition-all">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto">
                    <Users className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-xs text-white text-center" style={{ fontWeight: 600 }}>Familia</p>
                </div>
              </div>
            </div>

            {/* Value Proposition Banner */}
          </div>

          {/* CTA Section - Redesigned */}
          <div className="space-y-3 pt-2">
            <button
              onClick={onGetStarted}
              className="w-full relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#1EB53A] via-[#1EB53A] to-[#0F7A28] rounded-2xl opacity-100 group-hover:opacity-90 transition-opacity"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="relative py-5 flex items-center justify-center gap-2">
                <span className="text-lg text-white" style={{ fontWeight: 800 }}>Anza Safari Yako</span>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </button>
            
            <button
              onClick={onSignIn}
              className="w-full py-4 bg-white/5 backdrop-blur-xl border border-white/20 text-white rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all active:scale-[0.98]"
              style={{ fontWeight: 600 }}
            >
              Tayari una akaunti? <span className="text-[#1EB53A]">Ingia</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}