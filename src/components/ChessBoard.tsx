import React, { useState, useRef, useEffect } from 'react';
import { Square, PieceSymbol, Color } from 'chess.js';
import { PlayerColor, CameraView, BestMoveHint } from '../types/chess';
import { ChessPiece } from './ChessPiece';

interface ChessBoardProps {
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  turn: PlayerColor;
  playerOrientation: PlayerColor;
  selectedSquare: Square | null;
  validMoves: string[];
  lastMove: { from: Square; to: Square } | null;
  inCheckSquare: Square | null;
  hintMove: BestMoveHint | null;
  cameraView: CameraView;
  onSquareClick: (square: Square) => void;
  onPieceDrop: (from: Square, to: Square) => void;
  disabled?: boolean;
  showMovePoints?: boolean;
  showLastMoveHighlight?: boolean;
  invalidSquare?: Square | null;
  isGameStarted?: boolean;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  turn,
  playerOrientation,
  selectedSquare,
  validMoves,
  lastMove,
  inCheckSquare,
  hintMove,
  cameraView,
  onSquareClick,
  onPieceDrop,
  disabled = false,
  showMovePoints = true,
  showLastMoveHighlight = true,
  invalidSquare = null,
  isGameStarted = true,
}) => {
  const [draggedSquare, setDraggedSquare] = useState<Square | null>(null);
  const dragImageRef = useRef<HTMLDivElement>(null);
  const [animatingMove, setAnimatingMove] = useState<{ from: Square; to: Square; key: number } | null>(null);

  const isFlipped = playerOrientation === 'b';
  const displayRanks = isFlipped ? [...RANKS].reverse() : RANKS;
  const displayFiles = isFlipped ? [...FILES].reverse() : FILES;

  // Track and trigger smooth physical piece movement animation on every lastMove
  useEffect(() => {
    if (lastMove && lastMove.from && lastMove.to) {
      setAnimatingMove({ ...lastMove, key: Date.now() });
      const timer = setTimeout(() => {
        setAnimatingMove(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [lastMove?.from, lastMove?.to]);

  const getSquareCoords = (square: Square) => {
    const file = square[0];
    const rank = square[1];
    const col = displayFiles.indexOf(file);
    const row = displayRanks.indexOf(rank);
    return { col, row };
  };

  // Camera view transform for the board plinth
  const getCameraTransform = () => {
    switch (cameraView) {
      case '3d-angled':
        return 'rotateX(22deg) scale(0.97) translateY(-6px)';
      case '3d-front':
        return 'rotateX(12deg) scale(0.98) translateY(-2px)';
      case '2d-flat':
      default:
        return 'rotateX(0deg) scale(1) translateY(0px)';
    }
  };

  const getBoardFrameClass = () => {
    switch (cameraView) {
      case '3d-angled':
        return 'wood-rim-frame wood-rim-frame-3d-angled';
      case '3d-front':
        return 'wood-rim-frame wood-rim-frame-3d-front';
      case '2d-flat':
      default:
        return 'wood-rim-frame wood-rim-frame-2d';
    }
  };

  // Authentic Staunton Piece Height Proportions for 3D & 2D views
  const getPieceHeight = (type: PieceSymbol, view: CameraView): string => {
    if (view === '3d-angled') {
      switch (type) {
        case 'k':
          return '154%';
        case 'q':
          return '145%';
        case 'b':
          return '135%';
        case 'n':
          return '126%';
        case 'r':
          return '118%';
        case 'p':
        default:
          return '102%';
      }
    }
    if (view === '3d-front') {
      switch (type) {
        case 'k':
          return '138%';
        case 'q':
          return '130%';
        case 'b':
          return '122%';
        case 'n':
          return '115%';
        case 'r':
          return '108%';
        case 'p':
        default:
          return '96%';
      }
    }
    return '95%';
  };

  // Billboarding: pieces stand upright perpendicular to the 3D board
  const getPieceTransform = (isAnimatingPiece: boolean, animDx: number, animDy: number) => {
    let baseTransform = '';
    if (cameraView === '3d-angled') {
      baseTransform = 'rotateX(-22deg) translateZ(8px)';
    } else if (cameraView === '3d-front') {
      baseTransform = 'rotateX(-12deg) translateZ(4px)';
    }

    if (isAnimatingPiece) {
      return {
        '--move-dx': `${animDx}%`,
        '--move-dy': `${animDy}%`,
        transform: baseTransform || undefined,
        transformOrigin: 'bottom center',
      } as React.CSSProperties;
    }

    return baseTransform
      ? ({
          transform: baseTransform,
          transformOrigin: 'bottom center',
          transition: 'transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1)',
        } as React.CSSProperties)
      : undefined;
  };

  const handleDragStart = (e: React.DragEvent, square: Square) => {
    if (disabled || !isGameStarted) return;
    setDraggedSquare(square);
    e.dataTransfer.setData('text/plain', square);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isGameStarted) return;
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSquare: Square) => {
    e.preventDefault();
    if (disabled || !isGameStarted || !draggedSquare) return;
    onPieceDrop(draggedSquare, targetSquare);
    setDraggedSquare(null);
  };

  const handleDragEnd = () => {
    setDraggedSquare(null);
  };

  return (
    <div className="relative h-full w-full max-h-full max-w-full aspect-square flex items-center justify-center p-2 sm:p-3 select-none chess-3d-stage">
      {/* 3D Board Solid Wood Plinth */}
      <div
        className={`relative w-full h-full rounded-2xl p-2 sm:p-3 md:p-3.5 chess-3d-board-wrapper shadow-2xl ${getBoardFrameClass()}`}
        style={{
          transform: getCameraTransform(),
        }}
      >
        {/* Brass Inlaid Corner Brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 brass-corner rounded-tl-sm opacity-90 border-r border-b border-amber-950/40" />
        <div className="absolute top-2 right-2 w-4 h-4 brass-corner rounded-tr-sm opacity-90 border-l border-b border-amber-950/40" />
        <div className="absolute bottom-2 left-2 w-4 h-4 brass-corner rounded-bl-sm opacity-90 border-r border-t border-amber-950/40" />
        <div className="absolute bottom-2 right-2 w-4 h-4 brass-corner rounded-br-sm opacity-90 border-l border-t border-amber-950/40" />

        {/* Inset Gold File / Fillet line around board */}
        <div className="relative w-full h-full rounded-lg p-0.5 sm:p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,215,0,0.22)] bg-[#120a06]/90 flex flex-col">
          {/* Top Edge Rank Coordinates */}
          <div className="flex justify-between items-center px-3 sm:px-4 py-0.5 text-[9px] sm:text-[10px] md:text-xs font-serif font-bold text-amber-200/50 tracking-widest uppercase">
            {displayFiles.map((file) => (
              <span key={`top-${file}`} className="w-full text-center">
                {file}
              </span>
            ))}
          </div>

          {/* Main 8x8 Board Grid with Left/Right Ranks */}
          <div className="relative flex-1 min-h-0 flex" style={{ transformStyle: 'preserve-3d' }}>
            {/* Left Rank Numbers */}
            <div className="flex flex-col justify-between py-1 text-[9px] sm:text-[10px] md:text-xs font-serif font-bold text-amber-200/50 pr-1 sm:pr-1.5">
              {displayRanks.map((rank) => (
                <span key={`left-${rank}`} className="h-full flex items-center justify-center">
                  {rank}
                </span>
              ))}
            </div>

            {/* The 64 Squares Matrix */}
            <div 
              className="flex-1 min-h-0 grid grid-cols-8 grid-rows-8 rounded shadow-2xl border border-amber-900/60 bg-stone-900 relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {displayRanks.map((rank, rankIdx) => {
                const row = 8 - parseInt(rank, 10);

                return displayFiles.map((file, fileIdx) => {
                  const col = file.charCodeAt(0) - 97;
                  const squareName = `${file}${rank}` as Square;
                  const isLightSquare = (fileIdx + rankIdx) % 2 === 0;

                  // Find piece from board state directly matching square coordinates
                  const piece = board[row]?.[col];

                  const isSelected = selectedSquare === squareName;
                  const isValidTarget = validMoves.includes(squareName);
                  const isLastMoveFrom = showLastMoveHighlight && lastMove && lastMove.from === squareName;
                  const isLastMoveTo = showLastMoveHighlight && lastMove && lastMove.to === squareName;
                  const isCheckedKingSquare = inCheckSquare === squareName;
                  const isHintSource = hintMove?.from === squareName;
                  const isHintTarget = hintMove?.to === squareName;

                  const isAnimatingPiece = animatingMove && animatingMove.to === squareName;
                  let animDx = 0;
                  let animDy = 0;
                  if (isAnimatingPiece) {
                    const fromCoords = getSquareCoords(animatingMove.from);
                    const toCoords = getSquareCoords(animatingMove.to);
                    animDx = (fromCoords.col - toCoords.col) * 100;
                    animDy = (fromCoords.row - toCoords.row) * 100;
                  }

                  return (
                    <div
                      key={squareName}
                      data-square={squareName}
                      onClick={() => !disabled && onSquareClick(squareName)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, squareName)}
                      className={`relative flex items-end justify-center cursor-pointer transition-colors duration-150 ${
                        isLightSquare ? 'wood-maple-light text-stone-900' : 'wood-walnut-dark text-amber-100'
                      } ${invalidSquare === squareName ? 'animate-invalid-shake ring-2 ring-red-500' : ''}`}
                      style={{
                        transformStyle: 'preserve-3d',
                        zIndex: isSelected ? 99 : (rankIdx + 1) * 10,
                      }}
                    >
                      {/* Last Move Origin (Departure) Highlight */}
                      {isLastMoveFrom && (
                        <div className="absolute inset-0 bg-amber-400/30 ring-1 ring-inset ring-amber-400/50 pointer-events-none z-[1]" />
                      )}

                      {/* Last Move Destination (Arrival) Highlight */}
                      {isLastMoveTo && (
                        <div className="absolute inset-0 bg-amber-500/40 ring-2 ring-inset ring-amber-300/80 shadow-[inset_0_0_14px_rgba(245,158,11,0.4)] pointer-events-none z-[1]" />
                      )}

                      {/* Selected Square Highlight */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-amber-400/40 ring-2 ring-inset ring-amber-300 shadow-[inset_0_0_12px_rgba(245,158,11,0.45)] pointer-events-none z-[3]" />
                      )}

                      {/* In-Check Ruby Highlight */}
                      {isCheckedKingSquare && (
                        <div className="absolute inset-0 bg-red-600/50 animate-pulse pointer-events-none ring-2 ring-red-500 z-[3]" />
                      )}

                      {/* Tactical Hint Highlight */}
                      {(isHintSource || isHintTarget) && (
                        <div className="absolute inset-0 border-2 border-emerald-400 bg-emerald-500/20 animate-pulse pointer-events-none z-[3]" />
                      )}

                      {/* 3D Contact Shadow on the Board Tile */}
                      {piece && (
                        <div
                          className={`absolute bottom-0.5 sm:bottom-1 w-[72%] h-[20%] rounded-[50%] transition-all duration-200 pointer-events-none z-[1] ${
                            isSelected
                              ? 'bg-black/35 blur-[4px] scale-110'
                              : 'bg-black/70 blur-[2px]'
                          }`}
                          style={{
                            boxShadow: cameraView === '3d-angled' 
                              ? '0 3px 6px rgba(0, 0, 0, 0.7), 2px 4px 8px rgba(0, 0, 0, 0.5)' 
                              : '0 2px 4px rgba(0, 0, 0, 0.6)',
                            transform: cameraView === '3d-angled' ? 'scaleY(0.6) rotate(-2deg)' : undefined,
                          }}
                        />
                      )}

                      {/* Piece Rendering with Real Movement Gliding Animation & 3D Upright Billboarding */}
                      {piece && (
                        <div
                          draggable={!disabled && isGameStarted && piece.color === turn}
                          onDragStart={(e) => handleDragStart(e, squareName)}
                          onDragEnd={handleDragEnd}
                          className={`absolute inset-x-0 bottom-1 sm:bottom-1.5 flex items-end justify-center pointer-events-auto select-none ${
                            isAnimatingPiece ? 'animate-piece-glide z-[90]' : 'z-[5]'
                          } ${
                            piece.color === turn && isGameStarted ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                          }`}
                          style={{
                            height: getPieceHeight(piece.type, cameraView),
                            transformOrigin: 'bottom center',
                            ...getPieceTransform(!!isAnimatingPiece, animDx, animDy),
                          }}
                        >
                          <ChessPiece
                            type={piece.type}
                            color={piece.color}
                            isSelected={isSelected}
                            isDragging={draggedSquare === squareName}
                            cameraView={cameraView}
                          />
                        </div>
                      )}

                      {/* Legal Move Points & Targets (Visible in Beginner & Intermediate modes) */}
                      {isValidTarget && showMovePoints && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                          {piece ? (
                            // Capturable target: Inlaid Golden Reticle Ring around enemy piece
                            <div className="relative w-[86%] h-[86%] flex items-center justify-center">
                              <div className="w-full h-full rounded-full border-[3.5px] border-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.85)] animate-capture-ring" />
                              <div className="absolute inset-1 rounded-full border border-amber-300/40 pointer-events-none" />
                            </div>
                          ) : (
                            // Quiet move target: Illuminated Brass Dot with glowing halo
                            <div className="relative flex items-center justify-center">
                              <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-950/70 shadow-[0_2px_5px_rgba(0,0,0,0.6),0_0_10px_rgba(245,158,11,0.7)] animate-move-point" />
                              <div className="absolute w-6 h-6 md:w-7 md:h-7 rounded-full bg-amber-400/25 blur-[2px] pointer-events-none" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                });
              })}

            </div>

            {/* Match Ready Locked Overlay */}
            {!isGameStarted && (
              <div className="absolute inset-0 ml-4 mr-4 my-0 bg-black/40 backdrop-blur-[1px] rounded flex flex-col items-center justify-center pointer-events-none z-[95]">
                <div className="px-3.5 py-1.5 rounded-xl bg-[#1b1009]/95 border border-amber-500/70 shadow-2xl text-center flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="font-serif font-bold text-amber-200 text-[11px] tracking-wide">
                    Match Paused • Click "Start Match" to Play
                  </span>
                </div>
              </div>
            )}

            {/* Right Rank Numbers */}
            <div className="flex flex-col justify-between py-1 text-[9px] sm:text-[10px] md:text-xs font-serif font-bold text-amber-200/50 pl-1 sm:pl-1.5">
              {displayRanks.map((rank) => (
                <span key={`right-${rank}`} className="h-full flex items-center justify-center">
                  {rank}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Edge File Coordinates */}
          <div className="flex justify-between items-center px-3 sm:px-4 py-0.5 text-[9px] sm:text-[10px] md:text-xs font-serif font-bold text-amber-200/50 tracking-widest uppercase">
            {displayFiles.map((file) => (
              <span key={`bottom-${file}`} className="w-full text-center">
                {file}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div ref={dragImageRef} className="hidden" />
    </div>
  );
};
