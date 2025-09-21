import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { Search, Filter, Heart } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MetacriticRating } from './MetacriticRating';
import { Button } from './ui/button';
import { genres, platforms } from '../data/mockData';
import { Genre, Platform } from '../types';

interface HomeScreenProps {
  onGameSelect: (gameId: string) => void;
}

export function HomeScreen({ onGameSelect }: HomeScreenProps) {
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All'>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'All'>('All');
  const [activeTab, setActiveTab] = useState('popular');
  const [loading, setLoading] = useState(false);
  const [fetchedQueries, setFetchedQueries] = useState(new Set());

  const debouncedFetch = debounce(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedGenre !== 'All') params.append('genre', selectedGenre);
    if (selectedPlatform !== 'All') params.append('platform', selectedPlatform);
    fetch(`/api/games?${params}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setGames(data);
        if (data.length === 0 && searchQuery && !fetchedQueries.has(searchQuery)) {
          setFetchedQueries(new Set([...fetchedQueries, searchQuery]));
          fetch(`/api/steam/search?query=${searchQuery}`)
            .then(() => {
              fetch(`/api/games?search=${searchQuery}`, { cache: 'no-store' })
                .then(res => res.json())
                .then(setGames);
            })
            .finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, 300);

  useEffect(() => {
    debouncedFetch();
  }, [searchQuery, selectedGenre, selectedPlatform]);

  const filteredGames = games;
  const topRatedGames = games.filter(game => game.overallRating >= 85);
  const popularGames = [...games].sort((a, b) => b.totalReviews - a.totalReviews);

  const renderGameCard = (game: any) => (
    <Card
      key={game.id}
      className="cursor-pointer hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 animate-fade-in border-border/50 bg-card/50 backdrop-blur-sm card-interactive"
      onClick={() => onGameSelect(game.id)}
    >
      <CardContent className="p-0">
        <div className="relative">
          <ImageWithFallback
            src={game.image}
            alt={game.title}
            className="w-full h-28 sm:h-32 md:h-36 lg:h-40 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2">
            <MetacriticRating
              score={game.overallRating}
              maxScore={100}
              size="sm"
              showScore={false}
              className="backdrop-blur-sm border border-border/30 shadow-lg"
            />
          </div>
        </div>
        <div className="p-3 space-y-2">
          <h3 className="font-medium text-sm leading-tight min-h-[2.5rem] flex items-start">
            <span className="line-clamp-2">{game.title}</span>
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate flex-1 pr-2">{game.genre}</span>
              <span className="flex-shrink-0">{game.totalReviews} reviews</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {game.platforms.slice(0, 2).map((platform: string) => (
                <Badge key={platform} variant="secondary" className="text-xs h-5 px-2">
                  {platform.length > 4 ? platform.substring(0, 4) : platform}
                </Badge>
              ))}
              {game.platforms.length > 2 && (
                <Badge variant="secondary" className="text-xs h-5 px-2">
                  +{game.platforms.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderGameGrid = (games: any[], emptyMessage: string) => (
    <>
      {loading ? <div>Loading...</div> : (
        <div className="responsive-grid-2">
          {games.map(renderGameCard)}
        </div>
      )}
      {games.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>{emptyMessage}</p>
        </div>
      )}
    </>
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search games by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/50 border-border/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
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
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
          <TabsTrigger value="all">All Games</TabsTrigger>
        </TabsList>

        <TabsContent value="popular" className="mt-4 sm:mt-6">
          {renderGameGrid(popularGames, "No popular games found")}
        </TabsContent>

        <TabsContent value="top-rated" className="mt-4 sm:mt-6">
          {renderGameGrid(topRatedGames, "No top-rated games found")}
        </TabsContent>

        <TabsContent value="all" className="mt-4 sm:mt-6">
          {renderGameGrid(filteredGames, "No games found matching your criteria")}
        </TabsContent>
      </Tabs>
      <Button
        variant="secondary"
        className="w-full hover:bg-primary/10 hover:shadow-md transition-all duration-300"
        onClick={() => window.open('https://hipolink.net/mypeak/tips', '_blank')}
      >
        <Heart className="mr-2 h-4 w-4 text-red-500 animate-pulse" /> Support MyPeak
      </Button>
    </div>
  );
}