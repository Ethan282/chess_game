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
    <div className="flex flex-col h-full bg-[#18100a]/90 rounded-xl border border-amber-900/40 overflow-hidden shadow-inner">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#20150e] border-b border-amber-900/30">
        <span className="text-xs font-semibold text-amber-200/80 tracking-wider uppercase font-serif">
          Move History
        </span>
        <span className="text-[11px] font-mono-code text-amber-200/50">
          {moves.length} {moves.length === 1 ? 'ply' : 'plies'}
        </span>
      </div>

      {/* Move list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 text-xs font-mono-code divide-y divide-amber-950/40 space-y-0.5"
      >
        {pairedMoves.length === 0 ? (
          <div className="h-full flex items-center justify-center text-amber-200/30 italic text-center py-6">
            Game has not started yet.<br />Make your first move!
          </div>
        ) : (
          pairedMoves.map(({ moveNum, whiteMove, blackMove }) => {
            const whiteIdx = (moveNum - 1) * 2;
            const blackIdx = whiteIdx + 1;
            const isWhiteActive = currentMoveIndex === whiteIdx;
            const isBlackActive = currentMoveIndex === blackIdx;

            return (
              <div key={moveNum} className="flex items-center py-1 px-1 rounded hover:bg-amber-950/20">
                <span className="w-8 text-amber-300/40 text-right pr-2 select-none">
                  {moveNum}.
                </span>

                {/* White Move */}
                <button
                  onClick={() => onNavigateMove(whiteIdx)}
                  className={`flex-1 text-left px-2 py-0.5 rounded transition-colors ${
                    isWhiteActive
                      ? 'bg-amber-600/40 text-amber-100 font-bold border border-amber-500/50'
                      : 'text-amber-100/80 hover:text-amber-200 hover:bg-amber-900/30'
                  }`}
                >
                  {whiteMove?.san}
                </button>

                {/* Black Move */}
                {blackMove ? (
                  <button
                    onClick={() => onNavigateMove(blackIdx)}
                    className={`flex-1 text-left px-2 py-0.5 rounded transition-colors ${
                      isBlackActive
                        ? 'bg-amber-600/40 text-amber-100 font-bold border border-amber-500/50'
                        : 'text-amber-100/80 hover:text-amber-200 hover:bg-amber-900/30'
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
      <div className="flex items-center justify-center gap-1 p-1.5 bg-[#1e130c] border-t border-amber-900/40">
        <button
          onClick={() => onNavigateMove(-1)}
          disabled={moves.length === 0 || currentMoveIndex === -1}
          title="Start of game"
          className="p-1 rounded text-amber-200/60 hover:text-amber-100 hover:bg-amber-900/40 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => onNavigateMove(Math.max(-1, currentMoveIndex - 1))}
          disabled={moves.length === 0 || currentMoveIndex <= -1}
          title="Previous move"
          className="p-1 rounded text-amber-200/60 hover:text-amber-100 hover:bg-amber-900/40 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => onNavigateMove(Math.min(moves.length - 1, currentMoveIndex + 1))}
          disabled={moves.length === 0 || currentMoveIndex >= moves.length - 1}
          title="Next move"
          className="p-1 rounded text-amber-200/60 hover:text-amber-100 hover:bg-amber-900/40 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => onNavigateMove(moves.length - 1)}
          disabled={moves.length === 0 || currentMoveIndex >= moves.length - 1}
          title="Latest move"
          className="p-1 rounded text-amber-200/60 hover:text-amber-100 hover:bg-amber-900/40 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
