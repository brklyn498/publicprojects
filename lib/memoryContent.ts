import { Difficulty, CardTheme } from "@/types/memory";

// Emoji content by category
const emojiSets = {
    animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞"],
    fruits: ["🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🥑"],
    objects: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🎱", "🏓", "🏸", "🏒", "🎯", "🎮", "🎲", "🎭", "🎨", "🎪", "🎬", "🎤", "🎧", "🎼", "🎹", "🎺", "🎻", "🥁", "🎸", "🎷", "🎵", "🎶", "📱", "💻", "⌨️", "🖱️"],
};

// Generate content for different themes
export function getContentForTheme(theme: CardTheme, pairCount: number): string[] {
    switch (theme) {
        case "emoji": {
            // Mix of animals, fruits, and objects
            const allEmojis = [
                ...emojiSets.animals.slice(0, 12),
                ...emojiSets.fruits.slice(0, 10),
                ...emojiSets.objects.slice(0, 10),
            ];
            return shuffleArray(allEmojis).slice(0, pairCount);
        }

        case "numbers": {
            const numbers: string[] = [];
            for (let i = 1; i <= pairCount; i++) {
                numbers.push(i.toString());
            }
            return numbers;
        }

        case "icons": {
            // Icon names from lucide-react
            const iconNames = [
                "Heart", "Star", "Sun", "Moon", "Cloud", "Zap", "Coffee", "Music",
                "Camera", "Gift", "Bell", "Book", "Bookmark", "Clock", "Compass", "Crown",
                "Diamond", "Flag", "Flame", "Flower", "Home", "Key", "Lock", "Mail",
                "Map", "Palette", "Pencil", "Shield", "Smile", "Trophy", "Umbrella", "Watch",
            ];
            return shuffleArray(iconNames).slice(0, pairCount);
        }

        case "colors": {
            const colors = [
                "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F",
                "#BB8FCE", "#85C1E2", "#F8B88B", "#FAD7A0", "#AED6F1", "#D7BDE2",
                "#A3E4D7", "#F9E79F", "#FADBD8", "#D5F4E6", "#FDEBD0", "#EBDEF0",
                "#E8DAEF", "#D4E6F1", "#D6EAF8", "#FCF3CF", "#FBEEE6", "#E8F8F5",
                "#FAE5D3", "#F4ECF7", "#EAF2F8", "#FEF9E7", "#F4F6F7", "#EAECEE",
                "#D5D8DC", "#CCD1D1",
            ];
            return shuffleArray(colors).slice(0, pairCount);
        }

        default:
            return [];
    }
}

// Get grid size for difficulty
export function getGridSize(difficulty: Difficulty): { rows: number; cols: number } {
    switch (difficulty) {
        case "easy":
            return { rows: 4, cols: 4 }; // 16 cards, 8 pairs
        case "medium":
            return { rows: 6, cols: 6 }; // 36 cards, 18 pairs
        case "hard":
            return { rows: 8, cols: 8 }; // 64 cards, 32 pairs
    }
}

// Get pair count for difficulty
export function getPairCount(difficulty: Difficulty): number {
    switch (difficulty) {
        case "easy":
            return 8;
        case "medium":
            return 18;
        case "hard":
            return 32;
    }
}

// Shuffle array (Fisher-Yates algorithm)
export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
