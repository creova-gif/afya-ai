import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLanguage: 'sw' | 'en';
  onLanguageChange: (lang: 'sw' | 'en') => void;
  compact?: boolean;
}

export function LanguageSwitcher({ currentLanguage, onLanguageChange, compact = false }: LanguageSwitcherProps) {
  if (compact) {
    // Compact version for header/nav
    return (
      <button
        onClick={() => onLanguageChange(currentLanguage === 'sw' ? 'en' : 'sw')}
        className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm" style={{ fontWeight: 600 }}>
          {currentLanguage === 'sw' ? '🇹🇿 SW' : '🇬🇧 EN'}
        </span>
      </button>
    );
  }

  // Full version for settings page
  return (
    <div className="relative p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg">
      {/* Animated sliding indicator with glow */}
      <div 
        className="absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] rounded-xl shadow-[0_4px_20px_rgba(30,181,58,0.5)] transition-all duration-500 ease-out"
        style={{ 
          left: currentLanguage === 'sw' ? '0.25rem' : 'calc(50% + 0.25rem)',
        }}
      />
      
      {/* Buttons */}
      <div className="relative grid grid-cols-2 gap-1">
        <button
          onClick={() => onLanguageChange('sw')}
          className={`py-3 px-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
            currentLanguage === 'sw' ? 'text-white' : 'text-white/60'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl transition-transform duration-300" style={{ 
              transform: currentLanguage === 'sw' ? 'scale(1.1)' : 'scale(1)' 
            }}>
              🇹🇿
            </span>
            <div className="text-left">
              <div className="text-sm" style={{ fontWeight: currentLanguage === 'sw' ? 700 : 600 }}>
                Kiswahili
              </div>
              <div className={`text-xs transition-colors duration-300 ${
                currentLanguage === 'sw' ? 'text-white/80' : 'text-white/40'
              }`}>
                Asili
              </div>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => onLanguageChange('en')}
          className={`py-3 px-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
            currentLanguage === 'en' ? 'text-white' : 'text-white/60'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl transition-transform duration-300" style={{ 
              transform: currentLanguage === 'en' ? 'scale(1.1)' : 'scale(1)' 
            }}>
              🇬🇧
            </span>
            <div className="text-left">
              <div className="text-sm" style={{ fontWeight: currentLanguage === 'en' ? 700 : 600 }}>
                English
              </div>
              <div className={`text-xs transition-colors duration-300 ${
                currentLanguage === 'en' ? 'text-white/80' : 'text-white/40'
              }`}>
                Global
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}