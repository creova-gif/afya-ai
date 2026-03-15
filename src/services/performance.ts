/**
 * Performance Optimization Service for KUIMARISHA AI
 * Handles code splitting, caching, and performance monitoring
 */

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  apiResponseTime: number;
  memoryUsage?: number;
  timestamp: string;
}

class PerformanceService {
  private metrics: PerformanceMetrics[] = [];
  private cacheStore: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  /**
   * Measure component load time
   */
  measureLoadTime(componentName: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      console.log(`[Performance] ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
      
      this.recordMetric({
        loadTime,
        renderTime: 0,
        apiResponseTime: 0,
        timestamp: new Date().toISOString(),
      });
    };
  }

  /**
   * Measure API call performance
   */
  async measureApiCall<T>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.log(`[Performance] API ${endpoint} responded in ${responseTime.toFixed(2)}ms`);
      
      this.recordMetric({
        loadTime: 0,
        renderTime: 0,
        apiResponseTime: responseTime,
        timestamp: new Date().toISOString(),
      });
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      console.error(`[Performance] API ${endpoint} failed after ${responseTime.toFixed(2)}ms`, error);
      throw error;
    }
  }

  /**
   * Cache data with TTL
   */
  setCache(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cacheStore.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Get cached data
   */
  getCache<T>(key: string): T | null {
    const cached = this.cacheStore.get(key);
    
    if (!cached) {
      return null;
    }
    
    const now = Date.now();
    const age = now - cached.timestamp;
    
    if (age > cached.ttl) {
      // Cache expired
      this.cacheStore.delete(key);
      return null;
    }
    
    return cached.data as T;
  }

  /**
   * Clear cache
   */
  clearCache(key?: string): void {
    if (key) {
      this.cacheStore.delete(key);
    } else {
      this.cacheStore.clear();
    }
  }

  /**
   * Record performance metric
   */
  private recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Get average metrics
   */
  getAverageMetrics(): {
    avgLoadTime: number;
    avgRenderTime: number;
    avgApiResponseTime: number;
  } {
    if (this.metrics.length === 0) {
      return { avgLoadTime: 0, avgRenderTime: 0, avgApiResponseTime: 0 };
    }

    const sum = this.metrics.reduce(
      (acc, metric) => ({
        loadTime: acc.loadTime + metric.loadTime,
        renderTime: acc.renderTime + metric.renderTime,
        apiResponseTime: acc.apiResponseTime + metric.apiResponseTime,
      }),
      { loadTime: 0, renderTime: 0, apiResponseTime: 0 }
    );

    return {
      avgLoadTime: sum.loadTime / this.metrics.length,
      avgRenderTime: sum.renderTime / this.metrics.length,
      avgApiResponseTime: sum.apiResponseTime / this.metrics.length,
    };
  }

  /**
   * Prefetch data
   */
  async prefetch<T>(key: string, fetcher: () => Promise<T>): Promise<void> {
    try {
      const data = await fetcher();
      this.setCache(key, data);
    } catch (error) {
      console.error(`Failed to prefetch ${key}:`, error);
    }
  }

  /**
   * Lazy load image
   */
  lazyLoadImage(img: HTMLImageElement, src: string): void {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.src = src;
            observer.unobserve(img);
          }
        });
      });

      observer.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      img.src = src;
    }
  }

  /**
   * Debounce function
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        func(...args);
      }, wait);
    };
  }

  /**
   * Throttle function
   */
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;

    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }

  /**
   * Get memory usage (if available)
   */
  getMemoryUsage(): number | null {
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1048576; // Convert to MB
    }
    return null;
  }

  /**
   * Monitor performance continuously
   */
  startMonitoring(interval: number = 60000): () => void {
    const intervalId = setInterval(() => {
      const memoryUsage = this.getMemoryUsage();
      
      if (memoryUsage !== null) {
        console.log(`[Performance] Memory usage: ${memoryUsage.toFixed(2)} MB`);
      }
      
      const avgMetrics = this.getAverageMetrics();
      console.log('[Performance] Average metrics:', avgMetrics);
    }, interval);

    return () => clearInterval(intervalId);
  }
}

// Export singleton instance
export const performanceService = new PerformanceService();

// Cache utilities for common patterns
export class CachedApiCall<T> {
  private cacheKey: string;
  private fetcher: () => Promise<T>;
  private ttl: number;

  constructor(cacheKey: string, fetcher: () => Promise<T>, ttl: number = 5 * 60 * 1000) {
    this.cacheKey = cacheKey;
    this.fetcher = fetcher;
    this.ttl = ttl;
  }

  async get(forceRefresh: boolean = false): Promise<T> {
    if (!forceRefresh) {
      const cached = performanceService.getCache<T>(this.cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

    const data = await performanceService.measureApiCall(
      this.fetcher,
      this.cacheKey
    );
    
    performanceService.setCache(this.cacheKey, data, this.ttl);
    return data;
  }

  invalidate(): void {
    performanceService.clearCache(this.cacheKey);
  }
}

// Image optimization utilities
export const optimizeImage = (url: string, options?: {
  width?: number;
  height?: number;
  quality?: number;
}): string => {
  // If using Unsplash or similar service, append optimization params
  if (url.includes('unsplash.com')) {
    const params = new URLSearchParams();
    if (options?.width) params.append('w', options.width.toString());
    if (options?.height) params.append('h', options.height.toString());
    if (options?.quality) params.append('q', options.quality.toString());
    return url.includes('?') ? `${url}&${params}` : `${url}?${params}`;
  }
  
  return url;
};

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload fonts
  const fonts = [
    '/fonts/inter-var.woff2',
    '/fonts/inter-var-italic.woff2',
  ];

  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = font;
    document.head.appendChild(link);
  });
};

// Export utility functions
export const measureLoadTime = (component: string) => performanceService.measureLoadTime(component);
export const measureApiCall = <T>(call: () => Promise<T>, endpoint: string) => 
  performanceService.measureApiCall(call, endpoint);
export const setCache = (key: string, data: any, ttl?: number) => 
  performanceService.setCache(key, data, ttl);
export const getCache = <T>(key: string) => performanceService.getCache<T>(key);
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => 
  performanceService.debounce(func, wait);
export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number) => 
  performanceService.throttle(func, limit);
