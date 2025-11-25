"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AVATAR_EMOJIS } from "@/lib/avatars";
import { X } from "lucide-react";

interface AvatarSelectorProps {
    selected: string;
    onSelect: (avatar: string) => void;
    onClose?: () => void;
}

export default function AvatarSelector({ selected, onSelect, onClose }: AvatarSelectorProps) {
    const [hoveredAvatar, setHoveredAvatar] = useState<string | null>(null);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Choose Avatar
                    </h2>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-8 gap-2">
                    {AVATAR_EMOJIS.map((emoji) => (
                        <motion.button
                            key={emoji}
                            onClick={() => onSelect(emoji)}
                            onMouseEnter={() => setHoveredAvatar(emoji)}
                            onMouseLeave={() => setHoveredAvatar(null)}
                            className={`
                aspect-square rounded-lg
                flex items-center justify-center
                text-3xl
                transition-all
                ${selected === emoji
                                    ? "bg-blue-500 ring-2 ring-blue-600 scale-110"
                                    : "bg-gray-100 dark:bg-dark-border hover:bg-gray-200 dark:hover:bg-dark-highlight"
                                }
              `}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {emoji}
                        </motion.button>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-center text-blue-800 dark:text-blue-300 text-sm">
                        Selected: <span className="text-3xl ml-2">{selected}</span>
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
