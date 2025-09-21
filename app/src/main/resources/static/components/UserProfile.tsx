import React, { useState, useEffect } from 'react';
import { Edit, Download, Star, ThumbsUp, CheckCircle, MoreVertical, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MetacriticRating } from './MetacriticRating';
import { SteamIcon } from './SteamIcon';
import { AddReviewForm } from './AddReviewForm';
interface UserProfileProps {
  onGameSelect: (gameId: string) => void;
}
export function UserProfile({ onGameSelect }: UserProfileProps) {
  const [selectedTab, setSelectedTab] = useState<'reviews' | 'stats'>('reviews');
  const [isSteamConnected, setIsSteamConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  useEffect(() => {
    fetchUserAndReviews();
  }, []);
  const fetchUserAndReviews = () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId) return;
    fetch(`/api/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(data => {
      setUser(data);
      setIsSteamConnected(!!data.steamId);
    });
    fetch(`/api/reviews/user/${userId}`).then(res => res.json()).then(setReviews);
  };
  if (!user) return <div className="p-4 text-center">Loading...</div>;
  if (editingReviewId) {
    return <AddReviewForm
      gameId={reviews.find(r => r.id === editingReviewId).gameId}
      reviewId={editingReviewId}
      onSubmit={() => {
        setEditingReviewId(null);
        fetchUserAndReviews();
      }}
      onCancel={() => setEditingReviewId(null)}
    />;
  }
  const reviewedGames = reviews.map(review => ({ ...review, game: { id: review.gameId, title: review.gameTitle, image: review.gameImage } }));
  const stats = {
    totalReviews: reviews.length,
    averageScore: reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length : 0,
    totalHours: reviews.reduce((sum, review) => sum + review.hoursPlayed, 0),
    completedGames: reviews.filter(review => review.completed).length,
    verifiedReviews: reviews.filter(review => review.verified).length,
  };
  const exportReviews = () => {
    const csvContent = [
      'Game,Score,Platform,Hours Played,Completed,Recommended,Date',
      ...reviewedGames.map(({ game, score, platform, hoursPlayed, completed, recommended, createdAt }) =>
        `"${game?.title}",${score},${platform},${hoursPlayed},${completed},${recommended},${createdAt}`
      )
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-game-reviews.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const handleSteamAuth = () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (isSteamConnected) {
      fetch(`/api/steam/disconnect?userId=${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(() => {
        setIsSteamConnected(false);
      });
    } else {
      fetch(`/api/steam/auth-url?userId=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.text()).then(url => {
        window.location.href = url;
      });
    }
  };
  const handleEditReview = (id) => {
    setEditingReviewId(id);
  };
  const handleDeleteReview = (id) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    fetch(`/api/reviews/${id}?userId=${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(fetchUserAndReviews);
  };
  const renderReviewCard = (reviewWithGame: any) => {
    const { game, score, reviewText, hoursPlayed, platform, completed, recommended, verified, createdAt, id } = reviewWithGame;
    return (
      <Card key={id} className="card-interactive hover:shadow-lg">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <ImageWithFallback
              src={game.image}
              alt={game.title}
              className="w-16 h-16 object-cover rounded-lg cursor-pointer btn-ios-style hover:shadow-md"
              onClick={() => onGameSelect(game.id)}
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3
                    className="font-medium text-sm cursor-pointer hover:text-primary"
                    onClick={() => onGameSelect(game.id)}
                  >
                    {game.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{platform}</span>
                    <span>•</span>
                    <span>{hoursPlayed}h played</span>
                    {completed && (
                      <>
                        <span>•</span>
                        <CheckCircle className="h-3 w-3 text-green-600 ml-3" />
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MetacriticRating
                    score={score}
                    maxScore={100}
                    size="sm"
                    showScore={false}
                  />
                  {verified && <CheckCircle className="h-3 w-3 text-primary" />}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 btn-ios-style">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="btn-ios-style" onClick={() => handleEditReview(id)}>
                        <Edit className="h-3 w-3 mr-2" />
                        Edit Review
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive btn-ios-style" onClick={() => handleDeleteReview(id)}>
                        Delete Review
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{reviewText}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{new Date(createdAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-1">
                  {recommended ? (
                    <ThumbsUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <ThumbsUp className="h-3 w-3 text-red-600 rotate-180" />
                  )}
                  <span>{recommended ? 'Recommended' : 'Not recommended'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  const renderStats = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Card className="border">
          <div className="p-3 sm:p-4 h-20 sm:h-24 flex flex-col items-center justify-center text-center space-y-1">
            <div className="text-xl sm:text-2xl font-bold text-primary leading-none">{stats.totalReviews}</div>
            <div className="text-xs sm:text-sm text-muted-foreground leading-tight">Total Reviews</div>
          </div>
        </Card>
        <Card className="border">
          <div className="p-3 sm:p-4 h-20 sm:h-24 flex flex-col items-center justify-center text-center space-y-1">
            <div className="flex justify-center items-center mb-1">
              <MetacriticRating
                score={stats.averageScore}
                maxScore={100}
                size="sm"
                showScore={false}
              />
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground leading-tight">Average Score</div>
            <div className="text-xs text-muted-foreground leading-tight">
              {stats.averageScore > 0 ? `${Math.round(stats.averageScore)}/100` : 'No reviews yet'}
            </div>
          </div>
        </Card>
        <Card className="border">
          <div className="p-3 sm:p-4 h-20 sm:h-24 flex flex-col items-center justify-center text-center space-y-1">
            <div className="text-xl sm:text-2xl font-bold text-primary leading-none">{stats.totalHours}</div>
            <div className="text-xs sm:text-sm text-muted-foreground leading-tight">Hours Played</div>
          </div>
        </Card>
        <Card className="border">
          <div className="p-3 sm:p-4 h-20 sm:h-24 flex flex-col items-center justify-center text-center space-y-1">
            <div className="text-xl sm:text-2xl font-bold text-green-600 leading-none">{stats.completedGames}</div>
            <div className="text-xs sm:text-sm text-muted-foreground leading-tight">Completed</div>
          </div>
        </Card>
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Verification Rate</span>
            <span className="text-sm text-muted-foreground">
              {stats.verifiedReviews}/{stats.totalReviews}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all"
              style={{ width: `${stats.totalReviews > 0 ? (stats.verifiedReviews / stats.totalReviews) * 100 : 0}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-medium">{user.name}</h2>
              <p className="text-sm text-muted-foreground">
                {user.totalReviews} reviews • {Math.round(user.averageRating)} avg rating
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 fill-current text-yellow-400" />
                <span className="text-xs text-muted-foreground">Gaming enthusiast since {new Date(user.createdAt).getFullYear()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex rounded-lg bg-muted p-1">
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ease-out btn-ios-style ${
            selectedTab === 'reviews'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          }`}
          onClick={() => setSelectedTab('reviews')}
        >
          My Reviews
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ease-out btn-ios-style ${
            selectedTab === 'stats'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          }`}
          onClick={() => setSelectedTab('stats')}
        >
          Statistics
        </button>
      </div>
      {selectedTab === 'reviews' && (
        <Button
          variant="outline"
          onClick={exportReviews}
          className="w-full btn-telegram-style"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Reviews (CSV)
        </Button>
      )}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">Steam Verification</h3>
                <p className="text-xs text-muted-foreground">
                  Connect your Steam account to verify game ownership and enhance review credibility
                </p>
              </div>
              {isSteamConnected && (
                <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/30">
                  Verified
                </Badge>
              )}
            </div>
            <Button
              variant={isSteamConnected ? "secondary" : "outline"}
              onClick={handleSteamAuth}
              className="w-full btn-telegram-style"
            >
              {isSteamConnected ? (
                <>
                  <SteamIcon className="h-4 w-4 mr-2" />
                  Steam Connected
                </>
              ) : (
                <>
                  <SteamIcon className="h-4 w-4 mr-2" />
                  Connect Steam Account
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="transition-all duration-300 ease-out">
        {selectedTab === 'reviews' ? (
          <div className="space-y-3">
            {reviewedGames.map(renderReviewCard)}
            {reviewedGames.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>You haven't written any reviews yet</p>
                <p className="text-sm">Start exploring games and share your thoughts!</p>
              </div>
            )}
          </div>
        ) : (
          renderStats()
        )}
      </div>
    </div>
  );
}