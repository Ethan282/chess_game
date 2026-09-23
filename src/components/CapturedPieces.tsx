import React from 'react';
import { PlayerColor } from '../types/chess';
import { ChessPiece } from './ChessPiece';

interface CapturedPiecesProps {
  captured: string[]; // piece characters e.g. ['p', 'p', 'n', 'q']
  color: PlayerColor; // color of the captured pieces
  materialAdvantage?: number; // > 0 if this side has positive material advantage
}

const PIECE_WEIGHTS: Record<string, number> = {
  q: 9,
  r: 5,
  b: 3,
  n: 3,
  p: 1,
};

export const CapturedPieces: React.FC<CapturedPiecesProps> = ({
  captured,
  color,
  materialAdvantage = 0,
}) => {
  // Sort pieces by highest value first
  const sortedPieces = [...captured].sort((a, b) => (PIECE_WEIGHTS[b] || 0) - (PIECE_WEIGHTS[a] || 0));

  return (
    <div className="flex items-center gap-1.5 min-h-[32px] px-2 py-1 rounded bg-[#18110b]/60 border border-amber-900/30">
      <div className="flex items-center -space-x-2">
        {sortedPieces.length === 0 ? (
          <span className="text-xs text-amber-200/30 italic px-1 font-mono-code">No captures</span>
        ) : (
          sortedPieces.map((p, idx) => (
            <div key={`${p}-${idx}`} className="w-5 h-5 flex items-center justify-center">
              <ChessPiece type={p as 'p' | 'n' | 'b' | 'r' | 'q' | 'k'} color={color} />
            </div>
          ))
        )}
      </div>

      {materialAdvantage > 0 && (
        <span className="ml-auto text-xs font-mono-code font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
          +{materialAdvantage}
        </span>
      )}
    </div>
  );
};
