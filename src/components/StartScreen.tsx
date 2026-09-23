import React, { useState } from 'react';
import {
  GameMode,
  SkillMode,
  ClockPresetId,
  CameraView,
  PlayerColor,
  BotDifficulty,
} from '../types/chess';
import {
  Users,
  Bot,
  Trophy,
  Search,
  Sparkles,
  Swords,
  Crown,
  Clock,
  Layers,
  Play,
  RotateCcw,
  X,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Shuffle,
  Eye,
  EyeOff,
  User,
} from 'lucide-react';

interface StartScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMatch: (config: {
    mode: GameMode;
    skillMode: SkillMode;
    clockPreset: ClockPresetId;
    cameraView: CameraView;
    humanColor: PlayerColor;
    playerNames: { w: string; b: string };
    botDifficulty: BotDifficulty;
  }) => void;
  isGameInProgress: boolean;
  currentMode: GameMode;
  currentSkillMode: SkillMode;
  currentClockPreset: ClockPresetId;
  currentCameraView: CameraView;
  currentHumanColor: PlayerColor;
  initialPlayerNames?: { w: string; b: string };
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenPuzzles: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  isOpen,
  onClose,
  onStartMatch,
  isGameInProgress,
  currentMode,
  currentSkillMode,
  currentClockPreset,
  currentCameraView,
  currentHumanColor,
  initialPlayerNames = { w: 'Player 1', b: 'Player 2' },
  isMuted,
  onToggleSound,
  onOpenPuzzles,
}) => {
  // Local state for draft configuration
  const [selectedMode, setSelectedMode] = useState<GameMode>(currentMode);
  const [selectedSkill, setSelectedSkill] = useState<SkillMode>(currentSkillMode);
  const [selectedClock, setSelectedClock] = useState<ClockPresetId>(currentClockPreset);
  const [selectedCamera, setSelectedCamera] = useState<CameraView>(currentCameraView);
  const [selectedColor, setSelectedColor] = useState<PlayerColor | 'random'>(currentHumanColor);
  const [playerWhiteName, setPlayerWhiteName] = useState(initialPlayerNames.w || 'Player 1');
  const [playerBlackName, setPlayerBlackName] = useState(
    currentMode === 'ai' ? 'StockBot' : initialPlayerNames.b || 'Player 2'
  );
  const [showRules, setShowRules] = useState(false);

  if (!isOpen) return null;

  const handleModeChange = (mode: GameMode) => {
    setSelectedMode(mode);
    if (mode === 'ai') {
      if (playerWhiteName === 'Player 1') setPlayerWhiteName('You');
      setPlayerBlackName('StockBot');
    } else if (mode === 'pass-and-play') {
      if (playerWhiteName === 'You') setPlayerWhiteName('Player 1');
      if (playerBlackName === 'StockBot') setPlayerBlackName('Player 2');
    }
  };

  const handleStart = () => {
    let finalColor: PlayerColor = 'w';
    if (selectedColor === 'random') {
      finalColor = Math.random() < 0.5 ? 'w' : 'b';
    } else {
      finalColor = selectedColor;
    }

    const botDiff: BotDifficulty =
      selectedSkill === 'beginner'
        ? 'novice'
        : selectedSkill === 'intermediate'
          ? 'intermediate'
          : 'master';

    onStartMatch({
      mode: selectedMode,
      skillMode: selectedSkill,
      clockPreset: selectedClock,
      cameraView: selectedCamera,
      humanColor: finalColor,
      playerNames: {
        w: playerWhiteName.trim() || 'Player 1',
        b: playerBlackName.trim() || (selectedMode === 'ai' ? 'StockBot' : 'Player 2'),
      },
      botDifficulty: botDiff,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#1f140e] via-[#160d08] to-[#100905] border border-amber-600/40 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_25px_rgba(245,158,11,0.2)] p-4 sm:p-6 text-stone-200 my-auto max-h-[92vh] flex flex-col justify-between overflow-y-auto custom-scrollbar">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-950/70 border border-amber-400/40">
              <Crown className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-amber-100 tracking-wide flex items-center gap-2">
                Grandmaster 3D Chess
              </h1>
              <p className="text-xs text-amber-200/60">
                Configure your players & parlor settings to begin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSound}
              title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              className="p-2 rounded-xl bg-[#241710] border border-amber-900/50 hover:bg-amber-900/30 text-amber-300 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-amber-400/50" /> : <Volume2 className="w-4 h-4" />}
            </button>
            {isGameInProgress && (
              <button
                onClick={onClose}
                title="Close and return to current match"
                className="p-2 rounded-xl bg-[#241710] border border-amber-900/50 hover:bg-amber-900/30 text-amber-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Section 1: Game Mode Cards (Pass & Play, vs AI, Puzzles, Analysis) */}
        <div className="mb-4">
          <label className="block text-xs font-serif font-bold uppercase tracking-wider text-amber-200/70 mb-2">
            Select Game Mode
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Pass & Play */}
            <button
              type="button"
              onClick={() => handleModeChange('pass-and-play')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${selectedMode === 'pass-and-play'
                ? 'bg-gradient-to-br from-amber-600/30 via-amber-700/20 to-amber-950/40 border-amber-400/90 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/60'
                : 'bg-[#1a100a]/80 border-amber-950/50 hover:border-amber-700/50 hover:bg-[#23160e]/80'
                }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Users className={`w-5 h-5 ${selectedMode === 'pass-and-play' ? 'text-amber-400' : 'text-amber-300/60'}`} />
                {selectedMode === 'pass-and-play' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-amber-100 block">Pass & Play</span>
                <span className="text-[10px] text-amber-200/50 line-clamp-1">Local 2-Player</span>
              </div>
            </button>

            {/* Play vs AI */}
            <button
              type="button"
              onClick={() => handleModeChange('ai')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${selectedMode === 'ai'
                ? 'bg-gradient-to-br from-amber-600/30 via-amber-700/20 to-amber-950/40 border-amber-400/90 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/60'
                : 'bg-[#1a100a]/80 border-amber-950/50 hover:border-amber-700/50 hover:bg-[#23160e]/80'
                }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Bot className={`w-5 h-5 ${selectedMode === 'ai' ? 'text-amber-400' : 'text-amber-300/60'}`} />
                {selectedMode === 'ai' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-amber-100 block">Play vs AI</span>
                <span className="text-[10px] text-amber-200/50 line-clamp-1">StockBot Engine</span>
              </div>
            </button>

            {/* Puzzles */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPuzzles();
              }}
              className="p-3 rounded-2xl border text-left transition-all flex flex-col justify-between bg-[#1a100a]/80 border-amber-950/50 hover:border-amber-700/50 hover:bg-[#23160e]/80 group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <Trophy className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-mono-code font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/60">Trainer</span>
              </div>
              <div>
                <span className="text-xs font-bold text-amber-100 block">Puzzles</span>
                <span className="text-[10px] text-amber-200/50 line-clamp-1">Tactics Trainer</span>
              </div>
            </button>

            {/* Analysis Board */}
            <button
              type="button"
              onClick={() => handleModeChange('analysis')}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${selectedMode === 'analysis'
                ? 'bg-gradient-to-br from-amber-600/30 via-amber-700/20 to-amber-950/40 border-amber-400/90 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/60'
                : 'bg-[#1a100a]/80 border-amber-950/50 hover:border-amber-700/50 hover:bg-[#23160e]/80'
                }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Search className={`w-5 h-5 ${selectedMode === 'analysis' ? 'text-amber-400' : 'text-amber-300/60'}`} />
                {selectedMode === 'analysis' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-amber-100 block">Analysis</span>
                <span className="text-[10px] text-amber-200/50 line-clamp-1">Sandbox Board</span>
              </div>
            </button>
          </div>
        </div>

        {/* Section 2: Skill Level (Beginner / Intermediate / Pro) */}
        <div className="mb-4">
          <label className="block text-xs font-serif font-bold uppercase tracking-wider text-amber-200/70 mb-2">
            Skill Level & Move Assist
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Beginner */}
            <button
              type="button"
              onClick={() => setSelectedSkill('beginner')}
              className={`p-2.5 rounded-xl border text-center transition-all ${selectedSkill === 'beginner'
                ? 'bg-gradient-to-b from-emerald-900/80 to-emerald-950 border-emerald-500 shadow-md text-emerald-100 ring-2 ring-emerald-500/40'
                : 'bg-[#180f0a] border-amber-950/60 text-amber-200/60 hover:text-amber-100'
                }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold">Beginner</span>
              </div>
              <span className="text-[10px] text-emerald-300/80 font-mono-code block">800 ELO</span>
              <span className="text-[9px] text-emerald-200/60 flex items-center justify-center gap-1 mt-0.5">
                <Eye className="w-2.5 h-2.5" /> Move Dots ON
              </span>
            </button>

            {/* Intermediate */}
            <button
              type="button"
              onClick={() => setSelectedSkill('intermediate')}
              className={`p-2.5 rounded-xl border text-center transition-all ${selectedSkill === 'intermediate'
                ? 'bg-gradient-to-b from-amber-700/70 to-amber-900 border-amber-400 shadow-md text-amber-100 ring-2 ring-amber-400/40'
                : 'bg-[#180f0a] border-amber-950/60 text-amber-200/60 hover:text-amber-100'
                }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Swords className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">Intermediate</span>
              </div>
              <span className="text-[10px] text-amber-300/80 font-mono-code block">1500 ELO</span>
              <span className="text-[9px] text-amber-200/60 flex items-center justify-center gap-1 mt-0.5">
                <Eye className="w-2.5 h-2.5" /> Move Dots ON
              </span>
            </button>

            {/* Pro */}
            <button
              type="button"
              onClick={() => setSelectedSkill('pro')}
              className={`p-2.5 rounded-xl border text-center transition-all ${selectedSkill === 'pro'
                ? 'bg-gradient-to-b from-purple-800/80 to-purple-950 border-purple-400 shadow-md text-purple-100 ring-2 ring-purple-400/40'
                : 'bg-[#180f0a] border-amber-950/60 text-amber-200/60 hover:text-amber-100'
                }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Crown className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold">Pro Master</span>
              </div>
              <span className="text-[10px] text-purple-300 font-mono-code font-bold block">2400+ ELO (Most Difficult)</span>
              <span className="text-[9px] text-purple-200/60 flex items-center justify-center gap-1 mt-0.5">
                <EyeOff className="w-2.5 h-2.5" /> Blind Vision (No Dots / Highlights)
              </span>
            </button>
          </div>
        </div>

        {/* Section 3: Player Rows (Inspired by Ludo App Setup) */}
        <div className="mb-4 p-3 rounded-2xl bg-[#120a06]/90 border border-amber-950/70">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-serif font-bold uppercase tracking-wider text-amber-200/70">
              Player Setup
            </span>
            <span className="text-[10px] text-amber-400/80 font-mono-code">
              {selectedMode === 'pass-and-play'
                ? 'Local 2 Players'
                : selectedMode === 'ai'
                  ? 'Human vs StockBot'
                  : 'Free Practice'}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Player 1 (White) */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1d120a] border border-amber-900/50">
              <div className="w-8 h-8 rounded-xl bg-[#f7efe1] border border-stone-300 flex items-center justify-center shrink-0 shadow">
                <User className="w-4 h-4 text-stone-800" />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-mono-code font-bold uppercase tracking-wider text-stone-400">
                  Player 1 (White - Moves First)
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={playerWhiteName}
                  onChange={(e) => setPlayerWhiteName(e.target.value)}
                  placeholder="Player 1"
                  className="w-full bg-transparent text-xs font-bold text-amber-100 outline-none placeholder-amber-200/30 focus:border-b focus:border-amber-400"
                />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-semibold bg-stone-200/10 text-stone-300 border border-stone-600/40">
                1st Move
              </span>
            </div>

            {/* Player 2 (Black) */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1d120a] border border-amber-900/50">
              <div className="w-8 h-8 rounded-xl bg-[#241710] border border-amber-800/80 flex items-center justify-center shrink-0 shadow">
                {selectedMode === 'ai' ? (
                  <Bot className="w-4 h-4 text-amber-400" />
                ) : (
                  <User className="w-4 h-4 text-amber-200/80" />
                )}
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-mono-code font-bold uppercase tracking-wider text-amber-400/60">
                  {selectedMode === 'ai' ? 'StockBot Engine (Black)' : 'Player 2 (Black)'}
                </label>
                <input
                  type="text"
                  maxLength={16}
                  disabled={selectedMode === 'ai'}
                  value={playerBlackName}
                  onChange={(e) => setPlayerBlackName(e.target.value)}
                  placeholder={selectedMode === 'ai' ? 'StockBot' : 'Player 2'}
                  className="w-full bg-transparent text-xs font-bold text-amber-100 outline-none placeholder-amber-200/30 disabled:opacity-80"
                />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/60">
                2nd Move
              </span>
            </div>
          </div>
        </div>



        {/* Section 4: Time Control & Board Orientation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Time Control */}
          <div className="p-3 rounded-2xl bg-[#120a06]/90 border border-amber-950/70">
            <label className="block text-[11px] font-serif font-bold uppercase tracking-wider text-amber-200/70 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Time Control
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedClock('casual')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${selectedClock === 'casual'
                  ? 'bg-amber-600 text-stone-950 border-amber-400 font-bold'
                  : 'bg-[#1d120a] border-amber-900/40 text-amber-200/60 hover:text-amber-100'
                  }`}
              >
                Casual (No Clock)
              </button>
              <button
                type="button"
                onClick={() => setSelectedClock('blitz3')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${selectedClock === 'blitz3'
                  ? 'bg-amber-600 text-stone-950 border-amber-400 font-bold'
                  : 'bg-[#1d120a] border-amber-900/40 text-amber-200/60 hover:text-amber-100'
                  }`}
              >
                3m Blitz
              </button>
              <button
                type="button"
                onClick={() => setSelectedClock('rapid10')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${selectedClock === 'rapid10'
                  ? 'bg-amber-600 text-stone-950 border-amber-400 font-bold'
                  : 'bg-[#1d120a] border-amber-900/40 text-amber-200/60 hover:text-amber-100'
                  }`}
              >
                10m Rapid
              </button>
            </div>
          </div>

          {/* Play As / Orientation (White, Black, Random) */}
          <div className="p-3 rounded-2xl bg-[#120a06]/90 border border-amber-950/70">
            <label className="block text-[11px] font-serif font-bold uppercase tracking-wider text-amber-200/70 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Play As / Orientation
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedColor('w')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${selectedColor === 'w'
                  ? 'bg-[#f7efe1] text-stone-950 border-amber-400 font-bold'
                  : 'bg-[#1d120a] border-amber-900/40 text-amber-200/60 hover:text-amber-100'
                  }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white border border-stone-400" />
                White
              </button>
              <button
                type="button"
                onClick={() => setSelectedColor('random')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${selectedColor === 'random'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 border-amber-400 font-bold'
                  : 'bg-[#1d120a] border-amber-900/40 text-amber-200/60 hover:text-amber-100'
                  }`}
              >
                <Shuffle className="w-3 h-3 text-amber-300" />
                Random
              </button>
              <button
                type="button"
                onClick={() => setSelectedColor('b')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${selectedColor === 'b'
                  ? 'bg-[#291b12] text-amber-100 border-amber-500 font-bold'
                  : 'bg-[#1d120a] border-amber-900/40 text-amber-200/60 hover:text-amber-100'
                  }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#18120e] border border-stone-600" />
                Black
              </button>
            </div>
          </div>
        </div>

        {/* Section 5: Collapsible Rules / Guide Drawer (Like Ludo's <details>) */}
        <div className="mb-4 rounded-xl border border-amber-950/60 bg-[#120a06]/60 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowRules(!showRules)}
            className="w-full flex items-center justify-between p-2.5 text-xs font-medium text-amber-200/70 hover:text-amber-100 hover:bg-amber-950/30 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>How to Play & FIDE Rules Overview</span>
            </span>
            {showRules ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {showRules && (
            <div className="p-3 border-t border-amber-950/60 text-[11px] text-amber-200/70 space-y-1.5 bg-[#0e0704]/80">
              <p>• <strong>White moves first</strong>, then players alternate turns.</p>
              <p>• <strong>Click a piece</strong> to illuminate legal destination points (Beginner & Intermediate modes).</p>
              <p>• <strong>Castling</strong>: Move King 2 squares towards Rook when path is clear and unattacked.</p>
              <p>• <strong>En Passant</strong>: Pawns moving 2 squares can be captured immediately on the next turn.</p>
              <p>• <strong>Promotion</strong>: Pawns reaching the 8th rank promote to Queen, Rook, Bishop, or Knight.</p>
              <p>• <strong>Active Turn Highlighting</strong>: Player 1 and Player 2 cards glow with gold rings when it is their turn to move.</p>
            </div>
          )}
        </div>

        {/* Section 6: Action Buttons (Start Game / Resume Game) */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-amber-950/60">
          {isGameInProgress && (
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#241710] border border-amber-700/60 hover:bg-[#321f15] text-amber-200 font-bold text-sm transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              <span>Back to Game (Resume)</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleStart}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-stone-950" />
            <span>{isGameInProgress ? 'Start New Match' : 'Start Match Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
