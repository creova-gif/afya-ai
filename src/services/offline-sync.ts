/**
 * Offline Sync Service for KUIMARISHA AI
 * Handles offline data storage and synchronization with backend
 */

export interface QueuedAction {
  id: string;
  type: 'workout' | 'meal' | 'habit' | 'profile' | 'family';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
  retries: number;
  status: 'pending' | 'syncing' | 'failed' | 'completed';
  error?: string;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: string | null;
  pendingActions: number;
  failedActions: number;
}

class OfflineSyncService {
  private queue: QueuedAction[] = [];
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;
  private maxRetries: number = 3;
  private listeners: Set<(status: SyncStatus) => void> = new Set();

  constructor() {
    this.loadQueue();
    this.setupEventListeners();
  }

  /**
   * Setup online/offline event listeners
   */
  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      console.log('Connection restored - starting sync');
      this.isOnline = true;
      this.notifyListeners();
      this.syncQueue();
    });

    window.addEventListener('offline', () => {
      console.log('Connection lost - queueing actions');
      this.isOnline = false;
      this.notifyListeners();
    });

    // Periodic sync check every 30 seconds
    setInterval(() => {
      if (this.isOnline && this.queue.length > 0 && !this.syncInProgress) {
        this.syncQueue();
      }
    }, 30000);
  }

  /**
   * Load queue from localStorage
   */
  private loadQueue(): void {
    try {
      const stored = localStorage.getItem('kuimarisha_sync_queue');
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
    }
  }

  /**
   * Save queue to localStorage
   */
  private saveQueue(): void {
    try {
      localStorage.setItem('kuimarisha_sync_queue', JSON.stringify(this.queue));
      this.notifyListeners();
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }

  /**
   * Add action to sync queue
   */
  queueAction(action: Omit<QueuedAction, 'id' | 'timestamp' | 'retries' | 'status'>): string {
    const queuedAction: QueuedAction = {
      ...action,
      id: `${action.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      retries: 0,
      status: 'pending',
    };

    this.queue.push(queuedAction);
    this.saveQueue();

    // Try to sync immediately if online
    if (this.isOnline && !this.syncInProgress) {
      this.syncQueue();
    }

    return queuedAction.id;
  }

  /**
   * Sync queue with backend
   */
  async syncQueue(): Promise<void> {
    if (this.syncInProgress || !this.isOnline || this.queue.length === 0) {
      return;
    }

    this.syncInProgress = true;
    const pendingActions = this.queue.filter(a => a.status === 'pending' || a.status === 'failed');

    console.log(`Syncing ${pendingActions.length} actions...`);

    for (const action of pendingActions) {
      try {
        action.status = 'syncing';
        this.saveQueue();

        await this.syncAction(action);

        action.status = 'completed';
        this.removeFromQueue(action.id);
      } catch (error) {
        console.error(`Failed to sync action ${action.id}:`, error);
        action.retries += 1;
        action.error = error instanceof Error ? error.message : 'Unknown error';

        if (action.retries >= this.maxRetries) {
          action.status = 'failed';
          console.error(`Action ${action.id} failed after ${this.maxRetries} retries`);
        } else {
          action.status = 'pending';
        }

        this.saveQueue();
      }
    }

    this.syncInProgress = false;
    this.notifyListeners();
    
    // Update last sync time
    localStorage.setItem('kuimarisha_last_sync', new Date().toISOString());
  }

  /**
   * Sync individual action with backend
   */
  private async syncAction(action: QueuedAction): Promise<void> {
    // This would call the actual API endpoints
    // For now, we'll simulate the sync
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Sync failed'));
        }
      }, 500);
    });
  }

  /**
   * Remove action from queue
   */
  private removeFromQueue(actionId: string): void {
    this.queue = this.queue.filter(a => a.id !== actionId);
    this.saveQueue();
  }

  /**
   * Get sync status
   */
  getSyncStatus(): SyncStatus {
    const lastSync = localStorage.getItem('kuimarisha_last_sync');
    return {
      isOnline: this.isOnline,
      lastSync,
      pendingActions: this.queue.filter(a => a.status === 'pending').length,
      failedActions: this.queue.filter(a => a.status === 'failed').length,
    };
  }

  /**
   * Get all queued actions
   */
  getQueuedActions(): QueuedAction[] {
    return [...this.queue];
  }

  /**
   * Clear failed actions
   */
  clearFailedActions(): void {
    this.queue = this.queue.filter(a => a.status !== 'failed');
    this.saveQueue();
  }

  /**
   * Retry failed actions
   */
  retryFailedActions(): void {
    this.queue.forEach(action => {
      if (action.status === 'failed') {
        action.status = 'pending';
        action.retries = 0;
        action.error = undefined;
      }
    });
    this.saveQueue();
    
    if (this.isOnline) {
      this.syncQueue();
    }
  }

  /**
   * Subscribe to sync status updates
   */
  subscribe(listener: (status: SyncStatus) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of status change
   */
  private notifyListeners(): void {
    const status = this.getSyncStatus();
    this.listeners.forEach(listener => listener(status));
  }

  /**
   * Force sync now
   */
  forceSyncNow(): Promise<void> {
    return this.syncQueue();
  }
}

// Export singleton instance
export const offlineSyncService = new OfflineSyncService();

// Offline storage utilities
export class OfflineStorage {
  private dbName = 'kuimarisha_offline';
  private version = 1;

  /**
   * Save data to offline storage
   */
  async save(key: string, data: any): Promise<void> {
    try {
      localStorage.setItem(`${this.dbName}_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to offline storage:', error);
    }
  }

  /**
   * Load data from offline storage
   */
  async load<T>(key: string): Promise<T | null> {
    try {
      const stored = localStorage.getItem(`${this.dbName}_${key}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load from offline storage:', error);
      return null;
    }
  }

  /**
   * Remove data from offline storage
   */
  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(`${this.dbName}_${key}`);
    } catch (error) {
      console.error('Failed to remove from offline storage:', error);
    }
  }

  /**
   * Clear all offline data
   */
  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.dbName)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear offline storage:', error);
    }
  }
}

export const offlineStorage = new OfflineStorage();

// Export utility functions
export const queueWorkout = (data: any) => 
  offlineSyncService.queueAction({ type: 'workout', action: 'create', data });

export const queueMeal = (data: any) => 
  offlineSyncService.queueAction({ type: 'meal', action: 'create', data });

export const queueHabit = (data: any) => 
  offlineSyncService.queueAction({ type: 'habit', action: 'create', data });

export const getSyncStatus = () => offlineSyncService.getSyncStatus();
export const forceSyncNow = () => offlineSyncService.forceSyncNow();
export const subscribeSyncStatus = (listener: (status: SyncStatus) => void) => 
  offlineSyncService.subscribe(listener);
