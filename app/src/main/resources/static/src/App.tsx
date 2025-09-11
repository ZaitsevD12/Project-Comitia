import React, { useState } from 'react';
import { Home, TrendingUp, User, ArrowLeft, Moon, Sun } from 'lucide-react';
import { Button } from './components/ui/button';
import { HomeScreen } from './components/HomeScreen';
import { GamePage } from './components/GamePage';
import { AddReviewForm } from './components/AddReviewForm';
import { UserProfile } from './components/UserProfile';
import { TopRatingsScreen } from './components/TopRatingsScreen';
import { TailwindTest } from './components/TailwindTest';
import { Screen } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [showTailwindTest, setShowTailwindTest] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navigateToGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setCurrentScreen('game');
  };

  const navigateToAddReview = (gameId?: string) => {
    if (gameId) setSelectedGameId(gameId);
    setCurrentScreen('add-review');
  };

  const navigateBack = () => {
    if (currentScreen === 'game' || currentScreen === 'add-review') {
      setCurrentScreen('home');
    }
  };

  if (showTailwindTest) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between h-14 px-4">
            <Button
              variant="ghost"
              onClick={() => setShowTailwindTest(false)}
            >
              ← Back to App
            </Button>
            <h1 className="text-lg font-medium text-primary">Tailwind Test</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <TailwindTest />
      </div>
    );
  }

  const renderHeader = () => {
    const showBackButton = currentScreen === 'game' || currentScreen === 'add-review';
    
    return (
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={navigateBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h1 
              className="text-lg font-medium text-primary cursor-pointer"
              onClick={() => setShowTailwindTest(true)}
            >
              GameRatings
            </h1>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>
    );
  };

  const renderBottomNav = () => {
    const mainScreens: Screen[] = ['home', 'top-ratings', 'profile'];
    
    if (!mainScreens.includes(currentScreen)) {
      return null;
    }

    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="flex items-center justify-around h-16 px-4">
          <Button
            variant={currentScreen === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentScreen('home')}
            className="flex flex-col items-center gap-1 h-12 px-3"
          >
            <Home className="h-4 w-4" />
            <span className="text-xs">Home</span>
          </Button>
          
          <Button
            variant={currentScreen === 'top-ratings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentScreen('top-ratings')}
            className="flex flex-col items-center gap-1 h-12 px-3"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs">Top Ratings</span>
          </Button>
          
          <Button
            variant={currentScreen === 'profile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentScreen('profile')}
            className="flex flex-col items-center gap-1 h-12 px-3"
          >
            <User className="h-4 w-4" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </nav>
    );
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onGameSelect={navigateToGame} />;
      case 'game':
        return (
          <GamePage
            gameId={selectedGameId}
            onAddReview={navigateToAddReview}
          />
        );
      case 'add-review':
        return (
          <AddReviewForm
            gameId={selectedGameId}
            onSubmit={() => setCurrentScreen('home')}
            onCancel={() => setCurrentScreen('home')}
          />
        );
      case 'profile':
        return <UserProfile onGameSelect={navigateToGame} />;
      case 'top-ratings':
        return <TopRatingsScreen onGameSelect={navigateToGame} />;
      default:
        return <HomeScreen onGameSelect={navigateToGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderHeader()}
      
      <main className="pb-16">
        {renderScreen()}
      </main>
      
      {renderBottomNav()}
    </div>
  );
}