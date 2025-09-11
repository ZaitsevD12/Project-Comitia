import React from 'react';

interface MetacriticRatingProps {
  score: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  className?: string;
}

export function MetacriticRating({ 
  score, 
  maxScore = 100, 
  size = 'md', 
  showScore = true,
  className = '' 
}: MetacriticRatingProps) {
  // Convert score to 0-100 scale for Metacritic-style display
  const normalizedScore = maxScore === 100 ? Math.round(score) : Math.round((score / maxScore) * 100);
  
  // Determine color and category based on score with better contrast for muted colors
  const getScoreCategory = (score: number) => {
    if (score >= 75) return { 
      category: 'Universal Acclaim', 
      color: 'bg-rating-excellent', 
      textColor: 'text-white' // White text on muted green
    };
    if (score >= 50) return { 
      category: 'Generally Positive', 
      color: 'bg-rating-good', 
      textColor: 'text-white' // White text on muted lime
    };
    if (score >= 20) return { 
      category: 'Mixed Reviews', 
      color: 'bg-rating-mixed', 
      textColor: 'text-white' // White text on muted orange
    };
    return { 
      category: 'Generally Negative', 
      color: 'bg-rating-bad', 
      textColor: 'text-white' // White text on muted red
    };
  };

  const { category, color, textColor } = getScoreCategory(normalizedScore);

  // Size variants
  const sizeVariants = {
    sm: {
      container: 'w-8 h-8 text-xs',
      text: 'text-xs font-bold'
    },
    md: {
      container: 'w-10 h-10 text-sm',
      text: 'text-sm font-bold'
    },
    lg: {
      container: 'w-12 h-12 text-base',
      text: 'text-base font-bold'
    }
  };

  const sizeClasses = sizeVariants[size];

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`
          ${sizeClasses.container} 
          ${color} 
          ${textColor}
          rounded-lg
          flex items-center justify-center
          border border-white/10
          shadow-sm
          transition-all duration-200
          hover:scale-105
          ${className}
        `}
        title={`${category}: ${normalizedScore}/100`}
      >
        <span className={`${sizeClasses.text} drop-shadow-sm`}>
          {normalizedScore}
        </span>
      </div>
      {showScore && size === 'lg' && (
        <div className="text-xs text-muted-foreground">
          <div className="text-xs opacity-75">{category}</div>
        </div>
      )}
    </div>
  );
}

// Utility function to get rating description
export function getRatingDescription(score: number, maxScore: number = 10): string {
  const normalizedScore = (score / maxScore) * 100;
  if (normalizedScore >= 75) return 'Universal Acclaim';
  if (normalizedScore >= 50) return 'Generally Positive';
  if (normalizedScore >= 20) return 'Mixed Reviews';
  return 'Generally Negative';
}

// Color utility for consistent theming
export function getMetacriticColor(score: number, maxScore: number = 10): string {
  const normalizedScore = (score / maxScore) * 100;
  if (normalizedScore >= 75) return 'text-rating-excellent';
  if (normalizedScore >= 50) return 'text-rating-good';
  if (normalizedScore >= 20) return 'text-rating-mixed';
  return 'text-rating-bad';
}