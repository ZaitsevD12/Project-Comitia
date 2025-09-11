import React, { useState } from 'react';
import { Star, Heart, Trophy, Zap, Sparkles, Play, Pause } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function TailwindTest() {
  const [sliderValue, setSliderValue] = useState([5]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const ratings = [
    { label: 'Excellent', value: 9.5, color: 'text-rating-excellent', bg: 'bg-rating-excellent/20' },
    { label: 'Good', value: 7.8, color: 'text-rating-good', bg: 'bg-rating-good/20' },
    { label: 'Mixed', value: 5.2, color: 'text-rating-mixed', bg: 'bg-rating-mixed/20' },
    { label: 'Poor', value: 3.1, color: 'text-rating-poor', bg: 'bg-rating-poor/20' },
    { label: 'Bad', value: 1.5, color: 'text-rating-bad', bg: 'bg-rating-bad/20' },
  ];

  const achievements = [
    { label: 'Gold', color: 'text-achievement-gold', icon: Trophy },
    { label: 'Silver', color: 'text-achievement-silver', icon: Star },
    { label: 'Bronze', color: 'text-achievement-bronze', icon: Heart },
  ];

  const olympusColors = [
    { label: 'Primary', color: 'text-olympus-primary' },
    { label: 'Secondary', color: 'text-olympus-secondary' },
    { label: 'Accent', color: 'text-olympus-accent' },
  ];

  const telegramColors = [
    { label: 'Blue', color: 'text-telegram-blue' },
    { label: 'Blue Dark', color: 'text-telegram-blue-dark' },
    { label: 'Light Blue', color: 'text-telegram-light-blue' },
  ];

  const textSizes = [
    { label: 'xs', class: 'text-xs' },
    { label: 'sm', class: 'text-sm' },
    { label: 'base', class: 'text-base' },
    { label: 'lg', class: 'text-lg' },
    { label: 'xl', class: 'text-xl' },
    { label: '2xl', class: 'text-2xl' },
    { label: '3xl', class: 'text-3xl' },
  ];

  return (
    <div className="p-4 space-y-8">
      {/* Typography Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-olympus-primary">Typography Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h1>Heading 1 (h1)</h1>
            <h2>Heading 2 (h2)</h2>
            <h3>Heading 3 (h3)</h3>
            <h4>Heading 4 (h4)</h4>
            <p>Paragraph text with normal styling</p>
            <label>Label text styling</label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {textSizes.map(({ label, class: className }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-8 text-xs text-muted-foreground">{label}</span>
                <span className={className}>Sample text {label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color System */}
      <Card>
        <CardHeader>
          <CardTitle className="text-olympus-secondary">Custom Color System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating Colors */}
          <div>
            <h4 className="mb-3">Rating Colors</h4>
            <div className="grid grid-cols-1 gap-3">
              {ratings.map(({ label, value, color, bg }) => (
                <div key={label} className={`p-3 rounded-lg ${bg} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <Star className={`h-4 w-4 ${color} fill-current`} />
                    <span className="font-medium">{label}</span>
                  </div>
                  <Badge className={`${color} bg-transparent border-current`}>
                    {value}/10
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement Colors */}
          <div>
            <h4 className="mb-3">Achievement Colors</h4>
            <div className="flex gap-4">
              {achievements.map(({ label, color, icon: Icon }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <Icon className={`h-8 w-8 ${color}`} />
                  <span className={`text-sm ${color}`}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Olympus Colors */}
          <div>
            <h4 className="mb-3">Olympus Colors</h4>
            <div className="flex gap-4">
              {olympusColors.map(({ label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full bg-current ${color}`}></div>
                  <span className={color}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Telegram Colors */}
          <div>
            <h4 className="mb-3">Telegram Colors</h4>
            <div className="flex gap-4">
              {telegramColors.map(({ label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full bg-current ${color}`}></div>
                  <span className={color}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animation Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-olympus-accent">Animations Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => setIsAnimating(!isAnimating)}
              variant="outline"
            >
              {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isAnimating ? 'Stop' : 'Start'} Animations
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 bg-muted rounded-lg text-center ${isAnimating ? 'animate-fade-in' : ''}`}>
              <span className="text-sm">Fade In</span>
            </div>
            <div className={`p-4 bg-muted rounded-lg text-center ${isAnimating ? 'animate-scale-in' : ''}`}>
              <span className="text-sm">Scale In</span>
            </div>
            <div className={`p-4 bg-muted rounded-lg text-center ${isAnimating ? 'animate-slide-up' : ''}`}>
              <span className="text-sm">Slide Up</span>
            </div>
            <div className={`p-4 bg-muted rounded-lg text-center ${isAnimating ? 'animate-bounce-in' : ''}`}>
              <span className="text-sm">Bounce In</span>
            </div>
            <div className={`p-4 bg-muted rounded-lg text-center ${isAnimating ? 'animate-shake' : ''}`}>
              <span className="text-sm">Shake</span>
            </div>
            <div className={`p-4 bg-olympus-primary/20 rounded-lg text-center text-olympus-primary ${isAnimating ? 'animate-olympus-glow' : ''}`}>
              <Sparkles className="h-6 w-6 mx-auto" />
              <span className="text-sm block mt-1">Olympus Glow</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* UI Components Test */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">UI Components Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Buttons */}
          <div>
            <h4 className="mb-3">Buttons</h4>
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          {/* Badges */}
          <div>
            <h4 className="mb-3">Badges</h4>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
              {ratings.slice(0, 3).map(({ label, color, bg }) => (
                <Badge key={label} className={`${color} ${bg} border-current`}>
                  {label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div>
            <h4 className="mb-3">Progress</h4>
            <div className="space-y-2">
              <Progress value={33} />
              <Progress value={66} />
              <Progress value={90} />
            </div>
          </div>

          {/* Slider */}
          <div>
            <h4 className="mb-3">Slider</h4>
            <div className="space-y-4">
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={10}
                min={1}
                step={0.1}
              />
              <div className="text-center">
                <Badge className="text-rating-good bg-rating-good/20">
                  {sliderValue[0].toFixed(1)}/10
                </Badge>
              </div>
            </div>
          </div>

          {/* Form Controls */}
          <div>
            <h4 className="mb-3">Form Controls</h4>
            <div className="space-y-4">
              <Input placeholder="Enter text..." />
              <Textarea placeholder="Enter description..." rows={3} />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Switch id="test-switch" />
                <label htmlFor="test-switch" className="text-sm">Enable notifications</label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsive Test */}
      <Card>
        <CardHeader>
          <CardTitle>Responsive Grid Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="p-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg text-center animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-8 h-8 bg-primary rounded-full mx-auto mb-2"></div>
                <span className="text-sm">Card {i + 1}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}