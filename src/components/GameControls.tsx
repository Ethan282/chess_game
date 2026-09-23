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
    <div className="flex flex-col gap-2.5 p-3 rounded-2xl bg-[#17100b]/90 border border-amber-950/60 shadow-xl">
      {/* Primary Action Row: Camera View, Flip, Undo, Hint */}
      <div className="grid grid-cols-4 gap-2">
        {/* Camera Perspective Dropdown */}
        <div className="relative group">
          <button
            title="Switch board camera perspective"
            className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#24170f] border border-amber-900/50 hover:border-amber-600/60 hover:bg-[#301e13] text-amber-200/90 text-xs font-medium transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              {cameraView === '3d-angled' ? '3D Angle' : cameraView === '3d-front' ? '3D Front' : '2D Flat'}
            </span>
          </button>
          <div className="absolute top-full left-0 mt-1 w-32 bg-[#20150e] border border-amber-800/60 rounded-xl shadow-xl p-1 z-30 hidden group-hover:block group-focus-within:block">
            <button
              onClick={() => onChangeCamera('3d-angled')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                cameraView === '3d-angled'
                  ? 'bg-amber-600/40 text-amber-100 font-semibold'
                  : 'text-amber-200/70 hover:bg-amber-900/30 hover:text-amber-100'
              }`}
            >
              3D Angled
            </button>
            <button
              onClick={() => onChangeCamera('3d-front')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                cameraView === '3d-front'
                  ? 'bg-amber-600/40 text-amber-100 font-semibold'
                  : 'text-amber-200/70 hover:bg-amber-900/30 hover:text-amber-100'
              }`}
            >
              3D Front
            </button>
            <button
              onClick={() => onChangeCamera('2d-flat')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
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
          className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#24170f] border border-amber-900/50 hover:border-amber-600/60 hover:bg-[#301e13] text-amber-200/90 text-xs font-medium transition-colors"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Flip</span>
        </button>

        {/* Undo Move */}
        <button
          onClick={onUndo}
          disabled={!canUndo || isAiThinking}
          title="Take back last move"
          className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#24170f] border border-amber-900/50 hover:border-amber-600/60 hover:bg-[#301e13] disabled:opacity-40 disabled:pointer-events-none text-amber-200/90 text-xs font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Undo</span>
        </button>

        {/* Move Hint (Hidden in Pro mode) */}
        {skillMode !== 'pro' && (
          <button
            onClick={onHint}
            disabled={isAiThinking}
            title={hasActiveHint ? "Clear tactical hint" : "Get instant tactical hint"}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-medium transition-all ${
              hasActiveHint
                ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/40'
                : 'bg-[#24170f] border-amber-900/50 hover:border-amber-600/60 hover:bg-[#301e13] text-amber-200/90'
            } disabled:opacity-40 disabled:pointer-events-none`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${hasActiveHint ? 'text-emerald-400 animate-spin' : 'text-amber-400'}`} style={hasActiveHint ? { animationDuration: '3s' } : undefined} />
            <span className="hidden sm:inline">{hasActiveHint ? 'Hint Active' : 'Hint'}</span>
          </button>
        )}
      </div>

      {/* Match Status & Quick Actions Bar */}
      <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-xl bg-[#100905]/80 border border-amber-950/50 text-xs">
        {/* Match Info Pill */}
        <div className="flex items-center gap-2">
          {skillMode === 'beginner' && (
            <span className="flex items-center gap-1 text-[10px] font-mono-code font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
              <Eye className="w-2.5 h-2.5" /> Beginner 800
            </span>
          )}
          {skillMode === 'intermediate' && (
            <span className="flex items-center gap-1 text-[10px] font-mono-code font-bold text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
              <Swords className="w-2.5 h-2.5" /> Club 1500
            </span>
          )}
          {skillMode === 'pro' && (
            <span className="flex items-center gap-1 text-[10px] font-mono-code font-bold text-purple-300 bg-purple-950/60 border border-purple-800/60 px-2 py-0.5 rounded-full">
              <Crown className="w-2.5 h-2.5" /> Pro 2400+ (Max)
            </span>
          )}

          {clockPreset !== 'casual' && (
            <span className="text-[10px] text-amber-200/60 font-mono-code uppercase">
              {clockPreset}
            </span>
          )}
        </div>

        {/* Secondary Actions: Setup/Lobby, FEN/PGN, Draw, Resign */}
        <div className="flex items-center gap-1">
          {onOpenLobby && (
            <button
              onClick={onOpenLobby}
              title="Open Match Setup & Settings"
              className="p-1.5 rounded-lg bg-[#24170f] border border-amber-900/40 text-amber-200/70 hover:text-amber-100 hover:bg-amber-900/30 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onOpenFenPgn}
            title="FEN / PGN Export & Import"
            className="p-1.5 rounded-lg bg-[#24170f] border border-amber-900/40 text-amber-200/70 hover:text-amber-100 hover:bg-amber-900/30 transition-colors"
          >
            <FileCode2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOfferDraw}
            title="Offer / Claim Draw"
            className="p-1.5 rounded-lg bg-[#24170f] border border-amber-900/40 text-amber-200/70 hover:text-amber-100 hover:bg-amber-900/30 transition-colors"
          >
            <Handshake className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onResign}
            title="Resign Game"
            className="p-1.5 rounded-lg bg-[#24170f] border border-amber-900/40 text-red-400/80 hover:text-red-300 hover:bg-red-950/40 transition-colors"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
