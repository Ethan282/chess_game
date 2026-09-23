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
  Play,
  X,
  Volume2,
  VolumeX,
  ShieldCheck,
  Shuffle,
  Eye,
  EyeOff,
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
  const [selectedMode, setSelectedMode] = useState<GameMode>(currentMode);
  const [selectedSkill, setSelectedSkill] = useState<SkillMode>(currentSkillMode);
  const [selectedClock, setSelectedClock] = useState<ClockPresetId>(currentClockPreset);
  const [selectedCamera] = useState<CameraView>(currentCameraView);
  const [selectedColor, setSelectedColor] = useState<PlayerColor | 'random'>(currentHumanColor);
  const [playerWhiteName, setPlayerWhiteName] = useState(initialPlayerNames.w || 'Player 1');
  const [playerBlackName, setPlayerBlackName] = useState(
    currentMode === 'ai' ? 'StockBot' : initialPlayerNames.b || 'Player 2'
  );

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#1d120a] via-[#140c07] to-[#0c0704] border border-amber-600/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_20px_rgba(245,158,11,0.2)] p-3.5 sm:p-4 text-stone-200 flex flex-col gap-2.5 overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-amber-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-950/70 border border-amber-400/40">
              <Crown className="w-4 h-4 text-stone-950" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-serif font-bold text-amber-100 tracking-wide flex items-center gap-2 leading-tight">
                Grandmaster 3D Chess
              </h1>
              <p className="text-[10px] text-amber-200/60 leading-tight">
                Configure your game settings and start playing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleSound}
              title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              className="p-1.5 rounded-lg bg-[#241710] border border-amber-900/50 hover:bg-amber-900/30 text-amber-300 transition-colors"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-amber-400/50" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            {isGameInProgress && (
              <button
                onClick={onClose}
                title="Close and return to current match"
                className="p-1.5 rounded-lg bg-[#241710] border border-amber-900/50 hover:bg-amber-900/30 text-amber-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Section 1: Game Mode (4 Compact Cards) */}
        <div>
          <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-amber-200/70 mb-1">
            Game Mode
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {/* Pass & Play */}
            <button
              type="button"
              onClick={() => handleModeChange('pass-and-play')}
              className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                selectedMode === 'pass-and-play'
                  ? 'bg-gradient-to-br from-amber-600/30 to-amber-950/50 border-amber-400 shadow-sm ring-1 ring-amber-400/60 text-amber-100'
                  : 'bg-[#180f0a] border-amber-950/60 hover:border-amber-700/50 hover:bg-[#20130d] text-amber-200/70'
              }`}
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-bold leading-tight">Pass & Play</span>
              <span className="text-[9px] text-amber-200/50">2 Players</span>
            </button>

            {/* Play vs AI */}
            <button
              type="button"
              onClick={() => handleModeChange('ai')}
              className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                selectedMode === 'ai'
                  ? 'bg-gradient-to-br from-amber-600/30 to-amber-950/50 border-amber-400 shadow-sm ring-1 ring-amber-400/60 text-amber-100'
                  : 'bg-[#180f0a] border-amber-950/60 hover:border-amber-700/50 hover:bg-[#20130d] text-amber-200/70'
              }`}
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-bold leading-tight">Play vs AI</span>
              <span className="text-[9px] text-amber-200/50">StockBot</span>
            </button>

            {/* Puzzles */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPuzzles();
              }}
              className="p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 bg-[#180f0a] border-amber-950/60 hover:border-emerald-700/50 hover:bg-[#20130d] text-amber-200/70 group"
            >
              <Trophy className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold leading-tight text-emerald-200">Puzzles</span>
              <span className="text-[9px] text-emerald-400/70">Trainer</span>
            </button>

            {/* Analysis Board */}
            <button
              type="button"
              onClick={() => handleModeChange('analysis')}
              className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                selectedMode === 'analysis'
                  ? 'bg-gradient-to-br from-amber-600/30 to-amber-950/50 border-amber-400 shadow-sm ring-1 ring-amber-400/60 text-amber-100'
                  : 'bg-[#180f0a] border-amber-950/60 hover:border-amber-700/50 hover:bg-[#20130d] text-amber-200/70'
              }`}
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-bold leading-tight">Analysis</span>
              <span className="text-[9px] text-amber-200/50">Sandbox</span>
            </button>
          </div>
        </div>

        {/* Section 2: Skill Level & Move Assist */}
        <div>
          <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-amber-200/70 mb-1">
            Skill Level & Move Assist
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {/* Beginner */}
            <button
              type="button"
              onClick={() => setSelectedSkill('beginner')}
              className={`p-2 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${
                selectedSkill === 'beginner'
                  ? 'bg-gradient-to-r from-emerald-950 to-teal-950 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500/50 shadow-sm'
                  : 'bg-[#180f0a] border-amber-950/60 text-amber-200/60 hover:text-amber-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="text-left">
                <span className="text-[11px] font-bold block leading-tight">Beginner</span>
                <span className="text-[9px] text-emerald-300/80 font-mono-code flex items-center gap-1">
                  800 ELO • <Eye className="w-2.5 h-2.5" /> Dots
                </span>
              </div>
            </button>

            {/* Intermediate */}
            <button
              type="button"
              onClick={() => setSelectedSkill('intermediate')}
              className={`p-2 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${
                selectedSkill === 'intermediate'
                  ? 'bg-gradient-to-r from-amber-900 to-amber-950 border-amber-400 text-amber-100 ring-1 ring-amber-400/50 shadow-sm'
                  : 'bg-[#180f0a] border-amber-950/60 text-amber-200/60 hover:text-amber-100'
              }`}
            >
              <Swords className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="text-left">
                <span className="text-[11px] font-bold block leading-tight">Intermediate</span>
                <span className="text-[9px] text-amber-300 font-mono-code flex items-center gap-1">
                  1500 ELO • <Eye className="w-2.5 h-2.5" /> Dots
                </span>
              </div>
            </button>

            {/* Pro Master */}
            <button
              type="button"
              onClick={() => setSelectedSkill('pro')}
              className={`p-2 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${
                selectedSkill === 'pro'
                  ? 'bg-gradient-to-r from-purple-950 via-[#1f102c] to-purple-950 border-purple-400 text-purple-100 ring-1 ring-purple-400/50 shadow-sm'
                  : 'bg-[#180f0a] border-amber-950/60 text-amber-200/60 hover:text-amber-100'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <div className="text-left">
                <span className="text-[11px] font-bold block leading-tight text-purple-100">Pro Master</span>
                <span className="text-[9px] text-purple-300 font-mono-code flex items-center gap-1">
                  2400+ Max • <EyeOff className="w-2.5 h-2.5" /> Blind
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Section 3: Player Names (Side-by-Side Compact) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-serif font-bold uppercase tracking-wider text-amber-200/70">
              Player Setup
            </span>
            <span className="text-[9px] text-amber-400/80 font-mono-code">
              {selectedMode === 'pass-and-play'
                ? 'Local 2 Players'
                : selectedMode === 'ai'
                  ? 'Human vs StockBot'
                  : 'Free Practice'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {/* Player 1 (White) */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#1a100a] border border-amber-900/50">
              <span className="w-5 h-5 rounded-full bg-[#f7efe1] border border-stone-300 flex items-center justify-center shrink-0 shadow text-[9px] font-bold text-stone-900">
                1
              </span>
              <div className="flex-1 min-w-0">
                <label className="block text-[8px] font-mono-code font-bold uppercase text-stone-400 tracking-wider">
                  White (1st Move)
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={playerWhiteName}
                  onChange={(e) => setPlayerWhiteName(e.target.value)}
                  placeholder="Player 1"
                  className="w-full bg-transparent text-xs font-bold text-amber-100 outline-none placeholder-amber-200/30 truncate"
                />
              </div>
            </div>

            {/* Player 2 (Black) */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#1a100a] border border-amber-900/50">
              <span className="w-5 h-5 rounded-full bg-[#20150e] border border-amber-700/60 flex items-center justify-center shrink-0 shadow text-[9px] font-bold text-amber-200">
                2
              </span>
              <div className="flex-1 min-w-0">
                <label className="block text-[8px] font-mono-code font-bold uppercase text-amber-400/60 tracking-wider">
                  {selectedMode === 'ai' ? 'StockBot (Black)' : 'Black (2nd Move)'}
                </label>
                <input
                  type="text"
                  maxLength={16}
                  disabled={selectedMode === 'ai'}
                  value={playerBlackName}
                  onChange={(e) => setPlayerBlackName(e.target.value)}
                  placeholder={selectedMode === 'ai' ? 'StockBot' : 'Player 2'}
                  className="w-full bg-transparent text-xs font-bold text-amber-100 outline-none placeholder-amber-200/30 truncate disabled:opacity-80"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Match Settings Grid (Time Control + Color Orientation Side-by-Side) */}
        <div className="grid grid-cols-2 gap-2">
          {/* Time Control */}
          <div className="p-2 rounded-xl bg-[#120a06]/90 border border-amber-950/70">
            <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-amber-200/70 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              Time Control
            </label>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setSelectedClock('casual')}
                className={`py-1 px-1 rounded-lg text-[10px] font-bold border transition-all text-center ${
                  selectedClock === 'casual'
                    ? 'bg-amber-600 text-stone-950 border-amber-400'
                    : 'bg-[#1a100a] border-amber-900/40 text-amber-200/60 hover:text-amber-100'
                }`}
              >
                Casual
              </button>
              <button
                type="button"
                onClick={() => setSelectedClock('blitz3')}
                className={`py-1 px-1 rounded-lg text-[10px] font-bold border transition-all text-center ${
                  selectedClock === 'blitz3'
                    ? 'bg-amber-600 text-stone-950 border-amber-400'
                    : 'bg-[#1a100a] border-amber-900/40 text-amber-200/60 hover:text-amber-100'
                }`}
              >
                3m Blitz
              </button>
              <button
                type="button"
                onClick={() => setSelectedClock('rapid10')}
                className={`py-1 px-1 rounded-lg text-[10px] font-bold border transition-all text-center ${
                  selectedClock === 'rapid10'
                    ? 'bg-amber-600 text-stone-950 border-amber-400'
                    : 'bg-[#1a100a] border-amber-900/40 text-amber-200/60 hover:text-amber-100'
                }`}
              >
                10m Rapid
              </button>
            </div>
          </div>

          {/* Play As / Color Orientation */}
          <div className="p-2 rounded-xl bg-[#120a06]/90 border border-amber-950/70">
            <label className="block text-[10px] font-serif font-bold uppercase tracking-wider text-amber-200/70 mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              Play As / Orientation
            </label>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setSelectedColor('w')}
                className={`py-1 px-1 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center gap-1 ${
                  selectedColor === 'w'
                    ? 'bg-[#f7efe1] text-stone-950 border-amber-400'
                    : 'bg-[#1a100a] border-amber-900/40 text-amber-200/60 hover:text-amber-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white border border-stone-400" />
                White
              </button>
              <button
                type="button"
                onClick={() => setSelectedColor('random')}
                className={`py-1 px-1 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center gap-1 ${
                  selectedColor === 'random'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 border-amber-400'
                    : 'bg-[#1a100a] border-amber-900/40 text-amber-200/60 hover:text-amber-100'
                }`}
              >
                <Shuffle className="w-2.5 h-2.5 text-amber-300" />
                Random
              </button>
              <button
                type="button"
                onClick={() => setSelectedColor('b')}
                className={`py-1 px-1 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center gap-1 ${
                  selectedColor === 'b'
                    ? 'bg-[#291b12] text-amber-100 border-amber-500'
                    : 'bg-[#1a100a] border-amber-900/40 text-amber-200/60 hover:text-amber-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#18120e] border border-stone-600" />
                Black
              </button>
            </div>
          </div>
        </div>

        {/* Section 5: Start Match Action Button */}
        <div className="flex items-center gap-2 pt-1 border-t border-amber-950/60 shrink-0">
          {isGameInProgress && (
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-3 rounded-xl bg-[#241710] border border-amber-700/60 hover:bg-[#321f15] text-amber-200 font-bold text-xs transition-all active:scale-95 shadow flex items-center justify-center gap-1.5"
            >
              <span>Back (Resume)</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleStart}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-stone-950" />
            <span>{isGameInProgress ? 'Start New Match' : 'Start Match Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
