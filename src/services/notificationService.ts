export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'welcome';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private constructor() {
    // Load notifications from localStorage
    this.loadNotifications();
  }

  private loadNotifications() {
    try {
      const stored = localStorage.getItem('user_notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.notifications = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      this.notifications = [];
    }
  }

  private saveNotifications() {
    try {
      localStorage.setItem('user_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): string {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification);
    
    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.saveNotifications();
    this.notifyListeners();
    
    return newNotification.id;
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.notifyListeners();
  }

  removeNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotifications();
    this.notifyListeners();
  }

  clearAllNotifications() {
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Welcome notifications for new users
  showWelcomeNotifications(isDemo: boolean = false) {
    if (isDemo) {
      this.addNotification({
        title: '🎉 Welcome to Statsor Demo!',
        message: 'You\'re now exploring our demo account with sample data. Feel free to test all features!',
        type: 'welcome'
      });

      this.addNotification({
        title: '📊 Explore Sample Data',
        message: 'Check out the pre-loaded players, matches, and analytics to see what Statsor can do.',
        type: 'info'
      });

      this.addNotification({
        title: '🔄 Ready to Start Fresh?',
        message: 'When you\'re ready, create a real account to manage your own team data.',
        type: 'info'
      });
    } else {
      this.addNotification({
        title: '🎉 Welcome to Statsor!',
        message: 'Your account has been created successfully. Start by adding your team and players.',
        type: 'welcome'
      });

      this.addNotification({
        title: '📝 Complete Your Setup',
        message: 'Add your club information and first players to get the most out of Statsor.',
        type: 'info'
      });

      this.addNotification({
        title: '💡 Pro Tip',
        message: 'Use the Data Management section to track everything from player stats to financial records.',
        type: 'info'
      });
    }
  }

  // Success notifications for actions
  showSuccessNotification(title: string, message: string) {
    this.addNotification({
      title,
      message,
      type: 'success'
    });
  }

  // Error notifications
  showErrorNotification(title: string, message: string) {
    this.addNotification({
      title,
      message,
      type: 'error'
    });
  }

  // Info notifications
  showInfoNotification(title: string, message: string) {
    this.addNotification({
      title,
      message,
      type: 'info'
    });
  }

  // Warning notifications
  showWarningNotification(title: string, message: string) {
    this.addNotification({
      title,
      message,
      type: 'warning'
    });
  }

  // Welcome notification for new users
  async sendWelcomeNotification(userId: string, userData: { name: string; email: string; isDemoAccount?: boolean }) {
    const welcomeTitle = userData.isDemoAccount ? '🎉 Welcome to Statsor Demo!' : '🎉 Welcome to Statsor!';
    const welcomeMessage = userData.isDemoAccount 
      ? `Hi ${userData.name}! You're now exploring Statsor with demo data. Feel free to test all features!`
      : `Hi ${userData.name}! Your account has been created successfully. Let's get started with managing your sports data!`;
    
    this.addNotification({
      title: welcomeTitle,
      message: welcomeMessage,
      type: 'welcome'
    });

    // Add setup tips for new users
    if (!userData.isDemoAccount) {
      setTimeout(() => {
        this.showSetupTips();
      }, 2000);
    }
  }
}

export const notificationService = NotificationService.getInstance();