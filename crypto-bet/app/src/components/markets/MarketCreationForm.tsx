'use client';

import React, { useState } from 'react';
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

const MARKET_CATEGORIES = [
  { id: 'crypto', name: 'Cryptocurrency', icon: '₿' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'politics', name: 'Politics', icon: '🗳️' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'finance', name: 'Finance', icon: '📈' },
  { id: 'other', name: 'Other', icon: '📊' }
];

export function MarketCreationForm({ onSubmit, className }: MarketCreationFormProps) {
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

  const validateForm = (): boolean => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (error) {
      console.error('Market creation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleInputChange = (field: keyof MarketData, value: string | number) => {
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
  };

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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Market Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              placeholder="Provide detailed information about the market conditions, resolution criteria, and any important details..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={cn(
                "flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.description ? 'border-red-500' : ''
              )}
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {MARKET_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleInputChange('category', category.id)}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors',
                    formData.category === category.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-muted'
                  )}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.category}
              </p>
            )}
          </div>

          {/* End Date & Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                End Date
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('endDate', e.target.value)}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.endDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" />
                End Time
              </label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('endTime', e.target.value)}
                className={errors.endTime ? 'border-red-500' : ''}
              />
              {errors.endTime && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.endTime}
                </p>
              )}
            </div>
          </div>

          {/* Betting Limits */}
          <div className="grid md:grid-cols-2 gap-4">
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('minimumBet', parseFloat(e.target.value))}
                className={errors.minimumBet ? 'border-red-500' : ''}
              />
              {errors.minimumBet && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.minimumBet}
                </p>
              )}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('maximumBet', parseFloat(e.target.value))}
                className={errors.maximumBet ? 'border-red-500' : ''}
              />
              {errors.maximumBet && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.maximumBet}
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <Tag className="h-4 w-4" />
              Tags (Optional)
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1"
              />
              <Button type="button" onClick={addTag} variant="outline" size="sm">
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Market...' : `Create Market (${preferredToken})`}
          </Button>

          {/* Info Box */}
          <div className={cn(
            'p-4 rounded-lg border text-sm',
            modeConfig.bgColor
          )}>
            <p className="font-medium mb-2">Creating in {modeConfig.name}</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Market will accept bets in {preferredToken}</li>
              <li>• Creation fee: 0.1 {preferredToken}</li>
              <li>• You'll be the market resolver</li>
              <li>• Markets can't be deleted once created</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 