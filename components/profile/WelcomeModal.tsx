"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfileStore } from "@/store/profileStore";
import { getRandomAvatar } from "@/lib/avatars";
import AvatarSelector from "./AvatarSelector";
import { Sparkles } from "lucide-react";

interface WelcomeModalProps {
    onComplete: () => void;
}

export default function WelcomeModal({ onComplete }: WelcomeModalProps) {
    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState(getRandomAvatar());
    const [showAvatarSelector, setShowAvatarSelector] = useState(false);
    const [error, setError] = useState("");
    const { createProfile } = useProfileStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim()) {
            setError("Please enter a username");
            return;
        }

        if (username.trim().length < 3) {
            setError("Username must be at least 3 characters");
            return;
        }

        if (username.trim().length > 20) {
            setError("Username must be less than 20 characters");
            return;
        }

        createProfile(username.trim(), avatar);
        onComplete();
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 max-w-md w-full"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4"
                        >
                            <Sparkles className="w-10 h-10 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Welcome to GameHub!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Create your player profile to track progress and earn achievements
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Choose Avatar
                            </label>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAvatarSelector(true)}
                                    className="w-20 h-20 rounded-full bg-gray-100 dark:bg-dark-border hover:bg-gray-200 dark:hover:bg-dark-highlight flex items-center justify-center text-4xl transition-all hover:scale-110"
                                >
                                    {avatar}
                                </button>
                                <div className="flex-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowAvatarSelector(true)}
                                        className="w-full px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors font-medium"
                                    >
                                        Change Avatar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Username Input */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setError("");
                                }}
                                placeholder="Enter your username"
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                                maxLength={20}
                                autoFocus
                            />
                            {error && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </p>
                            )}
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                {username.length}/20 characters
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Create Profile
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                        By creating a profile, you agree to have fun! 🎮
                    </p>
                </motion.div>
            </motion.div>

            {/* Avatar Selector Modal */}
            <AnimatePresence>
                {showAvatarSelector && (
                    <AvatarSelector
                        selected={avatar}
                        onSelect={(newAvatar) => {
                            setAvatar(newAvatar);
                            setShowAvatarSelector(false);
                        }}
                        onClose={() => setShowAvatarSelector(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
