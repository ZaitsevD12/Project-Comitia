export interface Game {
  id: string;
  title: string;
  genre: string;
  platforms: string[];
  overallRating: number;
  totalReviews: number;
  image: string;
}

export interface Review {
  id: string;
  gameId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  score: number;
  reviewText: string;
  hoursPlayed: number;
  platform: string;
  completed: boolean;
  recommended: boolean;
  screenshot?: string;
  verified: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  totalReviews: number;
  averageRating: number;
}

export type Screen = 'home' | 'game' | 'add-review' | 'profile' | 'top-ratings' | 'add-game';
export type Genre = 'Action' | 'RPG' | 'Strategy' | 'Adventure' | 'Sports' | 'Racing' | 'Simulation';
export type Platform = 'PC' | 'PS5' | 'Xbox' | 'Nintendo Switch' | 'Mobile';
export type SortOption = 'date' | 'score' | 'helpful';