"use client";

import { Delete } from "lucide-react";

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  language?: "en" | "ru";
}

const KEYBOARD_ROWS_EN = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const KEYBOARD_ROWS_RU = [
  ["Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х"],
  ["Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э"],
  ["Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю"],
];

export default function VirtualKeyboard({
  onKeyPress,
  onBackspace,
  language = "en",
}: VirtualKeyboardProps) {
  const KEYBOARD_ROWS = language === "ru" ? KEYBOARD_ROWS_RU : KEYBOARD_ROWS_EN;

  return (
    <div className="w-full max-w-2xl mx-auto px-2 pb-4 md:pb-6">
      <div className="space-y-1.5 sm:space-y-2">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className="
                  flex items-center justify-center
                  bg-gray-200 dark:bg-dark-border hover:bg-gray-300 dark:hover:bg-gray-500 active:bg-gray-400 dark:active:bg-gray-600
                  text-gray-900 dark:text-white font-semibold
                  rounded transition-colors
                  w-7 h-10 text-sm
                  sm:w-9 sm:h-12 sm:text-base
                  md:w-10 md:h-14 md:text-lg
                  touch-manipulation
                  select-none
                "
              >
                {key}
              </button>
            ))}
            {rowIndex === KEYBOARD_ROWS.length - 1 && (
              <button
                onClick={onBackspace}
                className="
                  flex items-center justify-center
                  bg-gray-300 dark:bg-dark-border hover:bg-gray-400 dark:hover:bg-gray-500 active:bg-gray-500 dark:active:bg-gray-600
                  text-gray-900 dark:text-white
                  rounded transition-colors
                  w-14 h-10
                  sm:w-16 sm:h-12
                  md:w-20 md:h-14
                  touch-manipulation
                  select-none
                "
              >
                <Delete className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
