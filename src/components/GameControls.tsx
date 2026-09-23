import React from 'react';
import { CameraView, GameMode, SkillMode, PlayerColor, ClockPresetId } from '../types/chess';
import {
  RotateCcw,
  Sparkles,
  Layers,
  ArrowUpDown,
  FileCode2,
  Flag,
  Handshake,
  Swords,
  Crown,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

interface GameControlsProps {
  mode: GameMode;
  skillMode: SkillMode;
  cameraView: CameraView;
  onChangeCamera: (view: CameraView) => void;
  onFlipBoard: () => void;
  onUndo: () => void;
  onHint: () => void;
  hasActiveHint?: boolean;
  onOpenFenPgn: () => void;
  onResign: () => void;
  onOfferDraw: () => void;
  canUndo: boolean;
  isAiThinking: boolean;
  clockPreset: ClockPresetId;
  onOpenLobby?: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  mode,
  skillMode,
  cameraView,
  onChangeCamera,
  onFlipBoard,
  onUndo,
  onHint,
  hasActiveHint,
  onOpenFenPgn,
  onResign,
  onOfferDraw,
  canUndo,
  isAiThinking,
  clockPreset,
  onOpenLobby,
}) => {
  return (
    <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-[#150e09]/95 border border-amber-900/40 shadow-lg">
      {/* Top Status & Secondary Actions Bar */}
      <div className="flex items-center justify-between gap-1.5 px-2 py-1 rounded-lg bg-[#0e0704]/70 border border-amber-950/60">
        {/* Match Info Badge */}
        <div className="flex items-center gap-1.5 min-w-0">
          {skillMode === 'beginner' && (
            <span className="flex items-center gap-1 text-[9px] font-mono-code font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
              <Eye className="w-2.5 h-2.5" /> Beginner 800
            </span>
          )}
          {skillMode === 'intermediate' && (
            <span className="flex items-center gap-1 text-[9px] font-mono-code font-bold text-amber-300 bg-amber-950/60 border border-amber-800/50 px-1.5 py-0.5 rounded">
              <Swords className="w-2.5 h-2.5" /> Club 1500
            </span>
          )}
          {skillMode === 'pro' && (
            <span className="flex items-center gap-1 text-[9px] font-mono-code font-bold text-purple-300 bg-purple-950/60 border border-purple-800/50 px-1.5 py-0.5 rounded">
              <Crown className="w-2.5 h-2.5" /> Pro 2400+
            </span>
          )}

          {clockPreset !== 'casual' && (
            <span className="text-[9px] text-amber-200/50 font-mono-code uppercase tracking-wider">
              {clockPreset}
            </span>
          )}
        </div>

        {/* Secondary Actions: Setup/Lobby, FEN/PGN, Draw, Resign */}
        <div className="flex items-center gap-0.5 shrink-0">
          {onOpenLobby && (
            <button
              onClick={onOpenLobby}
              title="Match Settings & Lobby"
              className="p-1 rounded text-amber-200/60 hover:text-amber-100 hover:bg-amber-900/30 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onOpenFenPgn}
            title="FEN / PGN Export & Import"
            className="p-1 rounded text-amber-200/60 hover:text-amber-100 hover:bg-amber-900/30 transition-colors"
          >
            <FileCode2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOfferDraw}
            title="Offer / Claim Draw"
            className="p-1 rounded text-amber-200/60 hover:text-amber-100 hover:bg-amber-900/30 transition-colors"
          >
            <Handshake className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onResign}
            title="Resign Game"
            className="p-1 rounded text-red-400/70 hover:text-red-300 hover:bg-red-950/40 transition-colors"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary Action Buttons: Camera View, Flip, Undo, Hint */}
      <div className={`grid gap-1.5 ${skillMode === 'pro' ? 'grid-cols-3' : 'grid-cols-4'}`}>
        {/* Camera Perspective Dropdown */}
        <div className="relative group">
          <button
            title="Switch board camera perspective"
            className="w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#20140c] border border-amber-900/40 hover:border-amber-600/50 hover:bg-[#2b1a10] text-amber-200/90 text-[11px] font-medium transition-colors"
          >
            <Layers className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">
              {cameraView === '3d-angled' ? '3D Angle' : cameraView === '3d-front' ? '3D Front' : '2D Flat'}
            </span>
          </button>
          <div className="absolute top-full left-0 mt-1 w-28 bg-[#1e130c] border border-amber-800/60 rounded-lg shadow-xl p-1 z-30 hidden group-hover:block group-focus-within:block">
            <button
              onClick={() => onChangeCamera('3d-angled')}
              className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors ${
                cameraView === '3d-angled'
                  ? 'bg-amber-600/40 text-amber-100 font-semibold'
                  : 'text-amber-200/70 hover:bg-amber-900/30 hover:text-amber-100'
              }`}
            >
              3D Angled
            </button>
            <button
              onClick={() => onChangeCamera('3d-front')}
              className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors ${
                cameraView === '3d-front'
                  ? 'bg-amber-600/40 text-amber-100 font-semibold'
                  : 'text-amber-200/70 hover:bg-amber-900/30 hover:text-amber-100'
              }`}
            >
              3D Front
            </button>
            <button
              onClick={() => onChangeCamera('2d-flat')}
              className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors ${
                cameraView === '2d-flat'
                  ? 'bg-amber-600/40 text-amber-100 font-semibold'
                  : 'text-amber-200/70 hover:bg-amber-900/30 hover:text-amber-100'
              }`}
            >
              2D Classic
            </button>
          </div>
        </div>

        {/* Flip Board */}
        <button
          onClick={onFlipBoard}
          title="Flip board perspective"
          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#20140c] border border-amber-900/40 hover:border-amber-600/50 hover:bg-[#2b1a10] text-amber-200/90 text-[11px] font-medium transition-colors"
        >
          <ArrowUpDown className="w-3 h-3 text-amber-400 shrink-0" />
          <span>Flip</span>
        </button>

        {/* Undo Move */}
        <button
          onClick={onUndo}
          disabled={!canUndo || isAiThinking}
          title="Take back last move"
          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#20140c] border border-amber-900/40 hover:border-amber-600/50 hover:bg-[#2b1a10] disabled:opacity-35 disabled:pointer-events-none text-amber-200/90 text-[11px] font-medium transition-colors"
        >
          <RotateCcw className="w-3 h-3 text-amber-400 shrink-0" />
          <span>Undo</span>
        </button>

        {/* Move Hint (Hidden in Pro mode) */}
        {skillMode !== 'pro' && (
          <button
            onClick={onHint}
            disabled={isAiThinking}
            title={hasActiveHint ? "Clear tactical hint" : "Get instant tactical hint"}
            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border text-[11px] font-medium transition-all ${
              hasActiveHint
                ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/40'
                : 'bg-[#20140c] border-amber-900/40 hover:border-amber-600/50 hover:bg-[#2b1a10] text-amber-200/90'
            } disabled:opacity-35 disabled:pointer-events-none`}
          >
            <Sparkles className={`w-3 h-3 ${hasActiveHint ? 'text-emerald-400 animate-spin' : 'text-amber-400'} shrink-0`} style={hasActiveHint ? { animationDuration: '3s' } : undefined} />
            <span>{hasActiveHint ? 'Hinting' : 'Hint'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
