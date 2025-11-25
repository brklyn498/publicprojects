"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Trophy } from "lucide-react";
import TicTacToeBoard from "@/components/tictactoe/TicTacToeBoard";
import GameStatus from "@/components/tictactoe/GameStatus";
import GameModeSelector from "@/components/tictactoe/GameModeSelector";
import StatsDisplay from "@/components/tictactoe/StatsDisplay";
import WinModalTTT from "@/components/tictactoe/WinModalTTT";
import ThemeToggle from "@/components/ThemeToggle";

export default function TicTacToePage() {
    const router = useRouter();

    animate = {{ opacity: 1, y: 0 }
}
transition = {{ delay: 0.2 }}
className = "w-full max-w-2xl"
    >
                    <StatsDisplay />
                    <GameModeSelector />
                    <GameStatus />
                    <TicTacToeBoard />

{/* Instructions */ }
<motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
    className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm"
>
    <p>Get 4 in a row to win!</p>
    <p className="mt-1">Rows, columns, or diagonals count</p>
</motion.div>
                </motion.div >
            </main >
        </div >
    );
}
