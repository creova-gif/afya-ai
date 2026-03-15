import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, Activity, Utensils, MessageCircle, Users, Target, Heart, Zap, Sparkles, MapPin, User, Mail, Phone, Apple as AppleIcon, Globe } from 'lucide-react';
import { UserProfile } from '../App';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

type OnboardingStep = 'welcome' | 'slides' | 'signup' | 'personal' | 'goals' | 'metrics' | 'preferences' | 'privacy' | 'success';

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [slideIndex, setSlideIndex] = useState(0);
  const [language, setLanguage] = useState<'sw' | 'en'>('sw');
  const [showCelebration, setShowCelebration] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'male' as 'male' | 'female' | 'other',
    location: 'Dar es Salaam',
    height: 170,
    weight: 70,
    activityLevel: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
    goals: [] as string[],
    environment: 'home' as 'home' | 'gym' | 'school',
    availableTimeMinutes: 30,
    notifications: true,
    dataConsent: false,
    password: '', // Add password field
  });

  const text = language === 'sw' ? {
    // Welcome
    tagline: 'Afya Yako, Safari Yako',
    subtitle: 'AI Coach wa Kiswahili kwa Afya na Fitness',
    getStarted: 'Anza Safari Yako',
    
    // Slides
    slide1Title: 'Mazoezi Yako, Njia Yako',
    slide1Desc: 'Fuatilia mazoezi yako kwa urahisi na AI coach inayojifunza kutoka kwako',
    slide2Title: 'Kula Vizuri, Ishi Vizuri',
    slide2Desc: 'Vyakula vya Tanzania vilivyohesabika - ugali, wali, dagaa, na zaidi',
    slide3Title: 'AI Coach Maalum',
    slide3Desc: 'Mshauri wako wa kibinafsi anayezungumza Kiswahili',
    slide4Title: 'Familia Yote Pamoja',
    slide4Desc: 'Profiles za watoto, wazima, na wazee - kila mtu ana mpango wake',
    next: 'Endelea',
    skip: 'Ruka',
    
    // Signup
    signupTitle: 'Karibu! 👋',
    signupSubtitle: 'Je, unapendelea kujiandikisha vipi?',
    continueWithPhone: 'Endelea na Simu',
    continueWithEmail: 'Endelea na Barua Pepe',
    continueWithGoogle: 'Endelea na Google',
    continueWithApple: 'Endelea na Apple',
    orSkip: 'Au ruka kwa sasa',
    
    // Personal
    personalTitle: 'Tuambie Kukufahamu',
    name: 'Jina Lako',
    email: 'Barua Pepe',
    phone: 'Namba ya Simu',
    age: 'Umri',
    gender: 'Jinsia',
    male: 'Mwanaume',
    female: 'Mwanamke',
    other: 'Nyingine',
    location: 'Eneo',
    
    // Goals
    goalsTitle: 'Malengo Yako?',
    goalsSubtitle: 'Chagua yote yanayofaa (angalau moja)',
    weightLoss: 'Punguza Uzito',
    buildMuscle: 'Jenga Misuli',
    stayFit: 'Endelea Kuwa Fit',
    improveHealth: 'Boresha Afya',
    stressRelief: 'Punguza Stress',
    familyFitness: 'Afya ya Familia',
    
    // Metrics
    metricsTitle: 'Vipimo Vyako',
    height: 'Urefu',
    weight: 'Uzito',
    activityLevel: 'Kiwango cha Shughuli',
    sedentary: 'Kukaa Sana',
    light: 'Shughuli Kidogo',
    moderate: 'Wastani',
    active: 'Shughuli Nyingi',
    veryActive: 'Shughuli Sana',
    
    // Preferences
    preferencesTitle: 'Mapendeleo Yako',
    environment: 'Mahali pa Kufanyia Mazoezi',
    home: 'Nyumbani',
    gym: 'Gym',
    school: 'Shule',
    timeAvailable: 'Muda Uliopo',
    minutes: 'dakika kwa siku',
    
    // Privacy
    privacyTitle: 'Faragha & Usalama',
    privacySubtitle: 'Data yako ni salama na yako wewe',
    notifications: 'Arifa za Mazoezi',
    notificationsDesc: 'Kupokea kumbusho za mazoezi na msaada',
    dataConsent: 'Ridhaa ya Data',
    dataConsentDesc: 'Nakubali sheria za faragha na matumizi ya data',
    privacyNote: 'Tunathamini faragha yako. Data yako haitashirikiwa bila idhini yako.',
    
    // Success
    successTitle: 'Hongera! 🎉',
    successSubtitle: 'Uko tayari kuanza safari yako ya afya',
    enterApp: 'Ingia App',
    
    // Common
    back: 'Rudi',
    continue: 'Endelea',
  } : {
    // Welcome
    tagline: 'Your Health, Your Journey',
    subtitle: 'AI-Powered Swahili Coach for Health & Fitness',
    getStarted: 'Get Started',
    
    // Slides
    slide1Title: 'Your Workouts, Your Way',
    slide1Desc: 'Track workouts effortlessly with AI that learns from you',
    slide2Title: 'Eat Well, Live Well',
    slide2Desc: 'Tanzanian foods tracked - ugali, rice, dagaa, and more',
    slide3Title: 'Personal AI Coach',
    slide3Desc: 'Your personalized advisor speaking Swahili',
    slide4Title: 'Whole Family Together',
    slide4Desc: 'Profiles for kids, adults, and elders - everyone has a plan',
    next: 'Next',
    skip: 'Skip',
    
    // Signup
    signupTitle: 'Welcome! 👋',
    signupSubtitle: 'How would you like to sign up?',
    continueWithPhone: 'Continue with Phone',
    continueWithEmail: 'Continue with Email',
    continueWithGoogle: 'Continue with Google',
    continueWithApple: 'Continue with Apple',
    orSkip: 'Or skip for now',
    
    // Personal
    personalTitle: 'Tell Us About You',
    name: 'Your Name',
    email: 'Email Address',
    phone: 'Phone Number',
    age: 'Age',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    location: 'Location',
    
    // Goals
    goalsTitle: 'What Are Your Goals?',
    goalsSubtitle: 'Select all that apply (at least one)',
    weightLoss: 'Lose Weight',
    buildMuscle: 'Build Muscle',
    stayFit: 'Stay Fit',
    improveHealth: 'Improve Health',
    stressRelief: 'Reduce Stress',
    familyFitness: 'Family Fitness',
    
    // Metrics
    metricsTitle: 'Your Metrics',
    height: 'Height',
    weight: 'Weight',
    activityLevel: 'Activity Level',
    sedentary: 'Sedentary',
    light: 'Light Activity',
    moderate: 'Moderate',
    active: 'Very Active',
    veryActive: 'Extremely Active',
    
    // Preferences
    preferencesTitle: 'Your Preferences',
    environment: 'Workout Environment',
    home: 'Home',
    gym: 'Gym',
    school: 'School',
    timeAvailable: 'Time Available',
    minutes: 'minutes per day',
    
    // Privacy
    privacyTitle: 'Privacy & Security',
    privacySubtitle: 'Your data is safe and yours',
    notifications: 'Workout Notifications',
    notificationsDesc: 'Receive reminders and workout assistance',
    dataConsent: 'Data Consent',
    dataConsentDesc: 'I agree to privacy policy and data usage',
    privacyNote: 'We value your privacy. Your data will not be shared without consent.',
    
    // Success
    successTitle: 'Congratulations! 🎉',
    successSubtitle: 'You\'re ready to start your health journey',
    enterApp: 'Enter App',
    
    // Common
    back: 'Back',
    continue: 'Continue',
  };

  const slides = [
    {
      icon: <Activity className="w-20 h-20" strokeWidth={2.5} />,
      gradient: 'from-[#1EB53A] to-[#0F7A28]',
      title: text.slide1Title,
      description: text.slide1Desc,
      emoji: '💪',
      image: '🏃‍♂️',
    },
    {
      icon: <Utensils className="w-20 h-20" strokeWidth={2.5} />,
      gradient: 'from-[#FF6B35] to-[#E85A2A]',
      title: text.slide2Title,
      description: text.slide2Desc,
      emoji: '🍽️',
      image: '🥘',
    },
    {
      icon: <MessageCircle className="w-20 h-20" strokeWidth={2.5} />,
      gradient: 'from-[#00A3DD] to-[#0077A3]',
      title: text.slide3Title,
      description: text.slide3Desc,
      emoji: '🤖',
      image: '💬',
    },
    {
      icon: <Users className="w-20 h-20" strokeWidth={2.5} />,
      gradient: 'from-[#8B5CF6] to-[#7C3AED]',
      title: text.slide4Title,
      description: text.slide4Desc,
      emoji: '👨‍👩‍👧‍👦',
      image: '❤️',
    },
  ];

  const goals = [
    { id: 'weight_loss', label: text.weightLoss, icon: <Target className="w-6 h-6" />, emoji: '🎯' },
    { id: 'build_muscle', label: text.buildMuscle, icon: <Zap className="w-6 h-6" />, emoji: '💪' },
    { id: 'stay_fit', label: text.stayFit, icon: <Activity className="w-6 h-6" />, emoji: '🏃' },
    { id: 'improve_health', label: text.improveHealth, icon: <Heart className="w-6 h-6" />, emoji: '❤️' },
    { id: 'stress_relief', label: text.stressRelief, icon: <Sparkles className="w-6 h-6" />, emoji: '😌' },
    { id: 'family_fitness', label: text.familyFitness, icon: <Users className="w-6 h-6" />, emoji: '👨‍👩‍👧' },
  ];

  const locations = ['Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 'Mbeya', 'Zanzibar', 'Tanga', 'Morogoro'];

  const handleComplete = () => {
    if (!formData.name || formData.goals.length === 0 || !formData.dataConsent) {
      return;
    }

    const profile: UserProfile = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      age: parseInt(formData.age) || 25,
      gender: formData.gender,
      language,
      location: formData.location,
      height: formData.height,
      weight: formData.weight,
      activityLevel: formData.activityLevel,
      goals: formData.goals,
      environment: formData.environment,
      equipment: [],
      healthFlags: [],
      availableTimeMinutes: formData.availableTimeMinutes,
      dailyCalorieTarget: 2000,
      workoutIntensity: 'beginner',
      isPrimary: true,
      profileType: 'adult',
    };

    onComplete(profile);
  };

  useEffect(() => {
    if (step === 'success') {
      setShowCelebration(true);
    }
  }, [step]);

  // Welcome Screen
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0A1F0F] to-[#000000] relative overflow-hidden flex items-center justify-center">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#1EB53A]/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#00A3DD]/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6B35]/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Language switcher */}
        <div className="absolute top-6 right-6 z-50">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-1">
            <button
              onClick={() => setLanguage('sw')}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                language === 'sw'
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white'
              }`}
              style={{ fontWeight: 700 }}
            >
              SW
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                language === 'en'
                  ? 'bg-white text-black'
                  : 'text-white/60 hover:text-white'
              }`}
              style={{ fontWeight: 700 }}
            >
              EN
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-md">
          {/* Animated Logo */}
          <div className="relative mb-12">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] rounded-[2.5rem] flex items-center justify-center shadow-[0_30px_80px_rgba(30,181,58,0.6)] animate-bounce" style={{ animationDuration: '3s' }}>
              <Activity className="w-16 h-16 text-white" strokeWidth={2.5} />
            </div>
            
            {/* Glow rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-[2.5rem] border-2 border-[#1EB53A]/40 scale-110 animate-ping" style={{ animationDuration: '2s' }}></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-[2.5rem] border-2 border-[#00A3DD]/40 scale-125 animate-ping" style={{ animationDuration: '3s' }}></div>
            </div>
          </div>

          {/* Title with animation */}
          <h1 className="text-6xl text-white mb-4 tracking-tight animate-fade-in" style={{ fontWeight: 900 }}>
            Kuimarisha
          </h1>
          
          <p className="text-2xl text-white/80 mb-3 animate-fade-in" style={{ fontWeight: 600, animationDelay: '0.2s' }}>
            {text.tagline}
          </p>
          
          <p className="text-base text-white/60 mb-12 animate-fade-in" style={{ fontWeight: 500, animationDelay: '0.4s' }}>
            {text.subtitle}
          </p>

          {/* CTA Button */}
          <button
            onClick={() => setStep('slides')}
            className="w-full py-5 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] text-white rounded-2xl shadow-[0_20px_60px_rgba(30,181,58,0.5)] hover:shadow-[0_25px_70px_rgba(30,181,58,0.6)] hover:scale-105 active:scale-[0.98] transition-all text-lg animate-fade-in"
            style={{ fontWeight: 800, animationDelay: '0.6s' }}
          >
            {text.getStarted} 🚀
          </button>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="text-center">
              <div className="text-xl text-white" style={{ fontWeight: 700 }}>10K+</div>
              <div className="text-xs text-white/40">Users</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-xl text-white" style={{ fontWeight: 700 }}>4.9★</div>
              <div className="text-xs text-white/40">Rating</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-xl text-white" style={{ fontWeight: 700 }}>🇹🇿</div>
              <div className="text-xs text-white/40">Tanzania</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Slides Screen
  if (step === 'slides') {
    const currentSlide = slides[slideIndex];
    
    return (
      <div className="min-h-screen bg-[#000000] flex flex-col">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 pt-8 pb-6">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === slideIndex
                  ? 'w-8 bg-[#1EB53A]'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Slide content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          {/* Animated icon */}
          <div className={`w-40 h-40 mx-auto mb-8 bg-gradient-to-br ${currentSlide.gradient} rounded-[3rem] flex items-center justify-center shadow-[0_20px_60px_rgba(30,181,58,0.4)] animate-scale-in`}>
            {currentSlide.icon}
          </div>

          {/* Emoji decoration */}
          <div className="text-6xl mb-6 animate-bounce-gentle">{currentSlide.emoji}</div>

          {/* Title */}
          <h2 className="text-4xl text-white mb-4 px-4 animate-slide-up" style={{ fontWeight: 800 }}>
            {currentSlide.title}
          </h2>

          {/* Description */}
          <p className="text-lg text-white/70 mb-8 px-8 leading-relaxed animate-slide-up" style={{ fontWeight: 500, animationDelay: '0.2s' }}>
            {currentSlide.description}
          </p>

          {/* Image emoji */}
          <div className="text-8xl animate-float">{currentSlide.image}</div>
        </div>

        {/* Navigation */}
        <div className="p-6 space-y-3">
          {slideIndex < slides.length - 1 ? (
            <>
              <button
                onClick={() => setSlideIndex(slideIndex + 1)}
                className="w-full py-5 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] text-white rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-2"
                style={{ fontWeight: 700 }}
              >
                {text.next}
                <ChevronRight className="w-5 h-5" strokeWidth={3} />
              </button>
              <button
                onClick={() => setStep('signup')}
                className="w-full py-4 text-white/60 hover:text-white transition-colors text-base"
                style={{ fontWeight: 600 }}
              >
                {text.skip}
              </button>
            </>
          ) : (
            <button
              onClick={() => setStep('signup')}
              className="w-full py-5 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] text-white rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-2"
              style={{ fontWeight: 700 }}
            >
              {text.getStarted}
              <ChevronRight className="w-5 h-5" strokeWidth={3} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Signup Options Screen
  if (step === 'signup') {
    return (
      <div className="min-h-screen bg-[#000000] flex flex-col justify-between p-6">
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-5xl text-white mb-3 text-center animate-fade-in" style={{ fontWeight: 800 }}>
            {text.signupTitle}
          </h1>
          <p className="text-lg text-white/60 mb-12 text-center animate-fade-in" style={{ fontWeight: 500, animationDelay: '0.2s' }}>
            {text.signupSubtitle}
          </p>

          <div className="w-full max-w-sm space-y-4">
            {/* Phone signup */}
            <button
              onClick={() => setStep('personal')}
              className="w-full py-5 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] text-white rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 animate-fade-in"
              style={{ fontWeight: 700, animationDelay: '0.3s' }}
            >
              <Phone className="w-5 h-5" strokeWidth={2.5} />
              {text.continueWithPhone}
            </button>

            {/* Email signup */}
            <button
              onClick={() => setStep('personal')}
              className="w-full py-5 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl hover:bg-white/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 animate-fade-in"
              style={{ fontWeight: 700, animationDelay: '0.4s' }}
            >
              <Mail className="w-5 h-5" strokeWidth={2.5} />
              {text.continueWithEmail}
            </button>

            {/* Social logins */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('personal')}
                className="flex-1 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl hover:bg-white/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 animate-fade-in"
                style={{ fontWeight: 700, animationDelay: '0.5s' }}
              >
                <Globe className="w-5 h-5" strokeWidth={2.5} />
                Google
              </button>
              <button
                onClick={() => setStep('personal')}
                className="flex-1 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl hover:bg-white/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 animate-fade-in"
                style={{ fontWeight: 700, animationDelay: '0.6s' }}
              >
                <AppleIcon className="w-5 h-5" strokeWidth={2.5} />
                Apple
              </button>
            </div>
          </div>

          <button
            onClick={() => setStep('personal')}
            className="mt-8 text-white/60 hover:text-white transition-colors text-base animate-fade-in"
            style={{ fontWeight: 600, animationDelay: '0.7s' }}
          >
            {text.orSkip}
          </button>
        </div>
      </div>
    );
  }

  // Personal Info Screen
  if (step === 'personal') {
    return (
      <div className="min-h-screen bg-[#000000] flex flex-col">
        {/* Header */}
        <div className="px-6 py-6">
          <button
            onClick={() => setStep('signup')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
          
          <h1 className="text-4xl text-white mb-3" style={{ fontWeight: 800 }}>
            {text.personalTitle}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] rounded-full"></div>
        </div>

        {/* Form */}
        <div className="flex-1 px-6 space-y-5 overflow-y-auto pb-32">
          {/* Name */}
          <div>
            <label className="block text-sm text-white/60 mb-2" style={{ fontWeight: 600 }}>
              {text.name}
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#1EB53A] transition-colors"
                style={{ fontWeight: 600 }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-white/60 mb-2" style={{ fontWeight: 600 }}>
              {text.email}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#1EB53A] transition-colors"
                style={{ fontWeight: 600 }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-white/60 mb-2" style={{ fontWeight: 600 }}>
              {language === 'sw' ? 'Neno la Siri' : 'Password'}
            </label>
            <div className="relative">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={language === 'sw' ? 'Angalau herufi 6' : 'Minimum 6 characters'}
                minLength={6}
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#1EB53A] transition-colors"
                style={{ fontWeight: 600 }}
                required
              />
            </div>
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2" style={{ fontWeight: 600 }}>
                {text.age}
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="25"
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#1EB53A] transition-colors"
                style={{ fontWeight: 600 }}
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2" style={{ fontWeight: 600 }}>
                {text.gender}
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white focus:outline-none focus:border-[#1EB53A] transition-colors appearance-none"
                style={{ fontWeight: 600 }}
              >
                <option value="male" className="bg-[#1C1C1E]">{text.male}</option>
                <option value="female" className="bg-[#1C1C1E]">{text.female}</option>
                <option value="other" className="bg-[#1C1C1E]">{text.other}</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm text-white/60 mb-2" style={{ fontWeight: 600 }}>
              {text.location}
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white focus:outline-none focus:border-[#1EB53A] transition-colors appearance-none"
                style={{ fontWeight: 600 }}
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc} className="bg-[#1C1C1E]">{loc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Continue button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#000000] via-[#000000] to-transparent">
          <button
            onClick={() => setStep('goals')}
            disabled={!formData.name || !formData.age}
            className="w-full py-5 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] text-white rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
            style={{ fontWeight: 700 }}
          >
            {text.continue}
            <ChevronRight className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
      </div>
    );
  }

  // Goals Screen
  if (step === 'goals') {
    const toggleGoal = (goalId: string) => {
      setFormData({
        ...formData,
        goals: formData.goals.includes(goalId)
          ? formData.goals.filter(g => g !== goalId)
          : [...formData.goals, goalId]
      });
    };

    return (
      <div className="min-h-screen bg-[#000000] flex flex-col">
        {/* Header */}
        <div className="px-6 py-6">
          <button
            onClick={() => setStep('personal')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
          
          <h1 className="text-4xl text-white mb-3" style={{ fontWeight: 800 }}>
            {text.goalsTitle}
          </h1>
          <p className="text-base text-white/60 mb-4" style={{ fontWeight: 500 }}>
            {text.goalsSubtitle}
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] rounded-full"></div>
        </div>

        {/* Goals grid */}
        <div className="flex-1 px-6 pb-32 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {goals.map((goal) => {
              const isSelected = formData.goals.includes(goal.id);
              
              return (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-6 rounded-3xl border-2 transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#1EB53A]/30 to-[#0F7A28]/20 border-[#1EB53A]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="text-4xl mb-3">{goal.emoji}</div>
                  <div className={`text-sm text-center ${isSelected ? 'text-white' : 'text-white/70'}`} style={{ fontWeight: 700 }}>
                    {goal.label}
                  </div>
                  
                  {isSelected && (
                    <div className="mt-3 w-6 h-6 mx-auto rounded-full bg-[#1EB53A] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Continue button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#000000] via-[#000000] to-transparent">
          <button
            onClick={() => setStep('metrics')}
            disabled={formData.goals.length === 0}
            className="w-full py-5 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] text-white rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
            style={{ fontWeight: 700 }}
          >
            {text.continue}
            <ChevronRight className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
      </div>
    );
  }

  // Metrics Screen
  if (step === 'metrics') {
    return (
      <div className="min-h-screen bg-[#000000] flex flex-col">
        {/* Header */}
        <div className="px-6 py-6">
          <button
            onClick={() => setStep('goals')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
          
          <h1 className="text-4xl text-white mb-3" style={{ fontWeight: 800 }}>
            {text.metricsTitle}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] rounded-full"></div>
        </div>

        {/* Form */}
        <div className="flex-1 px-6 space-y-6 overflow-y-auto pb-32">
          {/* Height slider */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-base text-white" style={{ fontWeight: 700 }}>
                {text.height}
              </label>
              <span className="text-2xl text-white" style={{ fontWeight: 800 }}>
                {formData.height} cm
              </span>
            </div>
            <input
              type="range"
              min="140"
              max="220"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider-green"
            />
          </div>

          {/* Weight slider */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-base text-white" style={{ fontWeight: 700 }}>
                {text.weight}
              </label>
              <span className="text-2xl text-white" style={{ fontWeight: 800 }}>
                {formData.weight} kg
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="150"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) })}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider-orange"
            />
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-sm text-white/60 mb-3" style={{ fontWeight: 600 }}>
              {text.activityLevel}
            </label>
            <div className="space-y-2">
              {(['sedentary', 'light', 'moderate', 'active', 'very_active'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setFormData({ ...formData, activityLevel: level })}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                    formData.activityLevel === level
                      ? 'bg-gradient-to-br from-[#1EB53A]/30 to-[#0F7A28]/20 border-[#1EB53A]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className={`text-base ${formData.activityLevel === level ? 'text-white' : 'text-white/70'}`} style={{ fontWeight: 700 }}>
                    {text[level as keyof typeof text]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Continue button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#000000] via-[#000000] to-transparent">
          <button
            onClick={() => setStep('preferences')}
            className="w-full py-5 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] text-white rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-2"
            style={{ fontWeight: 700 }}
          >
            {text.continue}
            <ChevronRight className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
      </div>
    );
  }

  // Preferences Screen
  if (step === 'preferences') {
    return (
      <div className="min-h-screen bg-[#000000] flex flex-col">
        {/* Header */}
        <div className="px-6 py-6">
          <button
            onClick={() => setStep('metrics')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
          
          <h1 className="text-4xl text-white mb-3" style={{ fontWeight: 800 }}>
            {text.preferencesTitle}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] rounded-full"></div>
        </div>

        {/* Form */}
        <div className="flex-1 px-6 space-y-6 overflow-y-auto pb-32">
          {/* Environment */}
          <div>
            <label className="block text-sm text-white/60 mb-3" style={{ fontWeight: 600 }}>
              {text.environment}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['home', 'gym', 'school'] as const).map((env) => (
                <button
                  key={env}
                  onClick={() => setFormData({ ...formData, environment: env })}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    formData.environment === env
                      ? 'bg-gradient-to-br from-[#1EB53A]/30 to-[#0F7A28]/20 border-[#1EB53A]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="text-3xl mb-2">
                    {env === 'home' ? '🏠' : env === 'gym' ? '💪' : '🎓'}
                  </div>
                  <span className={`text-sm ${formData.environment === env ? 'text-white' : 'text-white/70'}`} style={{ fontWeight: 700 }}>
                    {text[env]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Available */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-base text-white" style={{ fontWeight: 700 }}>
                {text.timeAvailable}
              </label>
              <span className="text-2xl text-white" style={{ fontWeight: 800 }}>
                {formData.availableTimeMinutes}
              </span>
            </div>
            <p className="text-sm text-white/60 mb-4">{text.minutes}</p>
            <input
              type="range"
              min="10"
              max="120"
              step="10"
              value={formData.availableTimeMinutes}
              onChange={(e) => setFormData({ ...formData, availableTimeMinutes: parseInt(e.target.value) })}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider-blue"
            />
            <div className="flex justify-between mt-2 text-xs text-white/40">
              <span>10 min</span>
              <span>60 min</span>
              <span>120 min</span>
            </div>
          </div>
        </div>

        {/* Continue button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#000000] via-[#000000] to-transparent">
          <button
            onClick={() => setStep('privacy')}
            className="w-full py-5 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] text-white rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-2"
            style={{ fontWeight: 700 }}
          >
            {text.continue}
            <ChevronRight className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
      </div>
    );
  }

  // Privacy Screen
  if (step === 'privacy') {
    return (
      <div className="min-h-screen bg-[#000000] flex flex-col">
        {/* Header */}
        <div className="px-6 py-6">
          <button
            onClick={() => setStep('preferences')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
          
          <h1 className="text-4xl text-white mb-3" style={{ fontWeight: 800 }}>
            {text.privacyTitle}
          </h1>
          <p className="text-base text-white/60 mb-4" style={{ fontWeight: 500 }}>
            {text.privacySubtitle}
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] rounded-full"></div>
        </div>

        {/* Options */}
        <div className="flex-1 px-6 space-y-4 overflow-y-auto pb-32">
          {/* Notifications toggle */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg text-white mb-2" style={{ fontWeight: 700 }}>
                  {text.notifications}
                </h3>
                <p className="text-sm text-white/60" style={{ fontWeight: 500 }}>
                  {text.notificationsDesc}
                </p>
              </div>
              <button
                onClick={() => setFormData({ ...formData, notifications: !formData.notifications })}
                className={`w-14 h-8 rounded-full transition-colors flex-shrink-0 ml-4 ${
                  formData.notifications ? 'bg-[#1EB53A]' : 'bg-white/20'
                }`}
              >
                <div className={`w-6 h-6 mt-1 rounded-full bg-white transition-transform ${
                  formData.notifications ? 'ml-7' : 'ml-1'
                }`}></div>
              </button>
            </div>
          </div>

          {/* Data consent toggle */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg text-white mb-2" style={{ fontWeight: 700 }}>
                  {text.dataConsent} *
                </h3>
                <p className="text-sm text-white/60" style={{ fontWeight: 500 }}>
                  {text.dataConsentDesc}
                </p>
              </div>
              <button
                onClick={() => setFormData({ ...formData, dataConsent: !formData.dataConsent })}
                className={`w-14 h-8 rounded-full transition-colors flex-shrink-0 ml-4 ${
                  formData.dataConsent ? 'bg-[#1EB53A]' : 'bg-white/20'
                }`}
              >
                <div className={`w-6 h-6 mt-1 rounded-full bg-white transition-transform ${
                  formData.dataConsent ? 'ml-7' : 'ml-1'
                }`}></div>
              </button>
            </div>
          </div>

          {/* Privacy note */}
          <div className="bg-gradient-to-br from-[#00A3DD]/20 to-[#0077A3]/10 border border-[#00A3DD]/30 rounded-3xl p-6">
            <p className="text-sm text-white/80 leading-relaxed" style={{ fontWeight: 500 }}>
              🔒 {text.privacyNote}
            </p>
          </div>
        </div>

        {/* Complete button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#000000] via-[#000000] to-transparent">
          <button
            onClick={() => setStep('success')}
            disabled={!formData.dataConsent}
            className="w-full py-5 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] text-white rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
            style={{ fontWeight: 700 }}
          >
            {text.continue}
            <Check className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
      </div>
    );
  }

  // Success Screen
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0A1F0F] to-[#000000] relative overflow-hidden flex items-center justify-center">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#1EB53A]/40 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#00A3DD]/40 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Confetti animation */}
        {showCelebration && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-20px',
                  backgroundColor: ['#1EB53A', '#FF6B35', '#00A3DD', '#8B5CF6'][Math.floor(Math.random() * 4)],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-md">
          {/* Success icon */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] rounded-full flex items-center justify-center shadow-[0_30px_80px_rgba(30,181,58,0.6)] animate-scale-in">
              <Check className="w-16 h-16 text-white" strokeWidth={3} />
            </div>
            
            {/* Glow rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-2 border-[#1EB53A]/40 scale-110 animate-ping" style={{ animationDuration: '1.5s' }}></div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl text-white mb-4 animate-fade-in" style={{ fontWeight: 900 }}>
            {text.successTitle}
          </h1>
          
          <p className="text-xl text-white/80 mb-12 animate-fade-in" style={{ fontWeight: 600, animationDelay: '0.2s' }}>
            {text.successSubtitle}
          </p>

          {/* Personalized message */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-base text-white/90 leading-relaxed" style={{ fontWeight: 500 }}>
              {language === 'sw' 
                ? `Karibu ${formData.name}! Safari yako ya afya imeanza. Tuko hapa kukusaidia kila hatua! 💪`
                : `Welcome ${formData.name}! Your health journey has begun. We're here to support you every step! 💪`
              }
            </p>
          </div>

          {/* Enter app button */}
          <button
            onClick={handleComplete}
            className="w-full py-5 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] text-white rounded-2xl shadow-[0_20px_60px_rgba(30,181,58,0.5)] hover:shadow-[0_25px_70px_rgba(30,181,58,0.6)] hover:scale-105 active:scale-[0.98] transition-all text-lg animate-fade-in"
            style={{ fontWeight: 800, animationDelay: '0.6s' }}
          >
            {text.enterApp} 🚀
          </button>
        </div>
      </div>
    );
  }

  return null;
}