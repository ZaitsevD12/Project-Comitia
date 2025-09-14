import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertTriangle, Plus, Gamepad2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader } from './ui/card';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { genres, platforms } from '../data/mockData';
import { Genre, Platform } from '../types';
interface AddGameFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}
export function AddGameForm({ onSubmit, onCancel }: AddGameFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | ''>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [releaseYear, setReleaseYear] = useState('');
  const [developer, setDeveloper] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
  };
  const handlePlatformToggle = (platform: Platform, checked: boolean) => {
    if (checked) {
      setSelectedPlatforms(prev => [...prev, platform]);
    } else {
      setSelectedPlatforms(prev => prev.filter(p => p !== platform));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await fetch('/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title, description, genre: selectedGenre, platforms: selectedPlatforms,
        image: coverImagePreview, releaseYear: parseInt(releaseYear), developer
      })
    });
    setIsSubmitting(false);
    setShowSuccessAlert(true);
    setTimeout(onSubmit, 1500);
  };
  const isFormValid =
    title.trim().length > 0 &&
    description.trim().length > 10 &&
    selectedGenre &&
    selectedPlatforms.length > 0 &&
    releaseYear &&
    developer.trim().length > 0;
  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Gamepad2 className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h2 className="text-lg font-medium mb-1">Add Game to Catalog</h2>
        <p className="text-sm text-muted-foreground">
          Help expand our gaming database with your favorite titles
        </p>
      </div>
      {showSuccessAlert && (
        <Alert className="animate-bounce-in border-green-600/20 bg-green-600/10">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Game submitted successfully! It will be reviewed and added to the catalog.
          </AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Image Upload */}
        <Card>
          <CardHeader className="pb-3">
            <Label className="text-base">Cover Image</Label>
            <p className="text-sm text-muted-foreground">
              Upload a high-quality cover image for the game
            </p>
          </CardHeader>
          <CardContent>
            {!coverImagePreview ? (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Tap to upload cover image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-3">
                <div className="relative group">
                  <img
                    src={coverImagePreview}
                    alt="Cover preview"
                    className="w-full h-32 object-cover rounded-lg transition-all duration-300"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 delete-button opacity-90 hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
                    onClick={removeCoverImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Game Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Game Title *</Label>
          <Input
            id="title"
            placeholder="Enter the full game title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {/* Developer */}
        <div className="space-y-2">
          <Label htmlFor="developer">Developer *</Label>
          <Input
            id="developer"
            placeholder="Game developer/studio name"
            value={developer}
            onChange={(e) => setDeveloper(e.target.value)}
          />
        </div>
        {/* Release Year */}
        <div className="space-y-2">
          <Label htmlFor="release-year">Release Year *</Label>
          <Input
            id="release-year"
            type="number"
            placeholder="2024"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            min="1970"
            max={new Date().getFullYear() + 2}
          />
        </div>
        {/* Genre */}
        <div className="space-y-2">
          <Label>Genre *</Label>
          <Select value={selectedGenre} onValueChange={(value) => setSelectedGenre(value as Genre)}>
            <SelectTrigger>
              <SelectValue placeholder="Select primary genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map(genre => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Platforms */}
        <Card>
          <CardHeader className="pb-3">
            <Label className="text-base">Platforms *</Label>
            <p className="text-sm text-muted-foreground">
              Select all platforms where this game is available
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {platforms.map(platform => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox
                  id={`platform-${platform}`}
                  checked={selectedPlatforms.includes(platform)}
                  onCheckedChange={(checked) => handlePlatformToggle(platform, checked as boolean)}
                />
                <Label htmlFor={`platform-${platform}`} className="font-normal">
                  {platform}
                </Label>
              </div>
            ))}

            {selectedPlatforms.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
                {selectedPlatforms.map(platform => (
                  <Badge key={platform} variant="secondary" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Game Description *</Label>
          <Textarea
            id="description"
            placeholder="Provide a brief description of the game... (minimum 10 characters)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="text-xs text-muted-foreground text-right">
            {description.length}/500 characters
          </div>
        </div>
        {/* Info Alert */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Submitted games will be reviewed by our team before being added to the public catalog.
            This helps maintain quality and prevent duplicates.
          </AlertDescription>
        </Alert>
        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-b-transparent" />
                <span>Submitting...</span>
              </div>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Submit Game
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}