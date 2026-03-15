/**
 * Subscription & Payment Service for KUIMARISHA AI
 * Handles M-Pesa, Airtel Money, and Tigopesa payments
 */

export type SubscriptionPlan = 'free' | 'premium_monthly' | 'premium_yearly' | 'family' | 'school';
export type PaymentMethod = 'mpesa' | 'airtel' | 'tigopesa' | 'tigo_pesa';
export type SubscriptionStatus = 'active' | 'inactive' | 'canceled' | 'expired' | 'pending';

export interface SubscriptionTier {
  id: SubscriptionPlan;
  name: {
    sw: string;
    en: string;
  };
  description: {
    sw: string;
    en: string;
  };
  price: {
    monthly: number;
    yearly: number;
  };
  currency: string;
  features: {
    sw: string[];
    en: string[];
  };
  limits: {
    familyMembers: number;
    aiCoachMessages: number;
    customWorkouts: number;
    mealPlans: number;
    analytics: boolean;
    formCheck: boolean;
    recipes: boolean;
    socialFeatures: boolean;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  planType: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  referenceCode: string;
  subscriptionId?: string;
  createdAt: string;
  completedAt?: string;
}

// Subscription tiers
export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: {
      sw: 'Bure',
      en: 'Free',
    },
    description: {
      sw: 'Msingi wa mafunzo',
      en: 'Basic training',
    },
    price: {
      monthly: 0,
      yearly: 0,
    },
    currency: 'TZS',
    features: {
      sw: [
        'Mazoezi ya msingi',
        'Mfuatiliaji wa vyakula',
        'Wasifu 1 tu',
        'Ujumbe 5 za AI kwa siku',
      ],
      en: [
        'Basic workouts',
        'Food tracking',
        '1 profile only',
        '5 AI messages per day',
      ],
    },
    limits: {
      familyMembers: 1,
      aiCoachMessages: 5,
      customWorkouts: 3,
      mealPlans: 0,
      analytics: false,
      formCheck: false,
      recipes: false,
      socialFeatures: false,
    },
  },
  {
    id: 'premium_monthly',
    name: {
      sw: 'Premium - Mwezi',
      en: 'Premium - Monthly',
    },
    description: {
      sw: 'Upatikanaji kamili wa huduma zote',
      en: 'Full access to all features',
    },
    price: {
      monthly: 15000, // 15,000 TZS (~$6)
      yearly: 150000, // Save 2 months
    },
    currency: 'TZS',
    features: {
      sw: [
        'Mazoezi yote bila kikomo',
        'AI Coach bila kikomo',
        'Mipango ya chakula ya kibinafsi',
        'Uchambuzi wa maendeleo',
        'Ukaguzi wa fomu ya AI',
        'Wasifu 5 wa familia',
        'Mapishi ya Tanzania',
        'Ushindani na marafiki',
      ],
      en: [
        'Unlimited workouts',
        'Unlimited AI Coach',
        'Personalized meal plans',
        'Progress analytics',
        'AI form check',
        '5 family profiles',
        'Tanzanian recipes',
        'Social challenges',
      ],
    },
    limits: {
      familyMembers: 5,
      aiCoachMessages: -1, // unlimited
      customWorkouts: -1,
      mealPlans: -1,
      analytics: true,
      formCheck: true,
      recipes: true,
      socialFeatures: true,
    },
  },
  {
    id: 'family',
    name: {
      sw: 'Familia',
      en: 'Family',
    },
    description: {
      sw: 'Kwa familia nzima',
      en: 'For the whole family',
    },
    price: {
      monthly: 25000, // 25,000 TZS (~$10)
      yearly: 250000,
    },
    currency: 'TZS',
    features: {
      sw: [
        'Vitu vyote vya Premium',
        'Wasifu 10 wa familia',
        'Mipango ya chakula ya familia',
        'Orodha ya ununuzi',
        'Ripoti za PDF',
      ],
      en: [
        'All Premium features',
        '10 family profiles',
        'Family meal plans',
        'Shopping lists',
        'PDF reports',
      ],
    },
    limits: {
      familyMembers: 10,
      aiCoachMessages: -1,
      customWorkouts: -1,
      mealPlans: -1,
      analytics: true,
      formCheck: true,
      recipes: true,
      socialFeatures: true,
    },
  },
  {
    id: 'school',
    name: {
      sw: 'Shule',
      en: 'School',
    },
    description: {
      sw: 'Kwa PE na madarasa ya afya',
      en: 'For PE and health classes',
    },
    price: {
      monthly: 100000, // 100,000 TZS (~$40) for 50 students
      yearly: 1000000,
    },
    currency: 'TZS',
    features: {
      sw: [
        'Vitu vyote vya Premium',
        'Wanafunzi 50',
        'Dashbodi ya mwalimu',
        'Mazoezi ya darasa',
        'Ripoti za wazazi',
        'Ushindani wa darasa',
      ],
      en: [
        'All Premium features',
        '50 students',
        'Teacher dashboard',
        'Class workouts',
        'Parent reports',
        'Class challenges',
      ],
    },
    limits: {
      familyMembers: 50,
      aiCoachMessages: -1,
      customWorkouts: -1,
      mealPlans: -1,
      analytics: true,
      formCheck: true,
      recipes: true,
      socialFeatures: true,
    },
  },
];

class SubscriptionService {
  private currentSubscription: Subscription | null = null;

  /**
   * Get subscription tiers
   */
  getTiers(): SubscriptionTier[] {
    return SUBSCRIPTION_TIERS;
  }

  /**
   * Get specific tier
   */
  getTier(planType: SubscriptionPlan): SubscriptionTier | undefined {
    return SUBSCRIPTION_TIERS.find(tier => tier.id === planType);
  }

  /**
   * Check if user has active subscription
   */
  hasActiveSubscription(): boolean {
    if (!this.currentSubscription) return false;
    if (this.currentSubscription.status !== 'active') return false;
    
    const endDate = new Date(this.currentSubscription.endDate);
    return endDate > new Date();
  }

  /**
   * Get current subscription
   */
  getCurrentSubscription(): Subscription | null {
    return this.currentSubscription;
  }

  /**
   * Set current subscription
   */
  setCurrentSubscription(subscription: Subscription | null): void {
    this.currentSubscription = subscription;
    this.saveToStorage();
  }

  /**
   * Check if feature is available
   */
  hasFeatureAccess(feature: keyof SubscriptionTier['limits']): boolean {
    if (!this.currentSubscription || this.currentSubscription.status !== 'active') {
      // Free tier
      const freeTier = this.getTier('free');
      return freeTier ? freeTier.limits[feature] === true || freeTier.limits[feature] === -1 : false;
    }

    const tier = this.getTier(this.currentSubscription.planType);
    if (!tier) return false;

    const limit = tier.limits[feature];
    return limit === true || limit === -1;
  }

  /**
   * Get feature limit
   */
  getFeatureLimit(feature: keyof SubscriptionTier['limits']): number | boolean {
    if (!this.currentSubscription || this.currentSubscription.status !== 'active') {
      const freeTier = this.getTier('free');
      return freeTier ? freeTier.limits[feature] : 0;
    }

    const tier = this.getTier(this.currentSubscription.planType);
    return tier ? tier.limits[feature] : 0;
  }

  /**
   * Check if can add family member
   */
  canAddFamilyMember(currentCount: number): boolean {
    const limit = this.getFeatureLimit('familyMembers');
    if (typeof limit === 'boolean') return limit;
    return limit === -1 || currentCount < limit;
  }

  /**
   * Check if can send AI message
   */
  canSendAIMessage(todayCount: number): boolean {
    const limit = this.getFeatureLimit('aiCoachMessages');
    if (typeof limit === 'boolean') return limit;
    return limit === -1 || todayCount < limit;
  }

  /**
   * Initiate payment
   */
  async initiatePayment(
    userId: string,
    planType: SubscriptionPlan,
    paymentMethod: PaymentMethod,
    phoneNumber: string,
    billingPeriod: 'monthly' | 'yearly' = 'monthly'
  ): Promise<{ success: boolean; transactionId?: string; paymentUrl?: string; error?: string }> {
    try {
      const tier = this.getTier(planType);
      if (!tier) {
        return { success: false, error: 'Invalid subscription plan' };
      }

      const amount = billingPeriod === 'monthly' ? tier.price.monthly : tier.price.yearly;
      
      // In production, this would call M-Pesa, Airtel Money, or Tigopesa API
      // For now, we'll simulate the payment
      console.log('Initiating payment:', {
        userId,
        planType,
        paymentMethod,
        phoneNumber,
        amount,
        currency: tier.currency,
      });

      // Simulate transaction ID
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Store transaction in localStorage (in production, this would be in database)
      const transaction: Transaction = {
        id: transactionId,
        userId,
        amount,
        currency: tier.currency,
        method: paymentMethod,
        status: 'pending',
        referenceCode: `${paymentMethod.toUpperCase()}-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      this.saveTransaction(transaction);

      return {
        success: true,
        transactionId,
        paymentUrl: `tel:*150*00#`, // USSD code for M-Pesa
      };
    } catch (error) {
      console.error('Payment initiation failed:', error);
      return { success: false, error: 'Failed to initiate payment' };
    }
  }

  /**
   * Verify payment
   */
  async verifyPayment(transactionId: string): Promise<{
    success: boolean;
    subscription?: Subscription;
    error?: string;
  }> {
    try {
      const transaction = this.getTransaction(transactionId);
      if (!transaction) {
        return { success: false, error: 'Transaction not found' };
      }

      // In production, verify with payment provider
      // For now, simulate successful payment
      transaction.status = 'completed';
      transaction.completedAt = new Date().toISOString();
      this.saveTransaction(transaction);

      // Create subscription
      const subscription: Subscription = {
        id: `SUB-${Date.now()}`,
        userId: transaction.userId,
        planType: 'premium_monthly', // From transaction metadata in production
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        autoRenew: true,
        paymentMethod: transaction.method,
        paymentReference: transaction.referenceCode,
        createdAt: new Date().toISOString(),
      };

      this.setCurrentSubscription(subscription);

      return { success: true, subscription };
    } catch (error) {
      console.error('Payment verification failed:', error);
      return { success: false, error: 'Failed to verify payment' };
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(): Promise<{ success: boolean; error?: string }> {
    if (!this.currentSubscription) {
      return { success: false, error: 'No active subscription' };
    }

    this.currentSubscription.status = 'canceled';
    this.currentSubscription.autoRenew = false;
    this.saveToStorage();

    return { success: true };
  }

  /**
   * Get days until subscription expires
   */
  getDaysUntilExpiry(): number | null {
    if (!this.currentSubscription) return null;

    const endDate = new Date(this.currentSubscription.endDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem('kuimarisha_subscription', JSON.stringify(this.currentSubscription));
    } catch (error) {
      console.error('Failed to save subscription:', error);
    }
  }

  /**
   * Load from localStorage
   */
  loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('kuimarisha_subscription');
      if (stored) {
        this.currentSubscription = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    }
  }

  /**
   * Save transaction
   */
  private saveTransaction(transaction: Transaction): void {
    try {
      const transactions = this.getTransactions();
      const index = transactions.findIndex(t => t.id === transaction.id);
      
      if (index >= 0) {
        transactions[index] = transaction;
      } else {
        transactions.push(transaction);
      }

      localStorage.setItem('kuimarisha_transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  }

  /**
   * Get transaction
   */
  private getTransaction(transactionId: string): Transaction | undefined {
    const transactions = this.getTransactions();
    return transactions.find(t => t.id === transactionId);
  }

  /**
   * Get all transactions
   */
  getTransactions(): Transaction[] {
    try {
      const stored = localStorage.getItem('kuimarisha_transactions');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load transactions:', error);
      return [];
    }
  }
}

// Export singleton
export const subscriptionService = new SubscriptionService();

// Export utility functions
export const getTiers = () => subscriptionService.getTiers();
export const hasActiveSubscription = () => subscriptionService.hasActiveSubscription();
export const hasFeatureAccess = (feature: keyof SubscriptionTier['limits']) =>
  subscriptionService.hasFeatureAccess(feature);
export const canAddFamilyMember = (count: number) => subscriptionService.canAddFamilyMember(count);
export const canSendAIMessage = (count: number) => subscriptionService.canSendAIMessage(count);
