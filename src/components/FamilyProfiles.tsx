import { ArrowLeft, Plus, Users, User, Baby, Heart } from 'lucide-react';
import { useState } from 'react';
import { UserProfile } from '../App';

interface FamilyProfilesProps {
  profiles: UserProfile[];
  currentProfile: UserProfile | null;
  onAddProfile: (profile: UserProfile) => void;
  onSwitchProfile: (profileId: string) => void;
  onBack: () => void;
}

export function FamilyProfiles({ profiles, currentProfile, onAddProfile, onSwitchProfile, onBack }: FamilyProfilesProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    age: '',
    profileType: 'adult' as 'parent' | 'child' | 'elder' | 'teen' | 'adult',
  });

  const text = currentProfile?.language === 'sw' ? {
    family: 'Familia',
    members: 'Wanafamilia',
    addMember: 'Ongeza Mwanafamilia',
    switch: 'Badili',
    active: 'Hai',
    parent: 'Mzazi',
    child: 'Mtoto',
    teen: 'Kijana',
    adult: 'Mtu Mzima',
    elder: 'Mzee',
    name: 'Jina',
    age: 'Umri',
    type: 'Aina',
    save: 'Hifadhi',
    cancel: 'Ghairi',
  } : {
    family: 'Family',
    members: 'Family Members',
    addMember: 'Add Member',
    switch: 'Switch',
    active: 'Active',
    parent: 'Parent',
    child: 'Child',
    teen: 'Teen',
    adult: 'Adult',
    elder: 'Elder',
    name: 'Name',
    age: 'Age',
    type: 'Type',
    save: 'Save',
    cancel: 'Cancel',
  };

  const getProfileIcon = (type: string) => {
    switch (type) {
      case 'child': return <Baby className="w-8 h-8" strokeWidth={2.5} />;
      case 'elder': return <Heart className="w-8 h-8" strokeWidth={2.5} />;
      case 'parent': return <Users className="w-8 h-8" strokeWidth={2.5} />;
      default: return <User className="w-8 h-8" strokeWidth={2.5} />;
    }
  };

  const getProfileColor = (type: string) => {
    switch (type) {
      case 'child': return { gradient: 'from-[#FF6B35] to-[#E85A2A]', bg: 'from-[#FF6B35]/20 to-[#E85A2A]/10' };
      case 'elder': return { gradient: 'from-[#8B5CF6] to-[#7C3AED]', bg: 'from-[#8B5CF6]/20 to-[#7C3AED]/10' };
      case 'teen': return { gradient: 'from-[#00A3DD] to-[#0077A3]', bg: 'from-[#00A3DD]/20 to-[#0077A3]/10' };
      default: return { gradient: 'from-[#1EB53A] to-[#0F7A28]', bg: 'from-[#1EB53A]/20 to-[#0F7A28]/10' };
    }
  };

  const handleSaveProfile = () => {
    if (newProfile.name && newProfile.age) {
      const profile: UserProfile = {
        id: Date.now().toString(),
        name: newProfile.name,
        age: parseInt(newProfile.age),
        gender: 'other',
        language: currentProfile?.language || 'sw',
        location: currentProfile?.location || 'Dar es Salaam',
        height: 170,
        weight: 70,
        activityLevel: 'moderate',
        goals: [],
        environment: 'home',
        equipment: [],
        healthFlags: [],
        availableTimeMinutes: 30,
        profileType: newProfile.profileType,
        isPrimary: false,
      };
      onAddProfile(profile);
      setShowAddModal(false);
      setNewProfile({ name: '', age: '', profileType: 'adult' });
    }
  };

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
            <div className="flex-1">
              <h1 className="text-3xl text-white tracking-tight" style={{ fontWeight: 800 }}>
                {text.family}
              </h1>
              <p className="text-sm text-white/60 mt-1" style={{ fontWeight: 600 }}>
                {profiles.length} {text.members}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-6 h-6 text-white" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {profiles.map((profile) => {
          const isActive = currentProfile?.id === profile.id;
          const colors = getProfileColor(profile.profileType);

          return (
            <div
              key={profile.id}
              className={`bg-gradient-to-br ${colors.bg} backdrop-blur-xl border rounded-3xl p-6 transition-all ${
                isActive ? 'border-white/40 shadow-lg' : 'border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
                    {getProfileIcon(profile.profileType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl text-white" style={{ fontWeight: 700 }}>
                        {profile.name}
                      </h3>
                      {isActive && (
                        <span className="px-3 py-1 bg-[#1EB53A]/30 border border-[#1EB53A]/50 rounded-full text-xs text-white" style={{ fontWeight: 700 }}>
                          {text.active}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-white/60" style={{ fontWeight: 600 }}>
                        {profile.age} years
                      </span>
                      <span className="text-white/40">•</span>
                      <span className="text-sm text-white/60 capitalize" style={{ fontWeight: 600 }}>
                        {text[profile.profileType as keyof typeof text] || profile.profileType}
                      </span>
                    </div>
                  </div>
                </div>

                {!isActive && (
                  <button
                    onClick={() => onSwitchProfile(profile.id)}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white transition-all active:scale-95"
                    style={{ fontWeight: 700 }}
                  >
                    {text.switch}
                  </button>
                )}
              </div>

              {/* Profile stats preview */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl text-white mb-1" style={{ fontWeight: 700 }}>
                    {Math.floor(Math.random() * 20)}
                  </div>
                  <div className="text-xs text-white/60" style={{ fontWeight: 600 }}>Workouts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-white mb-1" style={{ fontWeight: 700 }}>
                    {Math.floor(Math.random() * 100) + 50}
                  </div>
                  <div className="text-xs text-white/60" style={{ fontWeight: 600 }}>Days active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-white mb-1" style={{ fontWeight: 700 }}>
                    {Math.floor(Math.random() * 10)}
                  </div>
                  <div className="text-xs text-white/60" style={{ fontWeight: 600 }}>Streak</div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {profiles.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-white/40 mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-white/60 text-lg" style={{ fontWeight: 600 }}>
              No family members yet
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-6 px-8 py-4 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] rounded-2xl text-white shadow-lg hover:shadow-xl transition-all active:scale-95"
              style={{ fontWeight: 700 }}
            >
              {text.addMember}
            </button>
          </div>
        )}
      </div>

      {/* Add Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#1C1C1E] rounded-t-3xl p-8">
            <h3 className="text-2xl text-white mb-6" style={{ fontWeight: 700 }}>
              {text.addMember}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2" style={{ fontWeight: 600 }}>
                  {text.name}
                </label>
                <input
                  type="text"
                  value={newProfile.name}
                  onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#1EB53A] transition-colors"
                  placeholder="Enter name"
                  style={{ fontWeight: 500 }}
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2" style={{ fontWeight: 600 }}>
                  {text.age}
                </label>
                <input
                  type="number"
                  value={newProfile.age}
                  onChange={(e) => setNewProfile({ ...newProfile, age: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#1EB53A] transition-colors"
                  placeholder="Enter age"
                  style={{ fontWeight: 500 }}
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2" style={{ fontWeight: 600 }}>
                  {text.type}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['child', 'teen', 'adult', 'elder'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setNewProfile({ ...newProfile, profileType: type })}
                      className={`py-3 rounded-xl border transition-all ${
                        newProfile.profileType === type
                          ? 'bg-[#1EB53A]/20 border-[#1EB53A]/50 text-white'
                          : 'bg-white/5 border-white/10 text-white/60'
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {text[type]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white transition-all active:scale-95"
                style={{ fontWeight: 700 }}
              >
                {text.cancel}
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-4 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] rounded-2xl text-white shadow-lg hover:shadow-xl transition-all active:scale-95"
                style={{ fontWeight: 700 }}
              >
                {text.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
