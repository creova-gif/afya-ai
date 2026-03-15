/**
 * Push Notifications Service for KUIMARISHA AI
 * Handles workout reminders, meal reminders, and motivational messages
 */

export interface NotificationConfig {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
}

export interface ScheduledNotification {
  id: string;
  time: string; // ISO time string or cron format
  notification: NotificationConfig;
  recurring?: 'daily' | 'weekly' | 'custom';
}

class NotificationService {
  private permission: NotificationPermission = 'default';
  private scheduledNotifications: Map<string, ScheduledNotification> = new Map();

  constructor() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Send immediate notification
   */
  async sendNotification(config: NotificationConfig): Promise<void> {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        console.warn('Notification permission not granted');
        return;
      }
    }

    try {
      const notification = new Notification(config.title, {
        body: config.body,
        icon: config.icon || '/icon-192.png',
        badge: config.badge || '/icon-192.png',
        tag: config.tag,
        data: config.data,
        requireInteraction: config.requireInteraction || false,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  /**
   * Schedule a notification for later
   */
  scheduleNotification(scheduled: ScheduledNotification): void {
    this.scheduledNotifications.set(scheduled.id, scheduled);
    
    // Calculate delay until notification time
    const now = new Date();
    const scheduledTime = new Date(scheduled.time);
    const delay = scheduledTime.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(() => {
        this.sendNotification(scheduled.notification);
        
        // Handle recurring notifications
        if (scheduled.recurring === 'daily') {
          const nextTime = new Date(scheduledTime);
          nextTime.setDate(nextTime.getDate() + 1);
          this.scheduleNotification({
            ...scheduled,
            time: nextTime.toISOString(),
          });
        }
      }, delay);
    }
  }

  /**
   * Cancel a scheduled notification
   */
  cancelScheduledNotification(id: string): void {
    this.scheduledNotifications.delete(id);
  }

  /**
   * Send workout reminder notification
   */
  async sendWorkoutReminder(language: 'sw' | 'en' = 'sw'): Promise<void> {
    const messages = {
      sw: {
        title: '🏋️ Muda wa Zoezi!',
        body: 'Karibu uanze zoezi lako la leo. Mwili wako unasubiri!',
      },
      en: {
        title: '🏋️ Workout Time!',
        body: "Ready to start today's workout. Your body is waiting!",
      },
    };

    await this.sendNotification({
      ...messages[language],
      tag: 'workout-reminder',
      requireInteraction: true,
    });
  }

  /**
   * Send meal reminder notification
   */
  async sendMealReminder(mealType: string, language: 'sw' | 'en' = 'sw'): Promise<void> {
    const messages = {
      sw: {
        breakfast: { title: '🍳 Chakula cha Asubuhi', body: 'Usisahau kuandika chakula cha asubuhi!' },
        lunch: { title: '🍛 Chakula cha Mchana', body: 'Muda wa chakula cha mchana. Kumbuka kuandika!' },
        dinner: { title: '🍽️ Chakula cha Jioni', body: 'Chakula cha jioni kimekuwa tayari?' },
        snack: { title: '🍎 Vitafunio', body: 'Muda wa vitafunio vizuri!' },
      },
      en: {
        breakfast: { title: '🍳 Breakfast Time', body: "Don't forget to log your breakfast!" },
        lunch: { title: '🍛 Lunch Time', body: 'Time for lunch. Remember to log it!' },
        dinner: { title: '🍽️ Dinner Time', body: 'Is dinner ready?' },
        snack: { title: '🍎 Snack Time', body: 'Time for a healthy snack!' },
      },
    };

    const message = messages[language][mealType as keyof typeof messages.sw] || messages[language].snack;
    
    await this.sendNotification({
      ...message,
      tag: `meal-reminder-${mealType}`,
    });
  }

  /**
   * Send water reminder notification
   */
  async sendWaterReminder(language: 'sw' | 'en' = 'sw'): Promise<void> {
    const messages = {
      sw: {
        title: '💧 Kunywa Maji!',
        body: 'Muda wa kunywa maji. Lengo lako ni glasi 8 kwa siku!',
      },
      en: {
        title: '💧 Drink Water!',
        body: 'Time to drink water. Your goal is 8 glasses per day!',
      },
    };

    await this.sendNotification({
      ...messages[language],
      tag: 'water-reminder',
    });
  }

  /**
   * Send achievement notification
   */
  async sendAchievementUnlocked(
    achievementName: string,
    description: string,
    language: 'sw' | 'en' = 'sw'
  ): Promise<void> {
    const titles = {
      sw: '🏆 Ushindi Mpya!',
      en: '🏆 Achievement Unlocked!',
    };

    await this.sendNotification({
      title: titles[language],
      body: `${achievementName}: ${description}`,
      tag: 'achievement',
      requireInteraction: true,
    });
  }

  /**
   * Send streak milestone notification
   */
  async sendStreakMilestone(days: number, language: 'sw' | 'en' = 'sw'): Promise<void> {
    const messages = {
      sw: {
        title: '🔥 Mfululizo Mzuri!',
        body: `Hongera! Umefanya zoezi kwa siku ${days} mfululizo. Endelea!`,
      },
      en: {
        title: '🔥 Amazing Streak!',
        body: `Congratulations! You've worked out for ${days} days in a row. Keep going!`,
      },
    };

    await this.sendNotification({
      ...messages[language],
      tag: 'streak-milestone',
      requireInteraction: true,
    });
  }

  /**
   * Send motivational message
   */
  async sendMotivationalMessage(language: 'sw' | 'en' = 'sw'): Promise<void> {
    const motivationalMessages = {
      sw: [
        { title: '💪 Wewe ni Shujaa!', body: 'Mwili wako unakushukuru kwa mazoezi haya!' },
        { title: '⭐ Endelea Hivyo!', body: 'Kila hatua inakupeleka karibu na lengo lako!' },
        { title: '🎯 Unaweza!', body: 'Usiache leo. Kesho utashukuru mwenyewe!' },
        { title: '🌟 Mwili Imara!', body: 'Kila zoezi linakufanya kuwa imara zaidi!' },
      ],
      en: [
        { title: '💪 You are a Champion!', body: 'Your body thanks you for this workout!' },
        { title: '⭐ Keep It Up!', body: 'Every step brings you closer to your goal!' },
        { title: '🎯 You Can Do It!', body: "Don't skip today. Tomorrow you'll thank yourself!" },
        { title: '🌟 Strong Body!', body: 'Every workout makes you stronger!' },
      ],
    };

    const messages = motivationalMessages[language];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    await this.sendNotification({
      ...randomMessage,
      tag: 'motivation',
    });
  }

  /**
   * Setup default notification schedule
   */
  setupDefaultSchedule(language: 'sw' | 'en' = 'sw'): void {
    // Morning workout reminder (7:00 AM)
    const morningWorkout = new Date();
    morningWorkout.setHours(7, 0, 0, 0);
    if (morningWorkout < new Date()) {
      morningWorkout.setDate(morningWorkout.getDate() + 1);
    }

    this.scheduleNotification({
      id: 'morning-workout',
      time: morningWorkout.toISOString(),
      notification: {
        title: language === 'sw' ? '🌅 Zoezi la Asubuhi!' : '🌅 Morning Workout!',
        body: language === 'sw' 
          ? 'Asubuhi njema! Muda wa kuanza siku yako kwa nguvu!' 
          : 'Good morning! Time to start your day strong!',
        tag: 'morning-workout',
        requireInteraction: true,
      },
      recurring: 'daily',
    });

    // Water reminder every 2 hours (9am - 7pm)
    for (let hour = 9; hour <= 19; hour += 2) {
      const waterTime = new Date();
      waterTime.setHours(hour, 0, 0, 0);
      if (waterTime < new Date()) {
        waterTime.setDate(waterTime.getDate() + 1);
      }

      this.scheduleNotification({
        id: `water-${hour}`,
        time: waterTime.toISOString(),
        notification: {
          title: language === 'sw' ? '💧 Maji!' : '💧 Water!',
          body: language === 'sw' ? 'Kunywa maji!' : 'Drink water!',
          tag: 'water',
        },
        recurring: 'daily',
      });
    }
  }

  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Get current permission status
   */
  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Export utility functions
export const requestNotificationPermission = () => notificationService.requestPermission();
export const sendWorkoutReminder = (lang: 'sw' | 'en') => notificationService.sendWorkoutReminder(lang);
export const sendMealReminder = (type: string, lang: 'sw' | 'en') => notificationService.sendMealReminder(type, lang);
export const sendWaterReminder = (lang: 'sw' | 'en') => notificationService.sendWaterReminder(lang);
export const sendAchievement = (name: string, desc: string, lang: 'sw' | 'en') => 
  notificationService.sendAchievementUnlocked(name, desc, lang);
export const sendStreakMilestone = (days: number, lang: 'sw' | 'en') => 
  notificationService.sendStreakMilestone(days, lang);
export const setupNotifications = (lang: 'sw' | 'en') => notificationService.setupDefaultSchedule(lang);
