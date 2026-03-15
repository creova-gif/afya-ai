import { ArrowLeft, User, Globe, Bell, Shield, Info, ChevronRight, LogOut, Crown, Users as UsersIcon } from 'lucide-react';
import { UserProfile, Screen } from '../App';
import { LanguageSwitcher } from './LanguageSwitcher';

interface SettingsProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onBack: () => void;
  onLogout: () => void;
  onNavigate?: (screen: Screen) => void;
}

export function Settings({ profile, onUpdateProfile, onBack, onLogout, onNavigate }: SettingsProps) {
  const text = profile.language === 'sw' ? {
    settings: 'Mipangilio',
    profile: 'Wasifu',
    language: 'Lugha',
    notifications: 'Arifa',
    privacy: 'Faragha',
    about: 'Kuhusu',
    name: 'Jina',
    age: 'Umri',
    location: 'Eneo',
    goals: 'Malengo',
    editProfile: 'Hariri Wasifu',
    version: 'Toleo',
    subscription: 'Usajili',
    premium: 'Premium',
    social: 'Ushindani',
    friends: 'Marafiki & Changamoto',
  } : {
    settings: 'Settings',
    profile: 'Profile',
    language: 'Language',
    notifications: 'Notifications',
    privacy: 'Privacy',
    about: 'About',
    name: 'Name',
    age: 'Age',
    location: 'Location',
    goals: 'Goals',
    editProfile: 'Edit Profile',
    version: 'Version',
    subscription: 'Subscription',
    premium: 'Premium',
    social: 'Social',
    friends: 'Friends & Challenges',
  };

  const settingsSections = [
    {
      title: text.profile,
      items: [
        { icon: <User className="w-5 h-5" />, label: text.name, value: profile.name },
        { icon: <User className="w-5 h-5" />, label: text.age, value: `${profile.age} years` },
        { icon: <Globe className="w-5 h-5" />, label: text.location, value: profile.location },
      ]
    },
    {
      title: 'App',
      items: [
        { icon: <Globe className="w-5 h-5" />, label: text.language, value: profile.language === 'sw' ? 'Kiswahili' : 'English' },
        { icon: <Bell className="w-5 h-5" />, label: text.notifications, value: 'Enabled' },
        { icon: <Shield className="w-5 h-5" />, label: text.privacy, value: 'Protected' },
      ]
    },
    {
      title: text.about,
      items: [
        { icon: <Info className="w-5 h-5" />, label: text.version, value: '1.0.0' },
      ]
    }
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
            <h1 className="text-3xl text-white tracking-tight flex-1" style={{ fontWeight: 800 }}>
              {text.settings}
            </h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-[#1EB53A]/20 to-[#0F7A28]/10 backdrop-blur-xl border border-[#1EB53A]/30 rounded-3xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl text-white mb-1" style={{ fontWeight: 700 }}>
                {profile.name}
              </h2>
              <p className="text-sm text-white/60" style={{ fontWeight: 600 }}>
                {profile.location} • {profile.age} years
              </p>
            </div>
          </div>

          {/* Goals */}
          {profile.goals.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-white/60" style={{ fontWeight: 600 }}>{text.goals}</p>
              <div className="flex flex-wrap gap-2">
                {profile.goals.map((goal, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm text-white"
                    style={{ fontWeight: 600 }}
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            <h3 className="text-sm text-white/60 px-1 mb-3" style={{ fontWeight: 700 }}>
              {section.title}
            </h3>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
              {section.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  className={`w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-colors ${
                    itemIdx < section.items.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                    {item.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-base text-white" style={{ fontWeight: 600 }}>
                      {item.label}
                    </div>
                    <div className="text-sm text-white/60" style={{ fontWeight: 500 }}>
                      {item.value}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Language Switcher */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-base text-white" style={{ fontWeight: 600 }}>
                {text.language}
              </span>
            </div>
            <LanguageSwitcher
              currentLanguage={profile.language}
              onLanguageChange={(lang) => onUpdateProfile({ ...profile, language: lang })}
            />
          </div>
        </div>

        {/* Subscription & Social */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
          {/* Subscription */}
          <button
            onClick={() => onNavigate?.('subscription')}
            className="w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-colors border-b border-white/5"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white">
              <Crown className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-base text-white" style={{ fontWeight: 600 }}>
                {text.subscription}
              </div>
              <div className="text-sm text-white/60" style={{ fontWeight: 500 }}>
                {text.premium}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/40" />
          </button>

          {/* Social */}
          <button
            onClick={() => onNavigate?.('social')}
            className="w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
              <UsersIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-base text-white" style={{ fontWeight: 600 }}>
                {text.social}
              </div>
              <div className="text-sm text-white/60" style={{ fontWeight: 500 }}>
                {text.friends}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/40" />
          </button>
        </div>

        {/* Logout Button */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-base text-white" style={{ fontWeight: 600 }}>
                Logout
              </div>
            </div>
          </button>
        </div>

        {/* App Info */}
        <div className="text-center pt-8">
          <p className="text-white/40 text-sm mb-2" style={{ fontWeight: 600 }}>
            KUIMARISHA AI
          </p>
          <p className="text-white/30 text-xs" style={{ fontWeight: 500 }}>
            Made with ❤️ for Tanzania 🇹🇿
          </p>
          <p className="text-white/20 text-xs mt-2">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}