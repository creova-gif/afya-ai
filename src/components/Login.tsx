import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onBack: () => void;
  onSignUp: () => void;
  language: 'sw' | 'en';
}

export function Login({ onLogin, onBack, onSignUp, language }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const text = language === 'sw' ? {
    title: 'Karibu Tena',
    subtitle: 'Ingia kwenye akaunti yako',
    email: 'Barua pepe',
    password: 'Neno la siri',
    login: 'Ingia',
    noAccount: 'Huna akaunti?',
    signUp: 'Jisajili hapa',
    forgotPassword: 'Umesahau neno la siri?',
    emailPlaceholder: 'weka barua pepe yako',
    passwordPlaceholder: 'weka neno la siri',
    loggingIn: 'Inaingia...',
    invalidCredentials: 'Barua pepe au neno la siri si sahihi',
    fillAllFields: 'Tafadhali jaza sehemu zote',
  } : {
    title: 'Welcome Back',
    subtitle: 'Sign in to your account',
    email: 'Email',
    password: 'Password',
    login: 'Sign In',
    noAccount: 'Don\'t have an account?',
    signUp: 'Sign up here',
    forgotPassword: 'Forgot password?',
    emailPlaceholder: 'enter your email',
    passwordPlaceholder: 'enter your password',
    loggingIn: 'Signing in...',
    invalidCredentials: 'Invalid email or password',
    fillAllFields: 'Please fill in all fields',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(text.fillAllFields);
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      console.error('Login error:', err);
      setError(text.invalidCredentials);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0A1F0F] to-[#000000] flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 flex flex-col justify-center pb-20">
        {/* Logo/Icon */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] rounded-3xl flex items-center justify-center shadow-[0_8px_32px_rgba(30,181,58,0.4)]">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl text-white mb-2" style={{ fontWeight: 800 }}>
            {text.title}
          </h1>
          <p className="text-white/60" style={{ fontWeight: 500 }}>
            {text.subtitle}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-red-400 text-sm text-center" style={{ fontWeight: 600 }}>
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-white/80 text-sm mb-2" style={{ fontWeight: 600 }}>
              {text.email}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Mail className="w-5 h-5 text-white/40" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={text.emailPlaceholder}
                className="w-full h-14 pl-12 pr-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-[#1EB53A] transition-colors"
                style={{ fontWeight: 500 }}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-white/80 text-sm mb-2" style={{ fontWeight: 600 }}>
              {text.password}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Lock className="w-5 h-5 text-white/40" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={text.passwordPlaceholder}
                className="w-full h-14 pl-12 pr-12 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-[#1EB53A] transition-colors"
                style={{ fontWeight: 500 }}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-white/40" />
                ) : (
                  <Eye className="w-5 h-5 text-white/40" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-[#1EB53A] text-sm hover:text-[#0F7A28] transition-colors"
              style={{ fontWeight: 600 }}
            >
              {text.forgotPassword}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] rounded-2xl text-white shadow-[0_8px_24px_rgba(30,181,58,0.3)] active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontWeight: 700 }}
          >
            {isLoading ? text.loggingIn : text.login}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm" style={{ fontWeight: 500 }}>
            {text.noAccount}{' '}
            <button
              onClick={onSignUp}
              className="text-[#1EB53A] hover:text-[#0F7A28] transition-colors"
              style={{ fontWeight: 700 }}
            >
              {text.signUp}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
