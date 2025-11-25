# Crossword Puzzle Web App

A beautiful, NYT-inspired crossword puzzle game built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode**: Beautiful dark theme with smooth transitions and persistent preference
- **Dual Input Methods**: Physical keyboard and virtual on-screen keyboard
- **Smart Cursor Movement**: Automatic navigation and direction toggling
- **Real-time Validation**: Automatic puzzle completion detection
- **Win Animations**: Confetti celebration and success modal
- **Progress Tracking**: LocalStorage-based puzzle completion tracking
- **NYT-Inspired Aesthetic**: Clean, modern design with newspaper-style typography

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Confetti**: canvas-confetti

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Play

### Physical Keyboard Controls
- **Letter Keys**: Type letters directly into cells
- **Arrow Keys**: Navigate between cells
- **Backspace**: Delete letters and move backward
- **Tab**: Jump to the next word
- **Space**: Toggle between Across and Down

### Mouse/Touch Controls
- **Click once**: Select a cell
- **Click twice**: Toggle direction (Across ↔ Down)
- **Virtual Keyboard**: Tap letters on the on-screen keyboard

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage with puzzle selection
│   ├── globals.css         # Global styles
│   └── puzzle/[id]/
│       └── page.tsx        # Dynamic puzzle page
├── components/
│   ├── Game.tsx            # Main game component
│   ├── CrosswordGrid.tsx   # Grid rendering and cell logic
│   ├── ClueDisplay.tsx     # Current clue display
│   ├── VirtualKeyboard.tsx # On-screen keyboard
│   ├── WinModal.tsx        # Success modal with confetti
│   └── ThemeToggle.tsx     # Dark mode toggle button
├── store/
│   ├── gameStore.ts        # Zustand state management
│   └── themeStore.ts       # Theme state management
├── types/
│   └── index.ts            # TypeScript types
└── crossword vocab.json    # Puzzle data
```

## Design System

### Light Mode Colors
- **Background**: `#f9f9f9` (Warm Gray)
- **Highlight Blue**: `#dbeafe` (Active word)
- **Highlight Blue Dark**: `#93c5fd` (Active cell)
- **Success Green**: `#10b981` (Completion state)

### Dark Mode Colors
- **Background**: `#1a1a1a` (Dark Background)
- **Card**: `#262626` (Dark Card)
- **Border**: `#404040` (Dark Border)
- **Highlight**: `#1e3a5f` (Dark Highlight)
- **Active Highlight**: `#2563eb` (Dark Highlight Active)

### Typography
- **UI Font**: Inter
- **Grid Letters**: Libre Baskerville (serif)

### Theme Toggle
- Click the sun/moon icon in the top-right corner to switch themes
- Theme preference is automatically saved to localStorage
- Defaults to system preference on first load

## Adding New Puzzles

Edit `crossword vocab.json` and add a new puzzle object:

```json
{
  "id": "level_3_hard",
  "title": "Your Puzzle Title",
  "difficulty": "Hard",
  "gridSize": { "rows": 5, "cols": 5 },
  "words": [
    {
      "id": "1-across",
      "clue": "Your clue here",
      "answer": "ANSWER",
      "orientation": "across",
      "startRow": 0,
      "startCol": 0
    }
  ]
}
```

## Build for Production

```bash
npm run build
npm start
```

## License

MIT
