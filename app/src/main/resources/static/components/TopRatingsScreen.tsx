import React, { useState, useEffect } from 'react';
import { TrendingUp, Filter, Star, Crown, Award, Medal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MetacriticRating } from './MetacriticRating';
import { genres, platforms } from '../data/mockData';
import { Genre, Platform } from '../types';
interface TopRatingsScreenProps {
  onGameSelect: (gameId: string) => void;
}
export function TopRatingsScreen({ onGameSelect }: TopRatingsScreenProps) {
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All'>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'All'>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'popularity'>('rating');
  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [sortedGames, setSortedGames] = useState([]);
  useEffect(() => {
    let url = 'http://localhost:8080/api/games';
    if (sortBy === 'rating') url = 'http://localhost:8080/api/games/top-rated';
    if (sortBy === 'popularity') url = 'http://localhost:8080/api/games/popular';
    const params = new URLSearchParams();
    if (selectedGenre !== 'All') params.append('genre', selectedGenre);
    if (selectedPlatform !== 'All') params.append('platform', selectedPlatform);
    setIsLoading(true);
    fetch(`${url}?${params}`).then(res => res.json()).then(data => {
      setSortedGames(data);
      setIsLoading(false);
    });
  }, [selectedGenre, selectedPlatform, sortBy]);
  const getRankColor = (index: number) => {
    if (index === 0) return 'text-yellow-500'; // Gold
    if (index === 1) return 'text-gray-300'; // Silver
    if (index === 2) return 'text-amber-600'; // Bronze
    return 'text-muted-foreground';
  };
  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (index === 1) return <Award className="h-4 w-4 text-gray-300" />;
    if (index === 2) return <Medal className="h-4 w-4 text-amber-600" />;
    return null;
  };
  const getRankBadgeColor = (index: number) => {
    if (index === 0) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (index === 1) return 'bg-gray-300/20 text-gray-300 border-gray-300/30';
    if (index === 2) return 'bg-amber-600/20 text-amber-400 border-amber-600/30';
    return 'bg-muted/50 text-muted-foreground border-muted';
  };
  const handleSortClick = (sortType: 'rating' | 'popularity') => {
    if (sortType === sortBy) {
      const clickedButton = document.querySelector(`[data-sort-type="${sortType}"]`);
      if (clickedButton) {
        clickedButton.classList.add('animate-bounce');
        setTimeout(() => clickedButton.classList.remove('animate-bounce'), 250);
      }
      return;
    }
    const clickedButton = document.querySelector(`[data-sort-type="${sortType}"]`);
    if (clickedButton) {
      clickedButton.classList.add('animate-bounce');
      setTimeout(() => clickedButton.classList.remove('animate-bounce'), 250);
    }
    setIsLoading(true);
    setAnimationKey(prev => prev + 1);
    setTimeout(() => {
      setSortBy(sortType);
      setIsLoading(false);
    }, 300);
  };
  const renderGameCard = (game: any, index: number) => (
    <Card
      key={`${game.id}-${animationKey}`}
      className="cursor-pointer hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 animate-slide-up border-border/50 bg-card/50 backdrop-blur-sm card-interactive"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => onGameSelect(game.id)}
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-3 p-3">
          {/* Rank */}
          <div className="flex flex-col items-center min-w-[3rem]">
            <div className={`flex items-center gap-1 ${getRankColor(index)}`}>
              {getRankIcon(index)}
              <span className="font-bold">#{index + 1}</span>
            </div>
            {index < 3 && (
              <Badge variant="outline" className={`${getRankBadgeColor(index)} text-xs mt-1`}>
                {index === 0 ? 'GOLD' : index === 1 ? 'SILVER' : 'BRONZE'}
              </Badge>
            )}
          </div>
          {/* Game Image */}
          <ImageWithFallback
            src={game.image}
            alt={game.title}
            className="w-14 h-14 object-cover rounded-lg border border-border/30"
          />
          {/* Game Info */}
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="font-medium truncate">{game.title}</h3>
            <div className="flex items-center gap-2">
              <MetacriticRating
                score={game.overallRating}
                size="sm"
                showScore={false}
              />
              <span className="text-xs text-muted-foreground">
                ({game.totalReviews} reviews)
              </span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <Badge variant="secondary" className="text-xs h-5 px-2">
                {game.genre}
              </Badge>
              {game.platforms.slice(0, 1).map((platform: string) => (
                <Badge key={platform} variant="outline" className="text-xs h-5 px-2">
                  {platform.length > 3 ? platform.substring(0, 3) : platform}
                </Badge>
              ))}
              {game.platforms.length > 1 && (
                <Badge variant="outline" className="text-xs h-5 px-2">
                  +{game.platforms.length - 1}
                </Badge>
              )}
            </div>
          </div>
          {/* Trending indicator for top games */}
          {sortBy === 'popularity' && index < 5 && (
            <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
          )}
        </div>
      </CardContent>
    </Card>
  );
  return (
    <div className="px-4 py-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h1 className="font-medium text-primary">Game Rankings</h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Community-driven rankings • Updated daily
        </p>
      </div>
      {/* Filters */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Select value={selectedGenre} onValueChange={(value) => setSelectedGenre(value as Genre | 'All')}>
            <SelectTrigger className="bg-card/50 border-border/50">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Genres</SelectItem>
              {genres.map(genre => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPlatform} onValueChange={(value) => setSelectedPlatform(value as Platform | 'All')}>
            <SelectTrigger className="bg-card/50 border-border/50">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Platforms</SelectItem>
              {platforms.map(platform => (
                <SelectItem key={platform} value={platform}>{platform}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Sort Options */}
        <div className="flex rounded-lg bg-muted/50 p-1 backdrop-blur-sm">
          <button
            data-sort-type="rating"
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all duration-200 btn-ios-style ${
              sortBy === 'rating'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
            onClick={() => handleSortClick('rating')}
          >
            <Star className="h-3 w-3 inline mr-1" />
            Rating
          </button>
          <button
            data-sort-type="popularity"
            className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all duration-200 btn-ios-style ${
              sortBy === 'popularity'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
            onClick={() => handleSortClick('popularity')}
          >
            <TrendingUp className="h-3 w-3 inline mr-1" />
            Popular
          </button>
        </div>
      </div>
      {/* Top Games List */}
      <div className="space-y-2">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={`skeleton-${index}`}
                className="border-border/50 bg-card/50 backdrop-blur-sm animate-pulse-gentle"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 p-3">
                    {/* Rank skeleton */}
                    <div className="flex flex-col items-center min-w-[3rem] space-y-1">
                      <div className="w-8 h-4 bg-muted rounded"></div>
                      <div className="w-12 h-3 bg-muted rounded"></div>
                    </div>

                    {/* Image skeleton */}
                    <div className="w-14 h-14 bg-muted rounded-lg"></div>

                    {/* Content skeleton */}
                    <div className="flex-1 space-y-2">
                      <div className="w-3/4 h-4 bg-muted rounded"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-6 bg-muted rounded"></div>
                        <div className="w-16 h-3 bg-muted rounded"></div>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-12 h-5 bg-muted rounded"></div>
                        <div className="w-8 h-5 bg-muted rounded"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {sortedGames.map((game, index) => renderGameCard(game, index))}

            {sortedGames.length === 0 && (
              <div className="text-center py-8 text-muted-foreground animate-fade-in">
                <Filter className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                <p className="text-sm">No games found</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    setSelectedGenre('All');
                    setSelectedPlatform('All');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      {/* Stats Footer */}
      <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border/30">
        <p>{sortedGames.length} games • Rankings by {sortBy === 'rating' ? 'rating' : 'popularity'}</p>
      </div>
    </div>
  );
}