import React, { useState, useEffect } from 'react';
import { Camera, Upload, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader } from './ui/card';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { MetacriticRating } from './MetacriticRating';
import { platforms } from '../data/mockData';
import { Platform } from '../types';
interface AddReviewFormProps {
  gameId: string | null;
  reviewId?: number; // Optional for edit
  onSubmit: () => void;
  onCancel: () => void;
}
export function AddReviewForm({ gameId, reviewId, onSubmit, onCancel }: AddReviewFormProps) {
  const [score, setScore] = useState(75);
  const [reviewText, setReviewText] = useState('');
  const [hoursPlayed, setHoursPlayed] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | ''>('');
  const [completed, setCompleted] = useState(false);
  const [recommended, setRecommended] = useState(true);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'none' | 'valid' | 'invalid'>('none');
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [game, setGame] = useState(null);
  useEffect(() => {
    if (gameId) {
      fetch(`/api/games/${gameId}`)
        .then(res => res.json())
        .then(data => setGame(data));
    }
    if (reviewId) {
      fetch(`/api/reviews/${reviewId}`)
        .then(res => res.json())
        .then(data => {
          setScore(data.score);
          setReviewText(data.reviewText);
          setHoursPlayed(data.hoursPlayed.toString());
          setSelectedPlatform(data.platform);
          setCompleted(data.completed);
          setRecommended(data.recommended);
          //setScreenshotPreview(data.screenshot);
          //setValidationStatus(data.verified ? 'valid' : 'none');
        });
    }
  }, [gameId, reviewId]);
  //const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  // const file = e.target.files?.[0];
  // if (file) {
  // setScreenshot(file);
  // const reader = new FileReader();
  // reader.onload = () => {
  // setScreenshotPreview(reader.result as string);
  // setIsValidating(true);
  // setTimeout(() => {
  // setIsValidating(false);
  // setValidationStatus(Math.random() > 0.3 ? 'valid' : 'invalid');
  // }, 2000);
  // };
  // reader.readAsDataURL(file);
  // }
  //};
  //const removeScreenshot = () => {
  // setScreenshot(null);
  // setScreenshotPreview(null);
  // setValidationStatus('none');
  //};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId) {
      console.error('No userId found');
      return;
    }
    const method = reviewId ? 'PUT' : 'POST';
    const url = reviewId ? `/api/reviews/${reviewId}` : '/api/reviews';
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        gameId, userId: parseInt(userId), score, reviewText, hoursPlayed: parseInt(hoursPlayed),
        platform: selectedPlatform, completed, recommended, screenshot: screenshotPreview
      })
    });
    if (res.ok) {
      onSubmit();
    } else if (method === 'POST') {
      setShowDuplicateAlert(true);
    }
  };
  const isFormValid = reviewText.trim().length > 20 && hoursPlayed && selectedPlatform;
  if (!game) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Game not found</p>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-medium mb-1">{reviewId ? 'Edit' : 'Add'} Review for {game.title}</h2>
        <p className="text-sm text-muted-foreground">Share your experience with other gamers</p>
      </div>
      {showDuplicateAlert && (
        <Alert className="animate-bounce-in">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You've already reviewed this game. You can edit your existing review from your profile.
          </AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Score */}
        <Card>
          <CardHeader className="pb-3">
            <Label className="text-base">Score (0-100)</Label>
            <p className="text-sm text-muted-foreground">
              Rate the game on a scale of 0-100 for more precise scoring
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <MetacriticRating
                score={score}
                maxScore={100}
                size="lg"
                showScore={true}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Slider
                  value={[score]}
                  onValueChange={(value) => setScore(value[0])}
                  max={100}
                  min={0}
                  step={1}
                  className="flex-1"
                />
                <div className="w-16">
                  <Input
                    type="number"
                    value={score}
                    onChange={(e) => {
                      const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                      setScore(value);
                    }}
                    min={0}
                    max={100}
                    className="text-center"
                  />
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0-19: Bad</span>
                <span>20-49: Mixed</span>
                <span>50-74: Good</span>
                <span>75-100: Excellent</span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Review Text */}
        <div className="space-y-2">
          <Label htmlFor="review-text">Review</Label>
          <Textarea
            id="review-text"
            placeholder="Share your thoughts about the game... (minimum 20 characters)"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="text-xs text-muted-foreground text-right">
            {reviewText.length}/5000 characters
          </div>
        </div>
        {/* Hours Played */}
        <div className="space-y-2">
          <Label htmlFor="hours-played">Hours Played</Label>
          <Input
            id="hours-played"
            type="number"
            placeholder="0"
            value={hoursPlayed}
            onChange={(e) => setHoursPlayed(e.target.value)}
            min="0"
            max="10000"
          />
        </div>
        {/* Platform */}
        <div className="space-y-2">
          <Label>Platform</Label>
          <Select value={selectedPlatform} onValueChange={(value) => setSelectedPlatform(value as Platform)}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map(platform => (
                <SelectItem key={platform} value={platform}>{platform}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Completion Status */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="completed"
            checked={completed}
            onCheckedChange={(checked) => setCompleted(checked as boolean)}
          />
          <Label htmlFor="completed">I completed this game</Label>
        </div>
        {/* Recommendation */}
        <div className="flex items-center justify-between">
          <Label htmlFor="recommend">Would you recommend this game?</Label>
          <Switch
            id="recommend"
            checked={recommended}
            onCheckedChange={setRecommended}
          />
        </div>
        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={!isFormValid}
          >
            {reviewId ? 'Update Review' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </div>
  );
}