# GameRatings Telegram Mini App

A modern, responsive game review application built with React, TypeScript, Tailwind CSS, and designed specifically for Telegram Mini Apps. Features a clean Telegram-inspired UI with custom rating system, dark mode support, and comprehensive game review functionality.

## Features

- 🎮 Game discovery with search and filtering
- ⭐ Comprehensive review system with 1-10 scoring
- 📸 Screenshot verification for reviews
- 👤 User profiles with statistics and review management
- 🏆 Top ratings and leaderboards
- 🌙 Dark/Light theme support
- 📱 Mobile-first responsive design
- 🎨 Custom color system for ratings and achievements
- ✨ Smooth animations and transitions
- 🔧 Full TypeScript support

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS v3
- **Build Tool**: Vite
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Development**: ESLint, PostCSS, Autoprefixer

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gameratings-telegram-miniapp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── figma/          # Figma-specific components
│   ├── HomeScreen.tsx  # Main game discovery screen
│   ├── GamePage.tsx    # Individual game details and reviews
│   ├── AddReviewForm.tsx # Review creation form
│   ├── UserProfile.tsx # User profile and review management
│   ├── TopRatingsScreen.tsx # Top games leaderboard
│   └── TailwindTest.tsx # UI testing component
├── data/               # Mock data and utilities
│   └── mockData.ts     # Sample games and reviews
├── styles/             # Global styles
│   └── globals.css     # Tailwind CSS and custom styles
├── types/              # TypeScript type definitions
│   └── index.ts        # App-wide interfaces
├── App.tsx             # Main application component
└── main.tsx           # React entry point
```

## Custom Color System

The app uses a comprehensive custom color system:

### Rating Colors
- **Excellent**: `#22c55e` (9.0-10.0 scores)
- **Good**: `#84cc16` (7.0-8.9 scores)  
- **Mixed**: `#eab308` (5.0-6.9 scores)
- **Poor**: `#f97316` (3.0-4.9 scores)
- **Bad**: `#ef4444` (1.0-2.9 scores)

### Achievement Colors
- **Gold**: `#ffd700`
- **Silver**: `#c0c0c0`
- **Bronze**: `#cd7f32`

### Olympus Colors
- **Primary**: `#6366f1`
- **Secondary**: `#8b5cf6`
- **Accent**: `#06b6d4`

### Telegram Colors
- **Blue**: `#0088cc` (Primary brand color)
- **Blue Dark**: `#006ba6`
- **Light Blue**: `#40a7e3`

## Usage Examples

### Using Custom Rating Colors

```tsx
// In your components
<span className="text-rating-excellent">9.5/10</span>
<div className="bg-rating-good/20 p-4">Good rating background</div>
```

### Animations

```tsx
// Fade in animation
<div className="animate-fade-in">Content</div>

// Olympus glow effect
<div className="animate-olympus-glow">Glowing element</div>

// Custom animations available:
// animate-fade-in, animate-scale-in, animate-slide-up, 
// animate-bounce-in, animate-shake, animate-olympus-glow
```

## Development Guidelines

### Theme System

The app supports both light and dark themes. Use CSS custom properties and Tailwind's dark mode:

```tsx
// Toggle dark mode
document.documentElement.classList.toggle('dark')
```

### Component Guidelines

- Use TypeScript for all components
- Implement proper props interfaces
- Use forwardRef when components need ref access
- Follow the existing color system for consistency
- Ensure mobile-first responsive design

### Testing UI Components

Navigate to the Tailwind Test page by clicking the "GameRatings" header in the app. This page includes:

- Typography tests with all text sizes
- Color system verification
- Animation previews
- UI component showcase
- Responsive grid testing

## Telegram Mini App Integration

This app is designed for Telegram Mini Apps with:

- Mobile-optimized viewport settings
- Telegram-style UI patterns
- Bottom navigation for mobile
- Theme color integration
- PWA-ready configuration

## Configuration Files

### Key Configuration Files

- `tailwind.config.js` - Tailwind CSS configuration with custom colors
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration
- `postcss.config.js` - PostCSS configuration
- `package.json` - Dependencies and scripts

### Environment Setup

The project is configured to work out of the box with:
- Hot module replacement
- TypeScript support
- Path aliases (`@/` for src directory)
- Automatic CSS processing
- ESLint integration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.