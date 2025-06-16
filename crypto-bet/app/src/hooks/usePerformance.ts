import { useEffect, useRef, useCallback } from 'react';
import { PerformanceMonitor, getMemoryUsage } from '@/lib/performance';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: any | null;
  componentName: string;
}

export function usePerformance(componentName: string) {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);
  const mountTime = useRef<number>(0);

  // Track component mount time
  useEffect(() => {
    mountTime.current = performance.now();
    PerformanceMonitor.mark(`${componentName}-mount-start`);
    
    return () => {
      const unmountTime = performance.now();
      const totalMountTime = unmountTime - mountTime.current;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 ${componentName} was mounted for ${totalMountTime.toFixed(2)}ms`);
      }
      
      PerformanceMonitor.mark(`${componentName}-unmount`);
      PerformanceMonitor.measure(
        `${componentName}-lifecycle`,
        `${componentName}-mount-start`,
        `${componentName}-unmount`
      );
    };
  }, [componentName]);

  // Track render performance
  useEffect(() => {
    renderCount.current += 1;
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    
    if (process.env.NODE_ENV === 'development' && renderCount.current > 1) {
      console.log(`⚡ ${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
      
      // Warn about excessive re-renders
      if (renderCount.current > 10) {
        console.warn(`⚠️ ${componentName} has re-rendered ${renderCount.current} times. Consider optimization.`);
      }
    }
  });

  // Mark render start
  renderStartTime.current = performance.now();
  PerformanceMonitor.mark(`${componentName}-render-${renderCount.current}`);

  const getMetrics = useCallback((): PerformanceMetrics => {
    const renderTime = performance.now() - renderStartTime.current;
    const memoryUsage = getMemoryUsage();
    
    return {
      renderTime,
      memoryUsage,
      componentName,
    };
  }, [componentName]);

  const logMetrics = useCallback(() => {
    const metrics = getMetrics();
    console.group(`📊 Performance Metrics: ${componentName}`);
    console.log('Render time:', `${metrics.renderTime.toFixed(2)}ms`);
    console.log('Render count:', renderCount.current);
    console.log('Memory usage:', metrics.memoryUsage);
    console.groupEnd();
  }, [componentName, getMetrics]);

  return {
    getMetrics,
    logMetrics,
    renderCount: renderCount.current,
  };
}

// Hook for tracking expensive operations
export function useOperationTracking() {
  const trackOperation = useCallback(<T>(
    operationName: string,
    operation: () => T
  ): T => {
    const startTime = performance.now();
    PerformanceMonitor.mark(`${operationName}-start`);
    
    try {
      const result = operation();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      PerformanceMonitor.mark(`${operationName}-end`);
      PerformanceMonitor.measure(operationName, `${operationName}-start`, `${operationName}-end`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${operationName}: ${duration.toFixed(2)}ms`);
        
        // Warn about slow operations
        if (duration > 100) {
          console.warn(`🐌 Slow operation detected: ${operationName} took ${duration.toFixed(2)}ms`);
        }
      }
      
      return result;
    } catch (error) {
      PerformanceMonitor.mark(`${operationName}-error`);
      throw error;
    }
  }, []);

  const trackAsyncOperation = useCallback(async <T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    PerformanceMonitor.mark(`${operationName}-start`);
    
    try {
      const result = await operation();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      PerformanceMonitor.mark(`${operationName}-end`);
      PerformanceMonitor.measure(operationName, `${operationName}-start`, `${operationName}-end`);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${operationName} (async): ${duration.toFixed(2)}ms`);
        
        // Warn about slow async operations
        if (duration > 500) {
          console.warn(`🐌 Slow async operation: ${operationName} took ${duration.toFixed(2)}ms`);
        }
      }
      
      return result;
    } catch (error) {
      PerformanceMonitor.mark(`${operationName}-error`);
      throw error;
    }
  }, []);

  return {
    trackOperation,
    trackAsyncOperation,
  };
}

// Hook for monitoring bundle size impact
export function useBundleMonitoring() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Log bundle information on mount
      console.group('📦 Bundle Monitoring');
      console.log('Performance entries:', PerformanceMonitor.getEntries().length);
      console.log('Memory usage:', getMemoryUsage());
      
      // Check for large bundles
      const navigationEntries = PerformanceMonitor.getEntries('navigation');
      if (navigationEntries.length > 0) {
        const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
        console.log('DOM Content Loaded:', `${navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart}ms`);
        console.log('Load Complete:', `${navEntry.loadEventEnd - navEntry.loadEventStart}ms`);
      }
      
      console.groupEnd();
    }
  }, []);

  const analyzeBundle = useCallback(() => {
    const entries = PerformanceMonitor.getEntries();
    const resourceEntries = entries.filter(entry => entry.entryType === 'resource');
    
    const bundleAnalysis = {
      totalResources: resourceEntries.length,
      jsResources: resourceEntries.filter(entry => entry.name.includes('.js')).length,
      cssResources: resourceEntries.filter(entry => entry.name.includes('.css')).length,
      imageResources: resourceEntries.filter(entry => 
        entry.name.includes('.png') || 
        entry.name.includes('.jpg') || 
        entry.name.includes('.svg')
      ).length,
    };
    
    console.table(bundleAnalysis);
    return bundleAnalysis;
  }, []);

  return { analyzeBundle };
} 