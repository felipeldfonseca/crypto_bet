'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useBettingMode } from '@/components/providers/BettingModeProvider';
import { Calendar, Clock, DollarSign, Tag, AlertCircle, Shield } from 'lucide-react';
import { 
  InputSanitizer, 
  SecurityMonitor, 
  TransactionSecurity,
  EnvironmentSecurity 
} from '@/lib/security';

interface MarketCreationFormProps {
  onSubmit?: (marketData: MarketData) => void;
  className?: string;
}

export interface MarketData {
  title: string;
  description: string;
  category: string;
  endDate: string;
  endTime: string;
  minimumBet: number;
  maximumBet: number;
  tags: string[];
}

// Memoize static data to prevent recreation
const MARKET_CATEGORIES = [
  { id: 'crypto', name: 'Cryptocurrency', icon: '₿' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'politics', name: 'Politics', icon: '🗳️' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'finance', name: 'Finance', icon: '📈' },
  { id: 'other', name: 'Other', icon: '��' }
] as const;

// 🔒 Security-enhanced error message component
const ErrorMessage = React.memo<{ message: string }>(function ErrorMessage({ message }) {
  return (
    <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
      <AlertCircle className="h-4 w-4" />
      {message}
    </div>
  );
});

// 🛡️ Security warning component
const SecurityWarning = React.memo<{ message: string }>(function SecurityWarning({ message }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
      <Shield className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
});

// Memoized tag component
const TagItem = React.memo<{ tag: string; onRemove: (tag: string) => void }>(function TagItem({ tag, onRemove }) {
  const handleRemove = useCallback(() => {
    onRemove(tag);
  }, [tag, onRemove]);

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      {tag}
      <button
        type="button"
        onClick={handleRemove}
        className="ml-1 hover:text-destructive"
      >
        ×
      </button>
    </Badge>
  );
});

export const MarketCreationForm = React.memo<MarketCreationFormProps>(function MarketCreationForm({ 
  onSubmit, 
  className 
}) {
  const { getModeConfig, preferredToken } = useBettingMode();
  const modeConfig = getModeConfig();
  
  const [formData, setFormData] = useState<MarketData>({
    title: '',
    description: '',
    category: '',
    endDate: '',
    endTime: '',
    minimumBet: 0.01,
    maximumBet: 1000,
    tags: []
  });

  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [securityWarnings, setSecurityWarnings] = useState<string[]>([]);

  // 🔒 Enhanced validation function with security checks
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    const warnings: string[] = [];

    // 🛡️ Validate and sanitize title
    const titleValidation = InputSanitizer.validateMarketTitle(formData.title);
    if (!titleValidation.isValid) {
      newErrors.title = titleValidation.error!;
      SecurityMonitor.logSecurityEvent('validation_failed', 'medium', {
        field: 'title',
        error: titleValidation.error,
        input: formData.title.substring(0, 50) // Log only first 50 chars
      });
    }

    // 🛡️ Validate and sanitize description
    const descriptionValidation = InputSanitizer.validateMarketDescription(formData.description);
    if (!descriptionValidation.isValid) {
      newErrors.description = descriptionValidation.error!;
      SecurityMonitor.logSecurityEvent('validation_failed', 'medium', {
        field: 'description',
        error: descriptionValidation.error
      });
    }

    // 🔒 Category validation
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    // 🔒 Date validation with security checks
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else {
      const endDate = new Date(formData.endDate);
      const now = new Date();
      const maxFutureDate = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year

      if (endDate <= now) {
        newErrors.endDate = 'End date must be in the future';
      } else if (endDate > maxFutureDate) {
        newErrors.endDate = 'End date cannot be more than 1 year in the future';
        warnings.push('Unusually long market duration detected');
      }
    }

    // 🔒 Time validation
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    // 🛡️ Bet amount validation with overflow protection
    const minBetValidation = InputSanitizer.validateBetAmount(formData.minimumBet, 0.001, 10);
    if (!minBetValidation.isValid) {
      newErrors.minimumBet = minBetValidation.error!;
    }

    const maxBetValidation = InputSanitizer.validateBetAmount(formData.maximumBet, 0.01, 1000);
    if (!maxBetValidation.isValid) {
      newErrors.maximumBet = maxBetValidation.error!;
    }

    if (formData.maximumBet <= formData.minimumBet) {
      newErrors.maximumBet = 'Maximum bet must be greater than minimum bet';
    }

    // 🚨 Check for suspicious patterns
    if (formData.maximumBet > 100) {
      warnings.push('High maximum bet amount detected - ensure this is intentional');
    }

    // 🔒 Validate tags
    for (const tag of formData.tags) {
      const sanitizedTag = InputSanitizer.sanitizeHTML(tag);
      if (sanitizedTag !== tag) {
        warnings.push('Some tags contain suspicious characters and have been sanitized');
      }
    }

    setErrors(newErrors);
    setSecurityWarnings(warnings);

    // 🚨 Log security events for suspicious activity
    if (warnings.length > 0) {
      SecurityMonitor.logSecurityEvent('suspicious_form_data', 'medium', {
        warnings,
        formData: {
          titleLength: formData.title.length,
          descriptionLength: formData.description.length,
          maxBet: formData.maximumBet,
          tagCount: formData.tags.length
        }
      });
    }

    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // 🔒 Enhanced submit handler with security validation
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🛡️ Environment security check
    const envCheck = EnvironmentSecurity.validateEnvironment();
    if (!envCheck.isSecure) {
      SecurityMonitor.logSecurityEvent('environment_security_issue', 'high', {
        issues: envCheck.issues
      });
    }

    if (!validateForm()) {
      SecurityMonitor.logSecurityEvent('form_validation_failed', 'low', {
        errorCount: Object.keys(errors).length
      });
      return;
    }

    // 🔒 Transaction security validation
    const transactionValidation = TransactionSecurity.validateTransactionParams({
      amount: formData.maximumBet,
      operation: 'create_market'
    });

    if (!transactionValidation.isValid) {
      SecurityMonitor.logSecurityEvent('transaction_validation_failed', 'high', {
        errors: transactionValidation.errors
      });
      setErrors({ general: 'Transaction validation failed. Please check your inputs.' });
      return;
    }

    setIsSubmitting(true);
    try {
      // 🛡️ Sanitize form data before submission
      const sanitizedData: MarketData = {
        title: InputSanitizer.sanitizeHTML(formData.title),
        description: InputSanitizer.sanitizeHTML(formData.description),
        category: formData.category,
        endDate: formData.endDate,
        endTime: formData.endTime,
        minimumBet: formData.minimumBet,
        maximumBet: formData.maximumBet,
        tags: formData.tags.map(tag => InputSanitizer.sanitizeHTML(tag))
      };

      // 🔒 Log successful form submission
      SecurityMonitor.logSecurityEvent('market_creation_attempt', 'low', {
        category: sanitizedData.category,
        betRange: `${sanitizedData.minimumBet}-${sanitizedData.maximumBet}`,
        tagCount: sanitizedData.tags.length
      });

      await onSubmit?.(sanitizedData);
      
      // Reset form on success
      setFormData({
        title: '',
        description: '',
        category: '',
        endDate: '',
        endTime: '',
        minimumBet: 0.01,
        maximumBet: 1000,
        tags: []
      });
      setErrors({});
      setSecurityWarnings([]);

      SecurityMonitor.logSecurityEvent('market_creation_success', 'low', {
        category: sanitizedData.category
      });

    } catch (error) {
      SecurityMonitor.logSecurityEvent('market_creation_failed', 'medium', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      EnvironmentSecurity.secureLog('Market creation failed:', error);
      setErrors({ general: 'Market creation failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, onSubmit, formData, errors]);

  // 🔒 Enhanced tag handlers with security validation
  const addTag = useCallback(() => {
    const sanitizedTag = InputSanitizer.sanitizeHTML(newTag.trim());
    
    if (sanitizedTag && !formData.tags.includes(sanitizedTag) && formData.tags.length < 5) {
      if (sanitizedTag !== newTag.trim()) {
        SecurityMonitor.logSecurityEvent('tag_sanitized', 'low', {
          original: newTag.trim(),
          sanitized: sanitizedTag
        });
      }
      
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, sanitizedTag]
      }));
      setNewTag('');
    }
  }, [newTag, formData.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  // 🔒 Secure input change handler
  const handleInputChange = useCallback((field: keyof MarketData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Clear security warnings when user makes changes
    if (securityWarnings.length > 0) {
      setSecurityWarnings([]);
    }
  }, [errors, securityWarnings]);

  // Memoized category selection handler
  const handleCategorySelect = useCallback((categoryId: string) => {
    handleInputChange('category', categoryId);
  }, [handleInputChange]);

  // Memoized tag input handlers
  const handleNewTagChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  }, []);

  const handleTagKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  }, [addTag]);

  // Memoized form field handlers
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('title', e.target.value);
  }, [handleInputChange]);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange('description', e.target.value);
  }, [handleInputChange]);

  const handleEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('endDate', e.target.value);
  }, [handleInputChange]);

  const handleEndTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('endTime', e.target.value);
  }, [handleInputChange]);

  const handleMinBetChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('minimumBet', parseFloat(e.target.value) || 0);
  }, [handleInputChange]);

  const handleMaxBetChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('maximumBet', parseFloat(e.target.value) || 0);
  }, [handleInputChange]);

  // Memoized minimum date for date input
  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }, []);

  // Memoized maximum date (1 year from now)
  const maxDate = useMemo(() => {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    return oneYearFromNow.toISOString().split('T')[0];
  }, []);

  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{modeConfig.icon}</span>
          Create New Market
          <Badge variant="outline" className={modeConfig.color}>
            {preferredToken} Mode
          </Badge>
          <Shield className="h-5 w-5 text-green-600 ml-auto" />
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* 🚨 Security Warnings */}
        {securityWarnings.length > 0 && (
          <div className="space-y-2 mb-6">
            {securityWarnings.map((warning, index) => (
              <SecurityWarning key={index} message={warning} />
            ))}
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="mb-6">
            <ErrorMessage message={errors.general} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Market Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Market Title</label>
            <Input
              placeholder="e.g., Will Bitcoin reach $100,000 by end of 2024?"
              value={formData.title}
              onChange={handleTitleChange}
              className={errors.title ? 'border-red-500' : ''}
              maxLength={100}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formData.title.length}/100 characters</span>
              <span>🔒 XSS Protected</span>
            </div>
            {errors.title && <ErrorMessage message={errors.title} />}
          </div>

          {/* Market Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              placeholder="Provide detailed information about the market conditions, resolution criteria, and any important details..."
              value={formData.description}
              onChange={handleDescriptionChange}
              className={cn(
                "flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.description ? 'border-red-500' : ''
              )}
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formData.description.length}/500 characters</span>
              <span>🔒 Input Sanitized</span>
            </div>
            {errors.description && <ErrorMessage message={errors.description} />}
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {MARKET_CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  type="button"
                  variant={formData.category === category.id ? "default" : "outline"}
                  onClick={() => handleCategorySelect(category.id)}
                  className="flex items-center gap-2 h-auto py-3"
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm">{category.name}</span>
                </Button>
              ))}
            </div>
            {errors.category && <ErrorMessage message={errors.category} />}
          </div>

          {/* End Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                End Date
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={handleEndDateChange}
                min={minDate}
                max={maxDate}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && <ErrorMessage message={errors.endDate} />}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" />
                End Time
              </label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={handleEndTimeChange}
                className={errors.endTime ? 'border-red-500' : ''}
              />
              {errors.endTime && <ErrorMessage message={errors.endTime} />}
            </div>
          </div>

          {/* Betting Limits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Minimum Bet ({preferredToken})
              </label>
              <Input
                type="number"
                step="0.001"
                min="0.001"
                max="10"
                value={formData.minimumBet}
                onChange={handleMinBetChange}
                className={errors.minimumBet ? 'border-red-500' : ''}
              />
              {errors.minimumBet && <ErrorMessage message={errors.minimumBet} />}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Maximum Bet ({preferredToken})
              </label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                max="1000"
                value={formData.maximumBet}
                onChange={handleMaxBetChange}
                className={errors.maximumBet ? 'border-red-500' : ''}
              />
              {errors.maximumBet && <ErrorMessage message={errors.maximumBet} />}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Tag className="h-4 w-4" />
              Tags (Optional, max 5)
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={handleNewTagChange}
                onKeyPress={handleTagKeyPress}
                disabled={formData.tags.length >= 5}
                className="flex-1"
                maxLength={20}
              />
              <Button
                type="button"
                onClick={addTag}
                disabled={!newTag.trim() || formData.tags.includes(newTag.trim()) || formData.tags.length >= 5}
                variant="outline"
              >
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <TagItem key={tag} tag={tag} onRemove={removeTag} />
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? 'Creating Market...' : 'Create Market'}
          </Button>

          {/* Market Preview */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              Market Preview
              <Shield className="h-4 w-4 text-green-600" />
            </h4>
            <p className="text-sm text-muted-foreground">
              This market will accept bets between {formData.minimumBet} and {formData.maximumBet} {preferredToken}
              {formData.endDate && formData.endTime && (
                <> and will close on {new Date(`${formData.endDate}T${formData.endTime}`).toLocaleString()}</>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              🔒 All inputs are validated and sanitized for security
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}); 