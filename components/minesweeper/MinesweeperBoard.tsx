"use client";

import { useMinesweeperStore } from "@/store/minesweeperStore";
import Cell from "./Cell";

export default function MinesweeperBoard() {
  const { grid, revealCell, toggleFlag } = useMinesweeperStore();

  if (!grid || grid.length === 0) return null;

  return (
    <div className="
      overflow-auto
      max-w-full
      border-[6px] border-black
      bg-gray-300
      p-4
      shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]
      inline-block
    ">
        <div
            className="grid gap-1 bg-black p-1"
            style={{
                gridTemplateColumns: `repeat(${grid[0].length}, min-content)`,
            }}
        >
            {grid.map((row, rIndex) => (
                row.map((cell, cIndex) => (
                    <Cell
                        key={`${rIndex}-${cIndex}`}
                        data={cell}
                        onClick={() => revealCell(rIndex, cIndex)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            toggleFlag(rIndex, cIndex);
                        }}
                    />
                ))
            ))}
        </div>
    </div>
  );
}
