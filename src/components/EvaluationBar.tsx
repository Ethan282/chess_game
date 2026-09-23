import React from 'react';
import { PlayerColor } from '../types/chess';

interface EvaluationBarProps {
  score: number; // in centipawns (+ for white, - for black)
  orientation: PlayerColor;
}

export const EvaluationBar: React.FC<EvaluationBarProps> = ({ score, orientation }) => {
  // Convert centipawns to percentage between 0% and 100%
  // Cap at +/- 1500 cp for visual clarity
  const clampedScore = Math.max(-1500, Math.min(1500, score));
  // Sigmoid-like scale for chess evaluation
  const winPercentage = 50 + (2 / (1 + Math.exp(-0.0035 * clampedScore)) - 1) * 50;

  // If orientation is Black, White is at the bottom or top depending on perspective
  const whiteBarHeight = orientation === 'w' ? winPercentage : 100 - winPercentage;

  const displayScore = () => {
    if (Math.abs(score) > 90000) {
      return score > 0 ? '+M' : '-M';
    }
    const pawns = (score / 100).toFixed(1);
    return score > 0 ? `+${pawns}` : pawns;
  };

  return (
    <div className="relative w-4 sm:w-5 h-full min-h-0 max-h-full rounded-full overflow-hidden bg-[#241a15] border border-amber-900/60 shadow-inner flex flex-col justify-end">
      {/* 50% Equality Center Line */}
      <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-amber-500/60 z-10 pointer-events-none" />

      {/* Black's section (top if White orientation) */}
      <div
        className="w-full bg-[#1b140f] transition-all duration-500 ease-out"
        style={{
          height: `${100 - whiteBarHeight}%`,
        }}
      />

      {/* White's section */}
      <div
        className="w-full bg-gradient-to-t from-[#e8dcce] to-[#fbf8f3] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)]"
        style={{
          height: `${whiteBarHeight}%`,
        }}
      />

      {/* Centered evaluation label badge */}
      <div className="absolute inset-x-0 bottom-2 text-center pointer-events-none">
        <span className="text-[9px] font-mono-code font-bold text-amber-950 px-0.5 rounded bg-white/70 shadow-sm">
          {displayScore()}
        </span>
      </div>
    </div>
  );
};
