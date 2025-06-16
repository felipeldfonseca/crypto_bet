'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useBettingMode } from '@/components/providers/BettingModeProvider';
import { Calendar, Clock, DollarSign, Tag, AlertCircle } from 'lucide-react';

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
  { id: 'other', name: 'Other', icon: '📊' }
] as const;

// Memoized error message component
const ErrorMessage = React.memo<{ message: string }>(function ErrorMessage({ message }) {
  return (
    <p className="text-sm text-red-600 flex items-center gap-1">
      <AlertCircle className="h-4 w-4" />
      {message}
    </p>
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
        className="ml-1 text-xs hover:text-red-600"
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

  // Memoized validation function to prevent recreation
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Market title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Market description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (new Date(formData.endDate) <= new Date()) {
      newErrors.endDate = 'End date must be in the future';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.minimumBet <= 0) {
      newErrors.minimumBet = 'Minimum bet must be greater than 0';
    }

    if (formData.maximumBet <= formData.minimumBet) {
      newErrors.maximumBet = 'Maximum bet must be greater than minimum bet';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Memoized submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(formData);
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
    } catch (error) {
      console.error('Market creation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, onSubmit, formData]);

  // Memoized tag handlers
  const addTag = useCallback(() => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
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

  // Memoized input change handler
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
  }, [errors]);

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

  return (
    <Card className={cn('w-full max-w-2xl mx-auto', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{modeConfig.icon}</span>
          Create New Market
          <Badge variant="outline" className={modeConfig.color}>
            {preferredToken} Mode
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Market Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Market Title</label>
            <Input
              placeholder="e.g., Will Bitcoin reach $100,000 by end of 2024?"
              value={formData.title}
              onChange={handleTitleChange}
              className={errors.title ? 'border-red-500' : ''}
            />
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
            />
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
                step="0.01"
                min="0.01"
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
            <h4 className="font-medium text-sm">Market Preview</h4>
            <p className="text-sm text-muted-foreground">
              This market will accept bets between {formData.minimumBet} and {formData.maximumBet} {preferredToken}
              {formData.endDate && formData.endTime && (
                <> and will close on {new Date(`${formData.endDate}T${formData.endTime}`).toLocaleString()}</>
              )}
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}); 