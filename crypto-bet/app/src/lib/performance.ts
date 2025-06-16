/**
 * Performance utilities for React components and application optimization
 */

// Debounce function with cancellation support
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout;
  
  const debouncedFunction = function (this: any, ...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  } as T & { cancel: () => void };
  
  debouncedFunction.cancel = () => {
    clearTimeout(timeout);
  };
  
  return debouncedFunction;
}

// Throttle function for high-frequency events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;
  
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  } as T;
}

// RAF-based throttle for smooth animations
export function rafThrottle<T extends (...args: any[]) => any>(func: T): T {
  let rafId: number | null = null;
  
  return function (this: any, ...args: Parameters<T>) {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func.apply(this, args);
        rafId = null;
      });
    }
  } as T;
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };
  
  return new IntersectionObserver(callback, defaultOptions);
}

// Performance measurement utilities
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();
  
  static mark(name: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(name);
      this.marks.set(name, performance.now());
    }
  }
  
  static measure(name: string, startMark: string, endMark?: string): number {
    if (typeof performance !== 'undefined') {
      const endTime = endMark ? this.marks.get(endMark) : performance.now();
      const startTime = this.marks.get(startMark);
      
      if (startTime && endTime) {
        const duration = endTime - startTime;
        performance.measure(name, startMark, endMark);
        return duration;
      }
    }
    return 0;
  }
  
  static getEntries(type?: string): PerformanceEntry[] {
    if (typeof performance !== 'undefined') {
      return type 
        ? performance.getEntriesByType(type)
        : performance.getEntries();
    }
    return [];
  }
  
  static clear(): void {
    if (typeof performance !== 'undefined') {
      performance.clearMarks();
      performance.clearMeasures();
      this.marks.clear();
    }
  }
}

// Memory usage monitoring
export function getMemoryUsage(): any | null {
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    return (performance as any).memory;
  }
  return null;
}

// Bundle size analyzer helper
export function logBundleInfo(): void {
  if (process.env.NODE_ENV === 'development') {
    console.group('📦 Bundle Information');
    console.log('React version:', React.version);
    console.log('Next.js version:', process.env.NEXT_RUNTIME || 'Unknown');
    console.log('Environment:', process.env.NODE_ENV);
    console.groupEnd();
  }
}

// Component render tracking
export function withRenderTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  return function TrackedComponent(props: P) {
    React.useEffect(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 ${componentName} rendered`);
      }
    });
    
    return React.createElement(Component, props);
  };
}

// Lazy loading with error boundary
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): React.LazyExoticComponent<T> {
  const LazyComponent = React.lazy(importFunc);
  
  if (fallback) {
    return React.lazy(async () => {
      try {
        return await importFunc();
      } catch (error) {
        console.error('Lazy loading failed:', error);
        return { default: fallback as T };
      }
    });
  }
  
  return LazyComponent;
}

// Image preloader
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Batch DOM updates
export function batchDOMUpdates(updates: (() => void)[]): void {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
}

// Virtual scrolling helper
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function calculateVirtualScrollRange(
  scrollTop: number,
  totalItems: number,
  options: VirtualScrollOptions
): { startIndex: number; endIndex: number; offsetY: number } {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(totalItems - 1, startIndex + visibleItems + overscan);
  const offsetY = startIndex * itemHeight;
  
  return { startIndex, endIndex, offsetY };
}

// Export React for the withRenderTracking function
import React from 'react'; 