import { Game, Review, User } from '../types';

export const mockGames: Game[] = [
  {
    id: '1',
    title: 'The Legend of Zelda: Tears of the Kingdom',
    genre: 'Adventure',
    platforms: ['Nintendo Switch'],
    overallRating: 92,
    totalReviews: 1247,
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=225&fit=crop'
  },
  {
    id: '2',
    title: 'Cyberpunk 2077: Phantom Liberty',
    genre: 'RPG',
    platforms: ['PC', 'PS5', 'Xbox'],
    overallRating: 87,
    totalReviews: 892,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop'
  },
  {
    id: '3',
    title: 'Baldur\'s Gate 3',
    genre: 'RPG',
    platforms: ['PC', 'PS5'],
    overallRating: 95,
    totalReviews: 2156,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop'
  },
  {
    id: '4',
    title: 'Spider-Man 2',
    genre: 'Action',
    platforms: ['PS5'],
    overallRating: 89,
    totalReviews: 743,
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=225&fit=crop'
  },
  {
    id: '5',
    title: 'FIFA 24',
    genre: 'Sports',
    platforms: ['PC', 'PS5', 'Xbox', 'Nintendo Switch'],
    overallRating: 72,
    totalReviews: 1883,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop'
  },
  {
    id: '6',
    title: 'Hogwarts Legacy',
    genre: 'Adventure',
    platforms: ['PC', 'PS5', 'Xbox', 'Nintendo Switch'],
    overallRating: 84,
    totalReviews: 1576,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop'
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    gameId: '1',
    userId: 'user1',
    userName: 'GamerPro2023',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    score: 95,
    reviewText: 'Absolutely incredible game! The world is massive and every corner has something interesting to discover. The building mechanics are revolutionary and change how you approach every puzzle.',
    hoursPlayed: 127,
    platform: 'Nintendo Switch',
    completed: true,
    recommended: true,
    screenshot: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop',
    verified: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    gameId: '1',
    userId: 'user2',
    userName: 'ZeldaFan88',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b9de8c42?w=100&h=100&fit=crop&crop=face',
    score: 87,
    reviewText: 'Great sequel to BOTW. Some frame rate issues but the story and gameplay improvements make up for it. Link\'s new abilities are fantastic.',
    hoursPlayed: 89,
    platform: 'Nintendo Switch',
    completed: false,
    recommended: true,
    screenshot: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=225&fit=crop',
    verified: true,
    createdAt: '2024-01-12'
  },
  {
    id: '3',
    gameId: '2',
    userId: 'user3',
    userName: 'CyberNinja',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    score: 78,
    reviewText: 'Much improved from launch. The expansion is solid and Night City finally feels alive. Still some bugs but playable and enjoyable.',
    hoursPlayed: 156,
    platform: 'PC',
    completed: true,
    recommended: true,
    verified: false,
    createdAt: '2024-01-10'
  },
  {
    id: '4',
    gameId: '3',
    userId: 'user4',
    userName: 'RPGMaster',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    score: 97,
    reviewText: 'Best RPG in years! The depth of character creation and storytelling is unmatched. Every choice matters and the voice acting is phenomenal.',
    hoursPlayed: 203,
    platform: 'PC',
    completed: true,
    recommended: true,
    screenshot: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=400&h=225&fit=crop',
    verified: true,
    createdAt: '2024-01-08'
  },
  // Add some reviews for the current user
  {
    id: '5',
    gameId: '1',
    userId: 'current-user',
    userName: 'Alex_Gamer',
    userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face',
    score: 91,
    reviewText: 'Amazing game! Love the new building mechanics and the story is captivating. Minor performance issues but overall fantastic experience.',
    hoursPlayed: 85,
    platform: 'Nintendo Switch',
    completed: false,
    recommended: true,
    screenshot: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop',
    verified: true,
    createdAt: '2024-01-20'
  },
  {
    id: '6',
    gameId: '3',
    userId: 'current-user',
    userName: 'Alex_Gamer',
    userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face',
    score: 99,
    reviewText: 'Best RPG I have ever played! The attention to detail is incredible and every choice feels meaningful. Definitely my game of the year.',
    hoursPlayed: 164,
    platform: 'PC',
    completed: true,
    recommended: true,
    screenshot: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=400&h=225&fit=crop',
    verified: false,
    createdAt: '2024-01-18'
  },
  {
    id: '7',
    gameId: '5',
    userId: 'current-user',
    userName: 'Alex_Gamer',
    userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face',
    score: 55,
    reviewText: 'FIFA feels the same as last year with minor improvements. Career mode is still lacking and Ultimate Team is too pay-to-win oriented.',
    hoursPlayed: 42,
    platform: 'PC',
    completed: false,
    recommended: false,
    verified: false,
    createdAt: '2024-01-05'
  }
];

export const mockUser: User = {
  id: 'current-user',
  name: 'Alex_Gamer',
  avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face',
  totalReviews: 47,
  averageRating: 81.7
};

export const genres: Genre[] = ['Action', 'RPG', 'Strategy', 'Adventure', 'Sports', 'Racing', 'Simulation'];
export const platforms: Platform[] = ['PC', 'PS5', 'Xbox', 'Nintendo Switch', 'Mobile'];

// Legacy rating functions - replaced by MetacriticRating component
// Keeping for backwards compatibility if needed
export function getRatingColor(score: number): string {
  if (score >= 9) return 'text-rating-excellent';
  if (score >= 7) return 'text-rating-good';
  if (score >= 5) return 'text-rating-mixed';
  if (score >= 3) return 'text-rating-poor';
  return 'text-rating-bad';
}

export function getRatingBgColor(score: number): string {
  if (score >= 9) return 'bg-rating-excellent/20';
  if (score >= 7) return 'bg-rating-good/20';
  if (score >= 5) return 'bg-rating-mixed/20';
  if (score >= 3) return 'bg-rating-poor/20';
  return 'bg-rating-bad/20';
}

// Enhanced mock data with like/dislike counts for reviews
export const reviewEngagement = {
  '1': { likes: 15, dislikes: 2 },
  '2': { likes: 8, dislikes: 1 },
  '3': { likes: 23, dislikes: 4 },
  '4': { likes: 31, dislikes: 1 },
};