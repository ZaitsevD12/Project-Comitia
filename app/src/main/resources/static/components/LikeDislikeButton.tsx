import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Heart } from 'lucide-react';
import { Button } from './ui/button';
interface LikeDislikeButtonProps {
  initialLikes?: number;
  initialDislikes?: number;
  onLike?: (liked: boolean) => void;
  onDislike?: (disliked: boolean) => void;
  size?: 'sm' | 'md';
  variant?: 'standard' | 'heart';
}
export function LikeDislikeButton({
  initialLikes = 0,
  initialDislikes = 0,
  onLike,
  onDislike,
  size = 'sm',
  variant = 'standard'
}: LikeDislikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [dislikeCount, setDislikeCount] = useState(initialDislikes);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [dislikeAnimation, setDislikeAnimation] = useState(false);
  const handleLike = () => {
    const newLiked = !liked;
    // If disliked, remove dislike first
    if (disliked) {
      setDisliked(false);
      setDislikeCount(prev => Math.max(0, prev - 1));
    }
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1));
    // Trigger animation
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 300);
    onLike?.(newLiked);
  };
  const handleDislike = () => {
    const newDisliked = !disliked;
    // If liked, remove like first
    if (liked) {
      setLiked(false);
      setLikeCount(prev => Math.max(0, prev - 1));
    }
    setDisliked(newDisliked);
    setDislikeCount(prev => newDisliked ? prev + 1 : Math.max(0, prev - 1));
    // Trigger animation
    setDislikeAnimation(true);
    setTimeout(() => setDislikeAnimation(false), 300);
    onDislike?.(newDisliked);
  };
  const buttonSize = size === 'sm' ? 'h-7 px-2' : 'h-8 px-3';
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  if (variant === 'heart') {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`
            ${buttonSize}
            ${liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'}
            transition-all duration-200
            ${likeAnimation ? 'animate-bounce-in scale-110' : ''}
          `}
        >
          <Heart
            className={`
              ${iconSize}
              ${liked ? 'fill-current' : ''}
              transition-all duration-200
            `}
          />
          {likeCount > 0 && (
            <span className={`${textSize} ml-1`}>{likeCount}</span>
          )}
        </Button>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className={`
          ${buttonSize}
          ${liked ? 'text-green-500 hover:text-green-600' : 'text-muted-foreground hover:text-green-500'}
          transition-all duration-200
          ${likeAnimation ? 'animate-bounce-in scale-110' : ''}
        `}
      >
        <ThumbsUp
          className={`
            ${iconSize}
            ${liked ? 'fill-current' : ''}
            transition-all duration-200
          `}
        />
        {likeCount > 0 && (
          <span className={`${textSize} ml-1`}>{likeCount}</span>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDislike}
        className={`
          ${buttonSize}
          ${disliked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'}
          transition-all duration-200
          ${dislikeAnimation ? 'animate-bounce-in scale-110' : ''}
        `}
      >
        <ThumbsDown
          className={`
            ${iconSize}
            ${disliked ? 'fill-current' : ''}
            transition-all duration-200
          `}
        />
        {dislikeCount > 0 && (
          <span className={`${textSize} ml-1`}>{dislikeCount}</span>
        )}
      </Button>
    </div>
  );
}