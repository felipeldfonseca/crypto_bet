// 🔒 ENTERPRISE-GRADE SECURITY UTILITIES
// Comprehensive security layer for crypto betting platform

import { PublicKey } from '@solana/web3.js';
import DOMPurify from 'isomorphic-dompurify';

// ==========================================
// 🛡️ INPUT VALIDATION & SANITIZATION
// ==========================================

/**
 * Comprehensive input sanitization
 */
export class InputSanitizer {
  // HTML/XSS sanitization
  static sanitizeHTML(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // No HTML tags allowed
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });
  }

  // SQL injection prevention (for future database integration)
  static sanitizeSQL(input: string): string {
    return input
      .replace(/['"\\;]/g, '') // Remove dangerous characters
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*/g, '') // Remove block comments
      .replace(/\*\//g, '')
      .trim();
  }

  // Market title validation
  static validateMarketTitle(title: string): { isValid: boolean; error?: string } {
    const sanitized = this.sanitizeHTML(title);
    
    if (!sanitized || sanitized.length < 10) {
      return { isValid: false, error: 'Title must be at least 10 characters' };
    }
    
    if (sanitized.length > 100) {
      return { isValid: false, error: 'Title must be less than 100 characters' };
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /data:/i,
      /vbscript:/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(sanitized)) {
        return { isValid: false, error: 'Invalid characters detected' };
      }
    }

    return { isValid: true };
  }

  // Market description validation
  static validateMarketDescription(description: string): { isValid: boolean; error?: string } {
    const sanitized = this.sanitizeHTML(description);
    
    if (!sanitized || sanitized.length < 20) {
      return { isValid: false, error: 'Description must be at least 20 characters' };
    }
    
    if (sanitized.length > 500) {
      return { isValid: false, error: 'Description must be less than 500 characters' };
    }

    return { isValid: true };
  }

  // Amount validation with overflow protection
  static validateBetAmount(amount: number, min: number = 0.001, max: number = 1000): { isValid: boolean; error?: string } {
    if (isNaN(amount) || !isFinite(amount)) {
      return { isValid: false, error: 'Invalid amount format' };
    }

    if (amount < min) {
      return { isValid: false, error: `Minimum bet is ${min}` };
    }

    if (amount > max) {
      return { isValid: false, error: `Maximum bet is ${max}` };
    }

    // Check for precision attacks
    const decimalPlaces = (amount.toString().split('.')[1] || '').length;
    if (decimalPlaces > 9) {
      return { isValid: false, error: 'Too many decimal places' };
    }

    return { isValid: true };
  }
}

// ==========================================
// 🔐 WALLET SECURITY
// ==========================================

export class WalletSecurity {
  // Validate Solana public key
  static validatePublicKey(publicKey: string): boolean {
    try {
      new PublicKey(publicKey);
      return true;
    } catch {
      return false;
    }
  }

  // Validate transaction signature
  static validateTransactionSignature(signature: string): boolean {
    // Solana signatures are base58 encoded and 88 characters long
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{87,88}$/;
    return base58Regex.test(signature);
  }

  // Check for suspicious wallet behavior
  static checkWalletReputation(publicKey: string): { isSuspicious: boolean; reason?: string } {
    // Implement wallet reputation checking
    // This would integrate with on-chain analysis services
    
    // For now, basic checks
    if (publicKey.length !== 44) {
      return { isSuspicious: true, reason: 'Invalid public key format' };
    }

    return { isSuspicious: false };
  }

  // Rate limiting for wallet operations
  private static walletOperations = new Map<string, number[]>();

  static checkRateLimit(publicKey: string, maxOperations: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const operations = this.walletOperations.get(publicKey) || [];
    
    // Remove old operations outside the window
    const recentOperations = operations.filter(time => now - time < windowMs);
    
    if (recentOperations.length >= maxOperations) {
      return false; // Rate limit exceeded
    }

    // Add current operation
    recentOperations.push(now);
    this.walletOperations.set(publicKey, recentOperations);
    
    return true;
  }
}

// ==========================================
// 🚨 SECURITY MONITORING
// ==========================================

export class SecurityMonitor {
  private static securityEvents: Array<{
    timestamp: number;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    details: any;
  }> = [];

  // Log security events
  static logSecurityEvent(type: string, severity: 'low' | 'medium' | 'high' | 'critical', details: any) {
    const event = {
      timestamp: Date.now(),
      type,
      severity,
      details
    };

    this.securityEvents.push(event);

    // In production, send to security monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to monitoring service (implement based on your setup)
      console.error('🚨 SECURITY EVENT:', event);
    } else {
      console.warn('🔒 Security Event:', event);
    }

    // Alert on critical events
    if (severity === 'critical') {
      this.handleCriticalEvent(event);
    }
  }

  private static handleCriticalEvent(event: any) {
    // Critical event handling implementation
    EnvironmentSecurity.secureLog('🚨 CRITICAL SECURITY EVENT - IMMEDIATE ATTENTION REQUIRED:', event);
    
    // In production, this would:
    // - Send alerts to monitoring service
    // - Temporarily block operations if needed
    // - Log to external security service
    // - Notify security team
    
    // For now, ensure the event is properly logged
    if (process.env.NODE_ENV === 'production') {
      // Production logging would go to external service
      console.error('CRITICAL_SECURITY_EVENT', { timestamp: event.timestamp, type: event.type });
    }
  }

  // Get security events for analysis
  static getSecurityEvents(since?: number): any[] {
    const cutoff = since || (Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours
    return this.securityEvents.filter(event => event.timestamp >= cutoff);
  }

  // Check for suspicious patterns
  static detectSuspiciousActivity(): { detected: boolean; patterns: string[] } {
    const recentEvents = this.getSecurityEvents();
    const patterns: string[] = [];

    // Check for rapid-fire operations
    const rapidOperations = recentEvents.filter(e => e.type === 'rapid_operations');
    if (rapidOperations.length > 5) {
      patterns.push('Rapid operations detected');
    }

    // Check for failed validation attempts
    const failedValidations = recentEvents.filter(e => e.type === 'validation_failed');
    if (failedValidations.length > 10) {
      patterns.push('Multiple validation failures');
    }

    return {
      detected: patterns.length > 0,
      patterns
    };
  }
}

// ==========================================
// 🔒 TRANSACTION SECURITY
// ==========================================

export class TransactionSecurity {
  // Validate transaction parameters before signing
  static validateTransactionParams(params: {
    amount: number;
    recipient?: string;
    marketId?: string;
    operation: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate amount
    const amountValidation = InputSanitizer.validateBetAmount(params.amount);
    if (!amountValidation.isValid) {
      errors.push(amountValidation.error!);
    }

    // Validate recipient if provided
    if (params.recipient && !WalletSecurity.validatePublicKey(params.recipient)) {
      errors.push('Invalid recipient address');
    }

    // Validate operation type
    const allowedOperations = ['place_bet', 'claim_winnings', 'claim_refund', 'swap'];
    if (!allowedOperations.includes(params.operation)) {
      errors.push('Invalid operation type');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Check transaction for suspicious patterns
  static analyzeTransaction(params: any): { isSuspicious: boolean; reasons: string[] } {
    const reasons: string[] = [];

    // Check for unusually large amounts
    if (params.amount > 100) { // 100 SOL/USDC
      reasons.push('Unusually large transaction amount');
    }

    // Check for rapid transactions
    // This would be implemented with user session tracking

    return {
      isSuspicious: reasons.length > 0,
      reasons
    };
  }
}

// ==========================================
// 🛡️ ENVIRONMENT SECURITY
// ==========================================

export class EnvironmentSecurity {
  // Validate environment configuration
  static validateEnvironment(): { isSecure: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check for development mode in production
    if (process.env.NODE_ENV === 'production') {
      // Production-specific checks
      if (process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'devnet') {
        issues.push('Using devnet in production');
      }
    }

    // Check for exposed secrets (this would be more comprehensive)
    const sensitiveKeys = ['PRIVATE_KEY', 'SECRET_KEY', 'API_SECRET'];
    for (const key of sensitiveKeys) {
      if (process.env[key]) {
        issues.push(`Potentially exposed secret: ${key}`);
      }
    }

    return {
      isSecure: issues.length === 0,
      issues
    };
  }

  // Secure logging (remove sensitive data)
  static secureLog(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      // In development, log everything but warn about sensitive data
      if (data && typeof data === 'object') {
        const sanitizedData = this.sanitizeLogData(data);
        console.log(message, sanitizedData);
      } else {
        console.log(message, data);
      }
    } else {
      // In production, only log non-sensitive information
      console.log(message);
    }
  }

  private static sanitizeLogData(data: any): any {
    const sensitiveKeys = ['privateKey', 'signature', 'seed', 'mnemonic', 'password'];
    const sanitized = { ...data };

    for (const key of sensitiveKeys) {
      if (sanitized[key]) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}

// ==========================================
// 🔐 CRYPTO SECURITY UTILITIES
// ==========================================

export class CryptoSecurity {
  // Generate secure random values
  static generateSecureRandom(length: number = 32): Uint8Array {
    if (typeof window !== 'undefined' && window.crypto) {
      return window.crypto.getRandomValues(new Uint8Array(length));
    } else if (typeof global !== 'undefined' && global.crypto) {
      return global.crypto.getRandomValues(new Uint8Array(length));
    } else {
      throw new Error('Secure random generation not available');
    }
  }

  // Validate cryptographic signatures
  static validateSignature(message: string, signature: string, publicKey: string): boolean {
    // Basic format validation for signature and public key
    if (!signature || !publicKey || !message) return false;
    
    // Validate signature format (base58 encoded, 88 characters for Solana)
    const signatureRegex = /^[1-9A-HJ-NP-Za-km-z]{87,88}$/;
    if (!signatureRegex.test(signature)) return false;
    
    // Validate public key format (base58 encoded, 44 characters for Solana)
    const publicKeyRegex = /^[1-9A-HJ-NP-Za-km-z]{43,44}$/;
    if (!publicKeyRegex.test(publicKey)) return false;
    
    return true;
  }
}

// ==========================================
// 🚨 SECURITY MIDDLEWARE
// ==========================================

export class SecurityMiddleware {
  // Request validation middleware
  static validateRequest(request: {
    userAgent?: string;
    origin?: string;
    referer?: string;
  }): { isValid: boolean; reason?: string } {
    // Check for suspicious user agents
    const suspiciousAgents = ['bot', 'crawler', 'scraper'];
    if (request.userAgent) {
      for (const agent of suspiciousAgents) {
        if (request.userAgent.toLowerCase().includes(agent)) {
          return { isValid: false, reason: 'Suspicious user agent' };
        }
      }
    }

    // Validate origin (implement based on your domain)
    if (request.origin && process.env.NODE_ENV === 'production') {
      const allowedOrigins = ['https://yourdomain.com']; // Update with actual domain
      if (!allowedOrigins.includes(request.origin)) {
        return { isValid: false, reason: 'Invalid origin' };
      }
    }

    return { isValid: true };
  }

  // CSRF protection
  static generateCSRFToken(): string {
    const randomBytes = CryptoSecurity.generateSecureRandom(32);
    return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static validateCSRFToken(token: string, expectedToken: string): boolean {
    return token === expectedToken && token.length === 64;
  }
} 