import React, { useRef, useEffect } from 'react';
import { MoveRecord } from '../types/chess';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface MoveHistoryProps {
  moves: MoveRecord[];
  currentMoveIndex: number; // -1 means initial board, moves.length - 1 means latest
  onNavigateMove: (index: number) => void;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({
  moves,
  currentMoveIndex,
  onNavigateMove,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group moves into pairs (White move, Black move)
  const pairedMoves: { whiteMove?: MoveRecord; blackMove?: MoveRecord; moveNum: number }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairedMoves.push({
      moveNum: Math.floor(i / 2) + 1,
      whiteMove: moves[i],
      blackMove: moves[i + 1],
    });
  }

  // Scroll to active move when updated
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves.length]);

  return (
    <div className="flex flex-col h-full bg-[#150e09]/95 rounded-xl border border-amber-900/40 overflow-hidden shadow-inner">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#180f0a] border-b border-amber-900/30 shrink-0">
        <span className="text-[11px] font-semibold text-amber-200/80 tracking-wider uppercase font-serif">
          Move History
        </span>
        <span className="text-[10px] font-mono-code text-amber-300/70 bg-amber-950/50 border border-amber-900/40 px-1.5 py-0.5 rounded">
          {moves.length} {moves.length === 1 ? 'ply' : 'plies'}
        </span>
      </div>

      {/* Notation Table Column Headers */}
      <div className="flex items-center px-2 py-1 bg-[#100804]/80 border-b border-amber-950/60 text-[9px] font-mono-code uppercase tracking-wider text-amber-200/40 shrink-0">
        <span className="w-7 text-right pr-1.5">#</span>
        <span className="flex-1 text-left pl-2">White</span>
        <span className="flex-1 text-left pl-2">Black</span>
      </div>

      {/* Move list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-1.5 text-xs font-mono-code space-y-0.5"
      >
        {pairedMoves.length === 0 ? (
          <div className="h-full flex items-center justify-center text-amber-200/30 italic text-center py-6 text-xs">
            Game has not started yet.<br />Make your first move!
          </div>
        ) : (
          pairedMoves.map(({ moveNum, whiteMove, blackMove }) => {
            const whiteIdx = (moveNum - 1) * 2;
            const blackIdx = whiteIdx + 1;
            const isWhiteActive = currentMoveIndex === whiteIdx;
            const isBlackActive = currentMoveIndex === blackIdx;

            return (
              <div
                key={moveNum}
                className="flex items-center py-0.5 px-1 rounded transition-colors even:bg-white/[0.015] hover:bg-amber-950/25"
              >
                <span className="w-7 text-[10px] text-amber-400/40 text-right pr-1.5 select-none font-mono-code">
                  {moveNum}.
                </span>

                {/* White Move */}
                <button
                  onClick={() => onNavigateMove(whiteIdx)}
                  className={`flex-1 text-left px-1.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                    isWhiteActive
                      ? 'bg-amber-500/25 text-amber-100 font-bold border-l-2 border-amber-400 pl-1.5 shadow-[inset_0_0_8px_rgba(245,158,11,0.2)]'
                      : 'text-amber-100/75 hover:text-amber-100 hover:bg-amber-900/30'
                  }`}
                >
                  {whiteMove?.san}
                </button>

                {/* Black Move */}
                {blackMove ? (
                  <button
                    onClick={() => onNavigateMove(blackIdx)}
                    className={`flex-1 text-left px-1.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                      isBlackActive
                        ? 'bg-amber-500/25 text-amber-100 font-bold border-l-2 border-amber-400 pl-1.5 shadow-[inset_0_0_8px_rgba(245,158,11,0.2)]'
                        : 'text-amber-100/75 hover:text-amber-100 hover:bg-amber-900/30'
                    }`}
                  >
                    {blackMove.san}
                  </button>
                ) : (
                  <div className="flex-1" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between px-2 py-1 bg-[#120a06] border-t border-amber-900/40 shrink-0">
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onNavigateMove(-1)}
            disabled={moves.length === 0 || currentMoveIndex === -1}
            title="Start of game (|<<)"
            className="p-1 rounded text-amber-200/60 hover:text-amber-100 hover:bg-amber-900/30 disabled:opacity-25 disabled:pointer-events-none transition-colors"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateMove(Math.max(-1, currentMoveIndex - 1))}
            disabled={moves.length === 0 || currentMoveIndex <= -1}
            title="Previous move (<)"
            className="p-1 rounded text-amber-200/60 hover:text-amber-100 hover:bg-amber-900/30 disabled:opacity-25 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Current Move Indicator */}
        <span className="text-[10px] font-mono-code text-amber-200/50">
          {currentMoveIndex === -1
            ? 'Initial Board'
            : `Move ${Math.floor(currentMoveIndex / 2) + 1}${currentMoveIndex % 2 === 0 ? ' (White)' : ' (Black)'}`}
        </span>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onNavigateMove(Math.min(moves.length - 1, currentMoveIndex + 1))}
            disabled={moves.length === 0 || currentMoveIndex >= moves.length - 1}
            title="Next move (>)"
            className="p-1 rounded text-amber-200/60 hover:text-amber-100 hover:bg-amber-900/30 disabled:opacity-25 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateMove(moves.length - 1)}
            disabled={moves.length === 0 || currentMoveIndex >= moves.length - 1}
            title="Latest move (>>|)"
            className="p-1 rounded text-amber-200/60 hover:text-amber-100 hover:bg-amber-900/30 disabled:opacity-25 disabled:pointer-events-none transition-colors"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
