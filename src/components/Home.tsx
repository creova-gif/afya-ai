import { Activity, Sparkles, Heart, Zap } from 'lucide-react';

interface HomeProps {
  onGetStarted: () => void;
}

export function Home({ onGetStarted }: HomeProps) {
  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1EB53A]/20 via-[#000000] to-[#00A3DD]/20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1EB53A]/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00A3DD]/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm mx-auto space-y-12">
          {/* Logo & Hero */}
          <div className="text-center space-y-6">
            {/* Animated icon */}
            <div className="relative">
              <div className="w-28 h-28 mx-auto bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_60px_rgba(30,181,58,0.6)] animate-bounce" style={{ animationDuration: '3s' }}>
                <Activity className="w-14 h-14 text-white" strokeWidth={2.5} />
              </div>
              {/* Glow rings */}
              <div className="absolute inset-0 w-28 h-28 mx-auto rounded-[2.5rem] border-2 border-[#1EB53A]/40 scale-110 animate-ping" style={{ animationDuration: '2s' }}></div>
              <div className="absolute inset-0 w-28 h-28 mx-auto rounded-[2.5rem] border-2 border-[#00A3DD]/40 scale-125 animate-ping" style={{ animationDuration: '3s' }}></div>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h1 className="text-5xl text-white tracking-tight" style={{ fontWeight: 800 }}>
                Kuimarisha
              </h1>
              <p className="text-2xl text-white/60" style={{ fontWeight: 600 }}>
                AI Coach wa Kiswahili
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-white/40">
                <Sparkles className="w-4 h-4" />
                <span>Powered by AI • Made for Tanzania</span>
              </div>
            </div>
          </div>

          {/* Feature highlights - Apple Health style */}
          <div className="space-y-3">
            {/* Activity Ring Style */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] flex items-center justify-center shadow-lg">
                  <Activity className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg text-white" style={{ fontWeight: 700 }}>
                    Mazoezi Yanayobadilika
                  </h3>
                  <p className="text-sm text-white/60" style={{ fontWeight: 500 }}>
                    Workouts zinazoenda kuwa vigumu zaidi
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] flex items-center justify-center shadow-lg">
                  <Heart className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg text-white" style={{ fontWeight: 700 }}>
                    Chakula cha Tanzania
                  </h3>
                  <p className="text-sm text-white/60" style={{ fontWeight: 500 }}>
                    Ugali, wali, dagaa - vyote vinahesabika
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00A3DD] to-[#0077A3] flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg text-white" style={{ fontWeight: 700 }}>
                    AI Coach Maalum
                  </h3>
                  <p className="text-sm text-white/60" style={{ fontWeight: 500 }}>
                    Mshauri wako wa kibinafsi wa Kiswahili
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA - Apple style big button */}
          <div className="space-y-4 pt-4">
            <button
              onClick={onGetStarted}
              className="w-full py-5 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] text-white rounded-2xl shadow-[0_10px_40px_rgba(30,181,58,0.5)] hover:shadow-[0_15px_50px_rgba(30,181,58,0.6)] transition-all text-lg active:scale-[0.98]"
              style={{ fontWeight: 700 }}
            >
              Anza Sasa
            </button>
            <p className="text-center text-sm text-white/40" style={{ fontWeight: 500 }}>
              Bila malipo • Bila kadi ya benki
            </p>
          </div>

          {/* Trust badges - minimal */}
          <div className="flex items-center justify-center gap-6 pt-6 border-t border-white/5">
            <div className="text-center">
              <div className="text-2xl text-white" style={{ fontWeight: 700 }}>10K+</div>
              <div className="text-xs text-white/40" style={{ fontWeight: 500 }}>Watumiaji</div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <div className="text-2xl text-white" style={{ fontWeight: 700 }}>4.9★</div>
              <div className="text-xs text-white/40" style={{ fontWeight: 500 }}>Ukadiriaji</div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <div className="text-2xl text-white" style={{ fontWeight: 700 }}>🇹🇿</div>
              <div className="text-xs text-white/40" style={{ fontWeight: 500 }}>Tanzania</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}