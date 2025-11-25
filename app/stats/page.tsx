"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Trophy, Grid3x3, BookOpen } from "lucide-react";
import TicTacToeStats from "@/components/stats/TicTacToeStats";
import CrosswordStats from "@/components/stats/CrosswordStats";
import OverviewStats from "@/components/stats/OverviewStats";
import ThemeToggle from "@/components/ThemeToggle";

type Tab = "overview" | "tictactoe" | "crossword";

export default function StatsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("overview");

    const tabs = [
        { id: "overview" as Tab, label: "Overview", icon: Trophy },
        { id: "tictactoe" as Tab, label: "Tic Tac Toe", icon: Grid3x3 },
        { id: "crossword" as Tab, label: "Crossword", icon: BookOpen },
    ];

    return (
        <div className="min-h-screen bg-warm-gray dark:bg-dark-bg">
            <ThemeToggle />

            {/* Header */}
            <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border py-6 px-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2"
                        >
                            Statistics Dashboard
                        </motion.h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Track your progress and achievements
                        </p>
                    </div>

                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => router.push("/")}
                        className="
              flex items-center gap-2
              px-4 py-2 rounded-lg
              bg-gray-100 dark:bg-dark-border
              hover:bg-gray-200 dark:hover:bg-dark-highlight
              text-gray-700 dark:text-gray-300
              font-medium transition-colors
            "
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Home className="w-5 h-5" />
                        <span className="hidden sm:inline">Home</span>
                    </motion.button>
                </div>
            </header>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex gap-4 sm:gap-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    flex items-center gap-2 px-4 py-4
                    border-b-2 transition-colors
                    ${isActive
                                            ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                                            : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                        }
                  `}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === "overview" && <OverviewStats />}
                    {activeTab === "tictactoe" && <TicTacToeStats />}
                    {activeTab === "crossword" && <CrosswordStats />}
                </motion.div>
            </main>
        </div>
    );
}
