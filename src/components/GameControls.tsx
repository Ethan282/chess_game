import React from 'react';
import { CameraView, BotDifficulty, ClockPresetId, GameMode, SkillMode, PlayerColor } from '../types/chess';
import {
  RotateCcw,
  Sparkles,
  Layers,
  ArrowUpDown,
  FileCode2,
  Flag,
  Handshake,
  Cpu,
  Swords,
  Crown,
  Eye,
  EyeOff,
  Play,
} from 'lucide-react';

interface GameControlsProps {
  mode: GameMode;
  skillMode: SkillMode;
  onChangeSkillMode: (skill: SkillMode) => void;
  cameraView: CameraView;
  onChangeCamera: (view: CameraView) => void;
  onFlipBoard: () => void;
  onUndo: () => void;
  onHint: () => void;
  onOpenFenPgn: () => void;
  onResign: () => void;
  onOfferDraw: () => void;
  canUndo: boolean;
  botDifficulty: BotDifficulty;
  onChangeDifficulty: (diff: BotDifficulty) => void;
  clockPreset: ClockPresetId;
  onChangeClock: (preset: ClockPresetId) => void;
  isAiThinking: boolean;
  isGameStarted: boolean;
  onStartMatch: (color?: PlayerColor) => void;
  humanColor: PlayerColor;
  onChangeHumanColor: (color: PlayerColor) => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  mode,
  skillMode,
  onChangeSkillMode,
  cameraView,
  onChangeCamera,
  onFlipBoard,
  onUndo,
  onHint,
  onOpenFenPgn,
  onResign,
  onOfferDraw,
  canUndo,
  botDifficulty,
  onChangeDifficulty,
  clockPreset,
  onChangeClock,
  isAiThinking,
  isGameStarted,
  onStartMatch,
  humanColor,
  onChangeHumanColor,
}) => {
  return (
    <div className="flex flex-col gap-3 p-3 rounded-2xl bg-[#19110b]/90 border border-amber-900/40 shadow-xl">
      {/* Start Match / Active Match Card */}
      {!isGameStarted ? (
        <div className="flex flex-col gap-2.5 p-3 rounded-xl bg-gradient-to-b from-[#25170e] to-[#150d07] border border-amber-500/70 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-amber-100 text-xs tracking-wide">
              Match Setup
            </span>
            <span className="text-[10px] font-mono-code font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/60">
              Ready to Play
            </span>
          </div>

          {/* Color Selection */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-amber-200/70">Play As:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeHumanColor('w')}
                className={`flex items-center justify-center gap-2 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                  humanColor === 'w'
                    ? 'bg-[#f7efe1] text-stone-950 border-amber-400 shadow-md font-bold'
                    : 'bg-[#1e130c] text-amber-200/70 border-amber-900/40 hover:text-amber-100'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-white border border-stone-400" />
                <span>White (1st)</span>
              </button>

              <button
                onClick={() => onChangeHumanColor('b')}
                className={`flex items-center justify-center gap-2 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                  humanColor === 'b'
                    ? 'bg-[#2e2118] text-amber-100 border-amber-500 shadow-md font-bold'
                    : 'bg-[#1e130c] text-amber-200/70 border-amber-900/40 hover:text-amber-100'
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-[#18120e] border border-stone-600" />
                <span>Black (2nd)</span>
              </button>
            </div>
          </div>

          {/* Primary Start Match Button */}
          <button
            onClick={() => onStartMatch(humanColor)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-[0_0_16px_rgba(245,158,11,0.4)] transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-stone-950" />
            <span>Start Match</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#22150e]/90 border border-emerald-700/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-200">
              Match In Progress
            </span>
          </div>
          <button
            onClick={onUndo}
            disabled={!canUndo || isAiThinking}
            className="text-xs text-amber-300 hover:text-amber-100 font-semibold px-2 py-1 rounded bg-[#180f0a] border border-amber-900/60 disabled:opacity-40"
          >
            Takeback
          </button>
        </div>
      )}

      {/* Primary Action Row: Camera View, Flip, Undo, Hint */}
      <div className="grid grid-cols-4 gap-2">
        {/* Camera Perspective Dropdown/Toggle */}
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
                cameraView === '3d-angled' ? 'bg-amber-600/40 text-amber-100 font-semibold' : 'text-amber-200/70 hover:bg-amber-900/30 hover:text-amber-100'
              }`}
            >
              3D Angled
            </button>
            <button
              onClick={() => onChangeCamera('3d-front')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                cameraView === '3d-front' ? 'bg-amber-600/40 text-amber-100 font-semibold' : 'text-amber-200/70 hover:bg-amber-900/30 hover:text-amber-100'
              }`}
            >
              3D Front
            </button>
            <button
              onClick={() => onChangeCamera('2d-flat')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                cameraView === '2d-flat' ? 'bg-amber-600/40 text-amber-100 font-semibold' : 'text-amber-200/70 hover:bg-amber-900/30 hover:text-amber-100'
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

        {/* Move Hint */}
        <button
          onClick={onHint}
          disabled={isAiThinking}
          title="Calculate best tactical move"
          className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#24170f] border border-amber-900/50 hover:border-amber-600/60 hover:bg-[#301e13] disabled:opacity-40 disabled:pointer-events-none text-amber-200/90 text-xs font-medium transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Hint</span>
        </button>
      </div>

      {/* 3 Game Modes: Beginner, Intermediate, Pro */}
      <div className="flex flex-col gap-2 p-2.5 rounded-xl bg-[#120a06]/90 border border-amber-950/70">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-100 flex items-center gap-1.5 font-serif">
            Skill Mode
          </span>
          {skillMode === 'pro' ? (
            <span className="flex items-center gap-1 text-[10px] font-mono-code font-bold text-purple-300 bg-purple-950/80 border border-purple-700/50 px-2 py-0.5 rounded-full">
              <EyeOff className="w-3 h-3 text-purple-400" />
              Blind Vision (No Dots)
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-mono-code font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/50 px-2 py-0.5 rounded-full">
              <Eye className="w-3 h-3 text-emerald-400" />
              Move Points Active
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {/* Beginner */}
          <button
            onClick={() => onChangeSkillMode('beginner')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg text-center transition-all ${
              skillMode === 'beginner'
                ? 'bg-gradient-to-b from-emerald-900/80 to-emerald-950/90 border border-emerald-500/80 shadow-md shadow-emerald-950/50 text-emerald-100'
                : 'bg-[#1e130c] border border-amber-950/60 text-amber-200/60 hover:text-amber-100 hover:bg-[#281810]'
            }`}
          >
            <Sparkles className={`w-4 h-4 mb-1 ${skillMode === 'beginner' ? 'text-emerald-300' : 'text-amber-400/60'}`} />
            <span className="text-xs font-bold leading-tight">Beginner</span>
            <span className="text-[9px] text-amber-200/50 mt-0.5">800 ELO</span>
          </button>

          {/* Intermediate */}
          <button
            onClick={() => onChangeSkillMode('intermediate')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg text-center transition-all ${
              skillMode === 'intermediate'
                ? 'bg-gradient-to-b from-amber-700/70 to-amber-900/90 border border-amber-400/80 shadow-md shadow-amber-950/50 text-amber-100'
                : 'bg-[#1e130c] border border-amber-950/60 text-amber-200/60 hover:text-amber-100 hover:bg-[#281810]'
            }`}
          >
            <Swords className={`w-4 h-4 mb-1 ${skillMode === 'intermediate' ? 'text-amber-300' : 'text-amber-400/60'}`} />
            <span className="text-xs font-bold leading-tight">Intermediate</span>
            <span className="text-[9px] text-amber-200/50 mt-0.5">1500 ELO</span>
          </button>

          {/* Pro */}
          <button
            onClick={() => onChangeSkillMode('pro')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg text-center transition-all ${
              skillMode === 'pro'
                ? 'bg-gradient-to-b from-purple-800/80 to-indigo-950/90 border border-purple-400/80 shadow-md shadow-purple-950/50 text-purple-100'
                : 'bg-[#1e130c] border border-amber-950/60 text-amber-200/60 hover:text-amber-100 hover:bg-[#281810]'
            }`}
          >
            <Crown className={`w-4 h-4 mb-1 ${skillMode === 'pro' ? 'text-yellow-300' : 'text-amber-400/60'}`} />
            <span className="text-xs font-bold leading-tight">Pro</span>
            <span className="text-[9px] text-amber-200/50 mt-0.5">2200+ ELO</span>
          </button>
        </div>

        <p className="text-[11px] text-amber-200/65 italic px-0.5 text-center leading-snug">
          {skillMode === 'beginner' && '🌟 Click any piece to see all legal move points on the board. Relaxed AI.'}
          {skillMode === 'intermediate' && '⚔️ Click any piece to see all legal move points on the board. Club AI.'}
          {skillMode === 'pro' && '👑 Grandmaster blind vision: No move points shown. Master AI.'}
        </p>
      </div>

      {/* Mode Specific Settings Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-950/40 text-xs">
        {/* If in AI mode: Difficulty selector */}
        {mode === 'ai' && (
          <div className="flex items-center gap-1.5">
            <span className="text-amber-200/60 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-amber-500" />
              Bot:
            </span>
            <select
              value={botDifficulty}
              onChange={(e) => onChangeDifficulty(e.target.value as BotDifficulty)}
              disabled={isAiThinking}
              aria-label="Bot difficulty"
              className="bg-[#24170f] border border-amber-900/60 rounded-lg px-2 py-1 text-amber-100 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="novice">Novice (~800)</option>
              <option value="intermediate">Intermediate (~1400)</option>
              <option value="club">Club (~1800)</option>
              <option value="master">Master (~2200)</option>
            </select>
          </div>
        )}

        {/* Clock Preset Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-amber-200/60">Clock:</span>
          <select
            value={clockPreset}
            onChange={(e) => onChangeClock(e.target.value as ClockPresetId)}
            aria-label="Clock preset"
            className="bg-[#24170f] border border-amber-900/60 rounded-lg px-2 py-1 text-amber-100 font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="casual">Casual (No Timer)</option>
            <option value="bullet1">1 min (Bullet)</option>
            <option value="blitz3">3 min (Blitz)</option>
            <option value="blitz5_3">5 | 3 (Blitz)</option>
            <option value="rapid10">10 min (Rapid)</option>
            <option value="classical15_10">15 | 10 (Classical)</option>
          </select>
        </div>

        {/* Secondary Actions: FEN/PGN, Resign, Draw */}
        <div className="flex items-center gap-1 ml-auto">
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
