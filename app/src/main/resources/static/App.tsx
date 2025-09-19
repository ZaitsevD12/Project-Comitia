import React, { useState, useEffect } from 'react';
import { Home, TrendingUp, User, ArrowLeft, Gamepad2, Heart } from 'lucide-react';
import { Button } from './components/ui/button';
import { HomeScreen } from './components/HomeScreen';
import { GamePage } from './components/GamePage';
import { AddReviewForm } from './components/AddReviewForm';
import { UserProfile } from './components/UserProfile';
import { TopRatingsScreen } from './components/TopRatingsScreen';

import { Screen } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousScreen, setPreviousScreen] = useState<Screen | null>(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      const initData = tg.initData;
      if (initData) {
        fetch('/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData }),
        }).then(res => res.json()).then(data => {
          localStorage.setItem('userId', data.userId.toString());
        }).catch(console.error);
      }
    }
  }, []);

  const navigateWithAnimation = (newScreen: Screen) => {
    if (newScreen === currentScreen) return;

    setIsTransitioning(true);
    setPreviousScreen(currentScreen);

    setTimeout(() => {
      setCurrentScreen(newScreen);
      setIsTransitioning(false);
      setPreviousScreen(null);
    }, 350);
  };

  const navigateToGame = (gameId: string) => {
    setSelectedGameId(gameId);
    navigateWithAnimation('game');
  };

  const navigateToAddReview = (gameId?: string) => {
    if (gameId) setSelectedGameId(gameId);
    setSelectedReviewId(null);
    navigateWithAnimation('add-review');
  };

  const navigateToEditReview = (reviewId: string, gameId: string) => {
    setSelectedGameId(gameId);
    setSelectedReviewId(reviewId);
    navigateWithAnimation('add-review');
  };

  const navigateBack = () => {
    if (currentScreen === 'game' || currentScreen === 'add-review') {
      navigateWithAnimation('home');
    }
  };

  const handleHeaderLogoClick = () => {
    const logo = document.querySelector('.logo-container');
    if (logo) {
      logo.classList.add('animate-bounce');
      setTimeout(() => logo.classList.remove('animate-bounce'), 300);
    }
  };

  const renderHeader = () => {
    const showBackButton = currentScreen === 'game' || currentScreen === 'add-review';

    return (
      <header className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-md">
        <div className="w-full max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <div className="flex items-center h-14 px-4">
            <div className="flex items-center gap-3">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={navigateBack}
                  className="h-9 w-9 btn-ios-style hover:bg-accent"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex items-center gap-3 logo-container">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg btn-telegram-style">
                  <Gamepad2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1
                    className="text-lg font-bold cursor-pointer hover:text-primary transition-all duration-200 hover:scale-105 active:scale-95"
                    onClick={handleHeaderLogoClick}
                  >
                    MyPeak
                  </h1>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-9 w-9 hover:bg-accent/50 transition-all duration-300"
              onClick={() => window.open('https://hipolink.net/mypeak/tips', '_blank')}
            >
              <Heart className="h-5 w-5 text-red-500 animate-pulse" />
            </Button>
          </div>
        </div>
      </header>
    );
  };

  const renderBottomNav = () => {
    const mainScreens: Screen[] = ['home', 'top-ratings', 'profile'];

    if (!mainScreens.includes(currentScreen)) {
      return null;
    }

    const navItems = [
      {
        screen: 'home' as Screen,
        icon: Home,
        label: 'Главная',
      },
      {
        screen: 'top-ratings' as Screen,
        icon: TrendingUp,
        label: 'Рейтинги',
      },
      {
        screen: 'profile' as Screen,
        icon: User,
        label: 'Профиль',
      }
    ];

    const handleNavClick = (screen: Screen) => {
      if (screen === currentScreen) return;

      const clickedTab = document.querySelector(`[data-nav-screen="${screen}"]`);
      if (clickedTab) {
        clickedTab.classList.add('animate-bounce');
        setTimeout(() => clickedTab.classList.remove('animate-bounce'), 300);
      }

      navigateWithAnimation(screen);
    };

    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border backdrop-blur-md transform translate-y-0 transition-transform duration-300">
        <div className="w-full max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <div className="flex items-center justify-around h-16 px-2">
            {navItems.map(({ screen, icon: Icon, label }) => {
              const isActive = currentScreen === screen;

              return (
                <button
                  key={screen}
                  data-nav-screen={screen}
                  onClick={() => handleNavClick(screen)}
                  className={`
                    flex flex-col items-center justify-center gap-1 h-12 px-4 rounded-lg
                    transition-all duration-300 cubic-bezier(0.23, 1, 0.32, 1) min-w-0 flex-1 mx-1 nav-tab-style
                    ${isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 transform scale-105'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-105'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 transition-all duration-300 cubic-bezier(0.23, 1, 0.32, 1) ${
                    isActive ? 'scale-110 text-primary-foreground' : 'scale-100'
                  }`} />
                  <span className={`text-xs font-medium truncate transition-all duration-300 ${
                    isActive ? 'transform scale-105' : 'scale-100'
                  }`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    );
  };

  const renderScreen = () => {
    const screenClass = `screen-transition ${
      isTransitioning
        ? 'opacity-0 transform translate-x-4 scale-[0.98]'
        : 'opacity-100 transform translate-x-0 scale-100 animate-screen-fade-in'
    }`;

    const contentWrapperClass = "w-full max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl";

    switch (currentScreen) {
      case 'home':
        return (
          <div className={screenClass}>
            <div className={contentWrapperClass}>
              <HomeScreen onGameSelect={navigateToGame} />
            </div>
          </div>
        );
      case 'game':
        return (
          <div className={screenClass}>
            <div className={contentWrapperClass}>
              <GamePage
                gameId={selectedGameId}
                onAddReview={navigateToAddReview}
                onEditReview={navigateToEditReview}
              />
            </div>
          </div>
        );
      case 'add-review':
        return (
          <div className={screenClass}>
            <div className={contentWrapperClass}>
              <AddReviewForm
                gameId={selectedGameId}
                reviewId={selectedReviewId ? parseInt(selectedReviewId) : undefined}
                onSubmit={() => navigateWithAnimation('home')}
                onCancel={() => navigateWithAnimation('home')}
              />
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className={screenClass}>
            <div className={contentWrapperClass}>
              <UserProfile onGameSelect={navigateToGame} />
            </div>
          </div>
        );
      case 'top-ratings':
        return (
          <div className={screenClass}>
            <div className={contentWrapperClass}>
              <TopRatingsScreen onGameSelect={navigateToGame} />
            </div>
          </div>
        );
      default:
        return (
          <div className={screenClass}>
            <div className={contentWrapperClass}>
              <HomeScreen onGameSelect={navigateToGame} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {renderHeader()}

      <main className="pb-16 relative overflow-hidden">
        <div className="relative">
          {renderScreen()}
        </div>
      </main>

      {renderBottomNav()}
    </div>
  );
}