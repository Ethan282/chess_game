import React from 'react';
import { PlayerColor } from '../types/chess';
import { ChessPiece } from './ChessPiece';

interface PromotionModalProps {
  color: PlayerColor;
  onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void;
  onCancel: () => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({
  color,
  onSelect,
  onCancel,
}) => {
  const pieces: ('q' | 'r' | 'b' | 'n')[] = ['q', 'r', 'b', 'n'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#1e130c] border border-amber-800/80 rounded-2xl p-6 shadow-2xl text-center">
        {/* Brass corner ornaments */}
        <div className="absolute top-2 left-2 w-4 h-4 brass-corner rounded-tl-sm opacity-90" />
        <div className="absolute top-2 right-2 w-4 h-4 brass-corner rounded-tr-sm opacity-90" />
        <div className="absolute bottom-2 left-2 w-4 h-4 brass-corner rounded-bl-sm opacity-90" />
        <div className="absolute bottom-2 right-2 w-4 h-4 brass-corner rounded-br-sm opacity-90" />

        <h3 className="font-serif text-lg font-bold text-amber-100 tracking-wide mb-1">
          Pawn Promotion
        </h3>
        <p className="text-xs text-amber-200/60 mb-6">
          Select a piece to promote your pawn
        </p>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {pieces.map((p) => {
            const labelMap: Record<string, string> = {
              q: 'Queen',
              r: 'Rook',
              b: 'Bishop',
              n: 'Knight',
            };

            return (
              <button
                key={p}
                onClick={() => onSelect(p)}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-[#2b1b11] border border-amber-900/60 hover:border-amber-500/80 hover:bg-[#3a2518] hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                <div className="w-12 h-12 flex items-center justify-center">
                  <ChessPiece type={p} color={color} />
                </div>
                <span className="text-xs font-semibold text-amber-200/90 group-hover:text-amber-100">
                  {labelMap[p]}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onCancel}
          className="text-xs text-amber-200/50 hover:text-amber-200 transition-colors py-1 px-3"
        >
          Cancel Move
        </button>
      </div>
    </div>
  );
};
