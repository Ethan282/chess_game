import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Eye } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  result: 'white_win' | 'black_win' | 'draw';
  reason: string;
  onPlayAgain: () => void;
  onReviewBoard: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  result,
  reason,
  onPlayAgain,
  onReviewBoard,
}) => {
  useEffect(() => {
    if (isOpen && (result === 'white_win' || result === 'black_win')) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#d97706', '#fbbf24', '#ffffff', '#78350f'],
      });
    }
  }, [isOpen, result]);

  if (!isOpen) return null;

  const title =
    result === 'white_win'
      ? 'White Wins!'
      : result === 'black_win'
      ? 'Black Wins!'
      : 'Game Drawn!';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#1e130c] border border-amber-800/80 rounded-2xl p-6 shadow-2xl text-center">
        {/* Brass corner ornaments */}
        <div className="absolute top-2 left-2 w-4 h-4 brass-corner rounded-tl-sm opacity-90" />
        <div className="absolute top-2 right-2 w-4 h-4 brass-corner rounded-tr-sm opacity-90" />
        <div className="absolute bottom-2 left-2 w-4 h-4 brass-corner rounded-bl-sm opacity-90" />
        <div className="absolute bottom-2 right-2 w-4 h-4 brass-corner rounded-br-sm opacity-90" />

        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-amber-950/80 border border-amber-600/50 flex items-center justify-center shadow-lg">
          <Trophy className="w-7 h-7 text-amber-400" />
        </div>

        <h2 className="font-serif text-2xl font-bold text-amber-100 tracking-wide mb-1">
          {title}
        </h2>
        <p className="text-xs font-mono-code text-amber-200/70 mb-6 uppercase tracking-wider">
          {reason}
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>

          <button
            onClick={onReviewBoard}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-[#281810] hover:bg-[#341f14] border border-amber-900/60 text-amber-200/80 text-xs font-semibold transition-colors"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            Review Position
          </button>
        </div>
      </div>
    </div>
  );
};
