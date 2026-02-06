interface LanguageToggleProps {
  currentLanguage: 'sw' | 'en';
  onToggle: () => void;
  className?: string;
}

export function LanguageToggle({ currentLanguage, onToggle, className = '' }: LanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all ${className}`}
      aria-label={`Switch to ${currentLanguage === 'sw' ? 'English' : 'Kiswahili'}`}
    >
      {/* Animated background pill */}
      <div 
        className="absolute inset-0.5 w-[calc(50%-0.25rem)] bg-white rounded-full shadow-sm transition-all duration-300 ease-out"
        style={{
          left: currentLanguage === 'sw' ? '0.25rem' : 'calc(50% + 0.25rem)',
        }}
      />
      
      {/* Language options */}
      <span 
        className={`relative z-10 text-xs transition-all duration-300 ${
          currentLanguage === 'sw' ? 'text-[#1EB53A]' : 'text-white/70'
        }`}
        style={{ fontWeight: currentLanguage === 'sw' ? 600 : 400 }}
      >
        🇹🇿 SW
      </span>
      <span 
        className={`relative z-10 text-xs transition-all duration-300 ${
          currentLanguage === 'en' ? 'text-[#1EB53A]' : 'text-white/70'
        }`}
        style={{ fontWeight: currentLanguage === 'en' ? 600 : 400 }}
      >
        🇬🇧 EN
      </span>
    </button>
  );
}
