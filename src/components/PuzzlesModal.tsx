import React from 'react';
import { CHESS_PUZZLES } from '../utils/puzzles';
import { Puzzle } from '../types/chess';
import { X, Trophy, CheckCircle2 } from 'lucide-react';

interface PuzzlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPuzzle: (puzzle: Puzzle) => void;
  completedPuzzleIds: string[];
}

export const PuzzlesModal: React.FC<PuzzlesModalProps> = ({
  isOpen,
  onClose,
  onSelectPuzzle,
  completedPuzzleIds,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#1e130c] border border-amber-800/80 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Brass corner ornaments */}
        <div className="absolute top-2 left-2 w-4 h-4 brass-corner rounded-tl-sm opacity-90" />
        <div className="absolute top-2 right-2 w-4 h-4 brass-corner rounded-tr-sm opacity-90" />
        <div className="absolute bottom-2 left-2 w-4 h-4 brass-corner rounded-bl-sm opacity-90" />
        <div className="absolute bottom-2 right-2 w-4 h-4 brass-corner rounded-br-sm opacity-90" />

        <div className="flex items-center justify-between pb-4 border-b border-amber-900/40">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-amber-100">
              Master Tactical Puzzles
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-200/50 hover:text-amber-100 hover:bg-amber-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-amber-200/70 py-3">
          Sharpen your calculation and tactical vision by solving iconic historic chess positions.
        </p>

        {/* Puzzle List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {CHESS_PUZZLES.map((puzzle) => {
            const isCompleted = completedPuzzleIds.includes(puzzle.id);

            return (
              <button
                key={puzzle.id}
                onClick={() => {
                  onSelectPuzzle(puzzle);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
                  isCompleted
                    ? 'bg-[#182618]/70 border-emerald-800/50 hover:border-emerald-500/80'
                    : 'bg-[#281810]/80 border-amber-900/40 hover:border-amber-600/70 hover:bg-[#341f14]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-amber-100 group-hover:text-amber-300">
                      {puzzle.title}
                    </span>
                    <span
                      className={`text-[10px] font-mono-code px-1.5 py-0.5 rounded uppercase font-semibold ${
                        puzzle.difficulty === 'Easy'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                          : puzzle.difficulty === 'Medium'
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-800/50'
                          : 'bg-red-950/80 text-red-400 border border-red-800/50'
                      }`}
                    >
                      {puzzle.difficulty}
                    </span>
                    <span className="text-[11px] text-amber-200/40">
                      {puzzle.theme}
                    </span>
                  </div>
                  <p className="text-xs text-amber-200/60 leading-relaxed">
                    {puzzle.prompt}
                  </p>
                </div>

                <div className="shrink-0 pl-3">
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold font-mono-code">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Solved
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-amber-400 group-hover:underline">
                      Solve &rarr;
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
