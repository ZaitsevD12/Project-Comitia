import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Clock, Monitor, CheckCircle, Plus, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MetacriticRating } from './MetacriticRating';
import { LikeDislikeButton } from './LikeDislikeButton';
import { SortOption } from '../types';
interface GamePageProps {
  gameId: string | null;
  onAddReview: (gameId: string) => void;
}
export function GamePage({ gameId, onAddReview }: GamePageProps) {
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [game, setGame] = useState(null);
  const [gameReviews, setGameReviews] = useState([]);

  useEffect(() => {
    if (gameId) {
      fetch(`http://localhost:8080/api/games/${gameId}`).then(res => res.json()).then(setGame);
      fetch(`http://localhost:8080/api/reviews/game/${gameId}`).then(res => res.json()).then(setGameReviews);
    }
  }, [gameId]);

  if (!gameId || !game) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Game not found</p>
      </div>
    );
  }
  const sortedReviews = [...gameReviews].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.score - a.score;
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });
  const ratingDistribution = [
    { rating: 10, count: Math.floor(game.totalReviews * 0.4) },
    { rating: 9, count: Math.floor(game.totalReviews * 0.25) },
    { rating: 8, count: Math.floor(game.totalReviews * 0.2) },
    { rating: 7, count: Math.floor(game.totalReviews * 0.1) },
    { rating: 6, count: Math.floor(game.totalReviews * 0.03) },
    { rating: 5, count: Math.floor(game.totalReviews * 0.02) },
  ];
  const renderReview = (review: any) => (
    <Card key={review.id} className="animate-slide-up">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={review.userAvatar} alt={review.userName} />
              <AvatarFallback>{review.userName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm truncate">{review.userName}</span>
                {review.verified && (
                  <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
                <span className="flex-shrink-0">{review.platform}</span>
                <span className="flex-shrink-0">•</span>
                <span className="flex-shrink-0">{review.hoursPlayed}h played</span>
                {review.completed && (
                  <>
                    <span className="flex-shrink-0">•</span>
                    <span className="text-green-600 flex-shrink-0">Completed</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <MetacriticRating
              score={review.score}
              maxScore={100}
              size="sm"
              showScore={false}
            />
            {review.recommended ? (
              <ThumbsUp className="h-4 w-4 text-green-600" />
            ) : (
              <ThumbsDown className="h-4 w-4 text-red-600" />
            )}
          </div>
        </div>

        <p className="text-sm leading-relaxed">{review.reviewText}</p>

        {review.screenshot && (
          <div className="mt-3">
            <ImageWithFallback
              src={review.screenshot}
              alt="Review screenshot"
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-muted-foreground">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
          <div className="ml-4">
            <LikeDislikeButton
              initialLikes={0}
              initialDislikes={0}
              onLike={(liked) => console.log('Review liked:', liked)}
              onDislike={(disliked) => console.log('Review disliked:', disliked)}
              size="sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="relative">
        <ImageWithFallback
          src={game.image}
          alt={game.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="text-xl mb-2">{game.title}</h1>
          <div className="flex items-center gap-4">
            <MetacriticRating
              score={game.overallRating}
              maxScore={100}
              size="md"
              showScore={true}
              className="bg-background/20 backdrop-blur-sm"
            />
            <span className="text-sm opacity-90">{game.totalReviews} reviews</span>
          </div>
        </div>
      </div>
      {/* Game Info */}
      <div className="px-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{game.genre}</Badge>
          {game.platforms.map(platform => (
            <Badge key={platform} variant="outline">{platform}</Badge>
          ))}
        </div>
        {/* Rating Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-medium">Rating Breakdown</h3>
          </CardHeader>
          <CardContent className="space-y-2">
            {ratingDistribution.map(({ rating, count }) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm w-6">{rating}</span>
                <Progress value={(count / game.totalReviews) * 100} className="flex-1 h-2" />
                <span className="text-xs text-muted-foreground w-8">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        {/* Add Review Button */}
        <Button
          onClick={() => onAddReview(game.id)}
          className="w-full"
          size="lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Your Review
        </Button>
        {/* Reviews Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Reviews ({gameReviews.length})</h3>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Latest</SelectItem>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="helpful">Helpful</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            {sortedReviews.map(renderReview)}
          </div>
          {gameReviews.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No reviews yet. Be the first to review this game!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}