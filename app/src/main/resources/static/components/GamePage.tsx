import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Clock, Monitor, CheckCircle, Plus, Filter, MoreVertical, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MetacriticRating } from './MetacriticRating';
import { LikeDislikeButton } from './LikeDislikeButton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { SortOption } from '../types';
interface GamePageProps {
  gameId: string | null;
  onAddReview: (gameId: string) => void;
  onEditReview: (reviewId: string, gameId: string) => void;
}
export function GamePage({ gameId, onAddReview, onEditReview }: GamePageProps) {
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [game, setGame] = useState(null);
  const [gameReviews, setGameReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (gameId) {
      setIsLoading(true);
      fetch(`/api/games/${gameId}`, { cache: 'no-store' }).then(res => res.json()).then(data => {
        setGame(data);
        setIsLoading(false);
      });
      refreshReviews();
    }
  }, [gameId]);
  const refreshReviews = () => {
    const userId = localStorage.getItem('userId');
    fetch(`/api/reviews/game/${gameId}${userId ? `?currentUserId=${userId}` : ''}`, { cache: 'no-store' }).then(res => res.json()).then(setGameReviews);
  };
  const handleDelete = (id: number) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId) return;
    fetch(`/api/reviews/${id}?userId=${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(() => {
      setGameReviews(prev => prev.filter(r => r.id !== id));
      fetch(`/api/games/${gameId}`, { cache: 'no-store' }).then(res => res.json()).then(setGame);
    });
  };
  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }
  if (!gameId || !game) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Game not found</p>
      </div>
    );
  }
  const isReleased = game.releaseDate ? new Date() >= new Date(game.releaseDate) : true;
  const sortedReviews = [...gameReviews].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.score - a.score;
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'helpful':
        return (b.likes - b.dislikes) - (a.likes - a.dislikes);
      default:
        return 0;
    }
  });
  const excellentCount = gameReviews.filter(r => r.score >= 75).length;
  const goodCount = gameReviews.filter(r => r.score >= 50 && r.score < 75).length;
  const mixedCount = gameReviews.filter(r => r.score >= 20 && r.score < 50).length;
  const badCount = gameReviews.filter(r => r.score < 20).length;
  const total = gameReviews.length;
  const excellentPercent = total > 0 ? Math.round((excellentCount / total) * 100) : 0;
  const goodPercent = total > 0 ? Math.round((goodCount / total) * 100) : 0;
  const mixedPercent = total > 0 ? Math.round((mixedCount / total) * 100) : 0;
  const badPercent = total > 0 ? Math.round((badCount / total) * 100) : 0;
  const verifiedCount = gameReviews.filter(r => r.verified).length;
  const verifiedPercent = total > 0 ? Math.round((verifiedCount / total) * 100) : 0;
  const unverifiedPercent = 100 - verifiedPercent;
  const dominantPercent = Math.max(verifiedPercent, unverifiedPercent);
  const dominantSide = verifiedPercent > unverifiedPercent ? 'Verified' : 'Unverified';
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
            {review.userId === parseInt(localStorage.getItem('userId') || '0') && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEditReview(review.id.toString(), gameId || '')}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(review.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              initialLikes={review.likes}
              initialDislikes={review.dislikes}
              liked={review.userLiked}
              disliked={review.userDisliked}
              reviewId={review.id}
              size="sm"
              onVoteSuccess={refreshReviews}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
  return (
    <div className="space-y-6">
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
      <div className="px-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{game.genre}</Badge>
          {game.platforms.map(platform => (
            <Badge key={platform} variant="outline">{platform}</Badge>
          ))}
        </div>
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-medium">Rating Breakdown</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-700 font-medium">{excellentPercent}% Excellent</span>
                <span className="text-muted-foreground">{excellentCount} Ratings</span>
              </div>
              <Progress value={excellentPercent} className="h-2 [&>div]:bg-green-700" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium">{goodPercent}% Good</span>
                <span className="text-muted-foreground">{goodCount} Ratings</span>
              </div>
              <Progress value={goodPercent} className="h-2 [&>div]:bg-green-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-yellow-600 font-medium">{mixedPercent}% Mixed</span>
                <span className="text-muted-foreground">{mixedCount} Ratings</span>
              </div>
              <Progress value={mixedPercent} className="h-2 [&>div]:bg-yellow-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-red-600 font-medium">{badPercent}% Bad</span>
                <span className="text-muted-foreground">{badCount} Ratings</span>
              </div>
              <Progress value={badPercent} className="h-2 [&>div]:bg-red-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-700 font-medium">Verified {verifiedPercent}%</span>
                <span className="text-gray-500 font-medium">Unverified {unverifiedPercent}%</span>
              </div>
              <div className="flex h-2 overflow-hidden rounded-full bg-gray-200">
                <div style={{width: `${verifiedPercent}%`}} className="bg-blue-700"></div>
                <div style={{width: `${unverifiedPercent}%`}} className="bg-gray-500"></div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {dominantSide} {dominantPercent}%
              </div>
            </div>
          </CardContent>
        </Card>
        <Button
          onClick={() => onAddReview(game.id)}
          className="w-full"
          size="lg"
          disabled={!isReleased}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Your Review
        </Button>
        {!isReleased && (
          <p className="text-sm text-muted-foreground text-center mt-2">Reviews available after release on {game.releaseDate}</p>
        )}
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