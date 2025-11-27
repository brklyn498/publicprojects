import React from "react";
import { Flag, Bomb } from "lucide-react";
import { CellData } from "@/store/minesweeperStore";

interface CellProps {
  data: CellData;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export default function Cell({ data, onClick, onContextMenu }: CellProps) {
  const { isRevealed, isFlagged, isMine, neighborMines } = data;

  // Base styles: Fixed size, border, centering
  const baseClasses = "w-8 h-8 sm:w-10 sm:h-10 border-2 border-black flex items-center justify-center font-bold text-lg sm:text-xl cursor-pointer select-none transition-transform";

  // State styles
  let stateClasses = "";
  let content = null;

  if (isRevealed) {
    if (isMine) {
      // Exploded mine
      stateClasses = "bg-red-500";
      content = <Bomb className="w-5 h-5 sm:w-6 sm:h-6 text-black fill-current" />;
    } else {
      // Safe cell
      stateClasses = "bg-white dark:bg-zinc-800";
      if (neighborMines > 0) {
        content = <span style={{ color: getNumberColor(neighborMines) }}>{neighborMines}</span>;
      }
    }
  } else if (isFlagged) {
    // Flagged
    stateClasses = "bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
    content = <Flag className="w-5 h-5 sm:w-6 sm:h-6 text-black fill-current" />;
  } else {
    // Hidden (Normal state)
    stateClasses = "bg-gray-200 dark:bg-zinc-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
  }

  return (
    <div
      className={`${baseClasses} ${stateClasses}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {content}
    </div>
  );
}

const getNumberColor = (num: number) => {
  const colors = [
    '',
    '#2563eb', // 1: Blue
    '#16a34a', // 2: Green
    '#dc2626', // 3: Red
    '#7c3aed', // 4: Purple
    '#db2777', // 5: Pink
    '#0891b2', // 6: Cyan
    '#000000', // 7: Black
    '#4b5563', // 8: Gray
  ];
  return colors[num] || '#000000';
}
