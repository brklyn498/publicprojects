"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { Clock } from "lucide-react";

export default function Timer() {
    const { timerElapsed, isTimerRunning, updateTimerElapsed } = useGameStore();

    // Update timer every second
    useEffect(() => {
        if (!isTimerRunning) return;

        const interval = setInterval(() => {
            updateTimerElapsed();
        }, 1000);

        return () => clearInterval(interval);
    }, [isTimerRunning, updateTimerElapsed]);

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-dark-border rounded-lg">
            <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                {formatTime(timerElapsed)}
            </span>
        </div>
    );
}
