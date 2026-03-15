import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Crown, Users, GraduationCap, Sparkles, Lock } from 'lucide-react';
import { UserProfile } from '../App';
import {
  subscriptionService,
  SUBSCRIPTION_TIERS,
  SubscriptionPlan,
  PaymentMethod,
} from '../services/subscription';
import { toast } from 'sonner@2.0.3';

interface SubscriptionProps {
  profile: UserProfile;
  onBack: () => void;
}

export function Subscription({ profile, onBack }: SubscriptionProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('premium_monthly');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentSubscription = subscriptionService.getCurrentSubscription();
  const hasActiveSubscription = subscriptionService.hasActiveSubscription();
  const daysRemaining = subscriptionService.getDaysUntilExpiry();

  const text = profile.language === 'sw' ? {
    title: 'Chagua Mpango',
    currentPlan: 'Mpango wa Sasa',
    daysLeft: 'siku zilizobaki',
    selectPlan: 'Chagua mpango',
    monthly: 'Kila mwezi',
    yearly: 'Kila mwaka',
    savePercent: 'Okoa 17%',
    perMonth: 'kwa mwezi',
    features: 'Vipengele',
    subscribe: 'Lipia',
    payWith: 'Lipia kwa',
    phoneNumber: 'Namba ya simu',
    processing: 'Inachakata...',
    success: 'Malipo yamekamilika!',
    error: 'Malipo yameshindikana',
    cancel: 'Sitisha usajili',
    cancelConfirm: 'Je, una uhakika unataka kusitisha usajili?',
    icons: {
      free: '🆓',
      premium: '👑',
      family: '👨‍👩‍👧‍👦',
      school: '🏫',
    },
  } : {
    title: 'Choose Plan',
    currentPlan: 'Current Plan',
    daysLeft: 'days left',
    selectPlan: 'Select plan',
    monthly: 'Monthly',
    yearly: 'Yearly',
    savePercent: 'Save 17%',
    perMonth: 'per month',
    features: 'Features',
    subscribe: 'Subscribe',
    payWith: 'Pay with',
    phoneNumber: 'Phone number',
    processing: 'Processing...',
    success: 'Payment successful!',
    error: 'Payment failed',
    cancel: 'Cancel subscription',
    cancelConfirm: 'Are you sure you want to cancel your subscription?',
    icons: {
      free: '🆓',
      premium: '👑',
      family: '👨‍👩‍👧‍👦',
      school: '🏫',
    },
  };

  const handleSubscribe = async () => {
    if (!phoneNumber) {
      toast.error(profile.language === 'sw' ? 'Weka namba ya simu' : 'Enter phone number');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await subscriptionService.initiatePayment(
        profile.id,
        selectedPlan,
        paymentMethod,
        phoneNumber,
        billingPeriod
      );

      if (result.success) {
        toast.success(text.success);
        
        // Simulate payment verification after 3 seconds
        setTimeout(async () => {
          if (result.transactionId) {
            const verifyResult = await subscriptionService.verifyPayment(result.transactionId);
            if (verifyResult.success) {
              toast.success(profile.language === 'sw' ? 'Usajili umewashwa!' : 'Subscription activated!');
              onBack();
            }
          }
        }, 3000);
      } else {
        toast.error(result.error || text.error);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(text.error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm(text.cancelConfirm)) return;

    const result = await subscriptionService.cancelSubscription();
    if (result.success) {
      toast.success(profile.language === 'sw' ? 'Usajili umesitishwa' : 'Subscription canceled');
      onBack();
    }
  };

  const getPlanIcon = (plan: SubscriptionPlan) => {
    switch (plan) {
      case 'free': return text.icons.free;
      case 'premium_monthly': return text.icons.premium;
      case 'family': return text.icons.family;
      case 'school': return text.icons.school;
      default: return '📦';
    }
  };

  const getPlanColor = (plan: SubscriptionPlan) => {
    switch (plan) {
      case 'free': return 'from-gray-500 to-gray-600';
      case 'premium_monthly': return 'from-yellow-500 to-orange-500';
      case 'family': return 'from-blue-500 to-purple-500';
      case 'school': return 'from-green-500 to-teal-500';
      default: return 'from-gray-500 to-gray-600';
    }
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
            <Crown className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Current Subscription */}
        {hasActiveSubscription && currentSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#1EB53A]/20 to-emerald-500/10 p-6 rounded-3xl border border-[#1EB53A]/30"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white">{text.currentPlan}</h3>
              <Sparkles className="w-5 h-5 text-[#1EB53A]" />
            </div>
            <p className="text-2xl font-bold text-[#1EB53A] mb-1">
              {SUBSCRIPTION_TIERS.find(t => t.id === currentSubscription.planType)?.name[profile.language]}
            </p>
            {daysRemaining !== null && daysRemaining > 0 && (
              <p className="text-sm text-white/60">
                {daysRemaining} {text.daysLeft}
              </p>
            )}
          </motion.div>
        )}

        {/* Billing Period Toggle */}
        <div className="flex gap-2 p-1 bg-black/30 rounded-2xl">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-[#1EB53A] text-white'
                : 'text-white/60'
            }`}
          >
            {text.monthly}
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all relative ${
              billingPeriod === 'yearly'
                ? 'bg-[#1EB53A] text-white'
                : 'text-white/60'
            }`}
          >
            {text.yearly}
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
              {text.savePercent}
            </span>
          </button>
        </div>

        {/* Plans */}
        <div className="space-y-4">
          {SUBSCRIPTION_TIERS.filter(tier => tier.id !== 'free').map((tier, index) => {
            const price = billingPeriod === 'monthly' ? tier.price.monthly : tier.price.yearly;
            const monthlyPrice = billingPeriod === 'yearly' ? Math.round(price / 12) : price;
            const isSelected = selectedPlan === tier.id;

            return (
              <motion.button
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedPlan(tier.id)}
                className={`w-full text-left p-6 rounded-3xl border-2 transition-all ${
                  isSelected
                    ? 'border-[#1EB53A] bg-[#1EB53A]/10'
                    : 'border-white/10 bg-black/30 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getPlanColor(tier.id)} flex items-center justify-center text-2xl`}>
                      {getPlanIcon(tier.id)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {tier.name[profile.language]}
                      </h3>
                      <p className="text-sm text-white/60">
                        {tier.description[profile.language]}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#1EB53A] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">
                      {monthlyPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-white/60">
                      {tier.currency} {text.perMonth}
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <p className="text-xs text-orange-500 mt-1">
                      {price.toLocaleString()} {tier.currency} {profile.language === 'sw' ? 'kwa mwaka' : 'per year'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  {tier.features[profile.language].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#1EB53A] flex-shrink-0" />
                      <span className="text-sm text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">{text.payWith}</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'mpesa' as PaymentMethod, name: 'M-Pesa', icon: '📱', color: 'from-green-500 to-green-600' },
              { id: 'airtel' as PaymentMethod, name: 'Airtel Money', icon: '📲', color: 'from-red-500 to-red-600' },
              { id: 'tigopesa' as PaymentMethod, name: 'Tigo Pesa', icon: '💳', color: 'from-blue-500 to-blue-600' },
            ].map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  paymentMethod === method.id
                    ? 'border-[#1EB53A] bg-[#1EB53A]/10'
                    : 'border-white/10 bg-black/30'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl mb-2 mx-auto`}>
                  {method.icon}
                </div>
                <p className="text-sm font-semibold text-white text-center">
                  {method.name}
                </p>
              </button>
            ))}
          </div>

          {/* Phone Number Input */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              {text.phoneNumber}
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+255 XXX XXX XXX"
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#1EB53A]"
            />
          </div>
        </div>

        {/* Subscribe Button */}
        <button
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="w-full py-4 bg-gradient-to-r from-[#1EB53A] to-emerald-500 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-[#1EB53A]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? text.processing : text.subscribe}
        </button>

        {/* Cancel Subscription */}
        {hasActiveSubscription && (
          <button
            onClick={handleCancelSubscription}
            className="w-full py-3 text-red-500 font-medium rounded-2xl hover:bg-red-500/10 transition-colors"
          >
            {text.cancel}
          </button>
        )}
      </div>
    </div>
  );
}
