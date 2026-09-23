import React from 'react';
import { GameMode, SkillMode } from '../types/chess';
import { Volume2, VolumeX, RotateCcw, Sparkles, Swords, Crown } from 'lucide-react';

interface TopNavbarProps {
  mode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  skillMode: SkillMode;
  onSelectSkillMode: (skill: SkillMode) => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onNewGame: () => void;
  onOpenPuzzles: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  mode,
  onSelectMode,
  skillMode,
  onSelectSkillMode,
  isMuted,
  onToggleSound,
  onNewGame,
  onOpenPuzzles,
}) => {
  return (
    <header className="w-full flex flex-wrap items-center justify-between gap-3 px-4 md:px-8 py-2.5 md:py-3 border-b border-amber-950/60 bg-[#140e0a]/95 backdrop-blur-md sticky top-0 z-30 shadow-lg">
      {/* Zone 1: Wordmark & Logo */}
      <div className="flex items-center gap-3">
        <a href="/" className="text-lg md:text-xl font-serif font-bold tracking-tight text-amber-100 hover:text-amber-200 transition-colors shrink-0 flex items-center gap-2">
          <span>Grandmaster 3D</span>
        </a>
      </div>

      {/* Zone 2: The 3 Core Game Modes: Beginner, Intermediate, Pro */}
      <div className="flex items-center p-1 rounded-xl bg-[#0c0805]/90 border border-amber-900/60 shadow-inner">
        <button
          onClick={() => onSelectSkillMode('beginner')}
          title="Beginner Mode: Move points visible on piece click • Casual AI (~800 ELO)"
          className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            skillMode === 'beginner'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-950/60 scale-[1.02]'
              : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-950/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>Beginner</span>
        </button>

        <button
          onClick={() => onSelectSkillMode('intermediate')}
          title="Intermediate Mode: Move points visible on piece click • Club AI (~1500 ELO)"
          className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            skillMode === 'intermediate'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 font-bold shadow-md shadow-amber-950/60 scale-[1.02]'
              : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-950/40'
          }`}
        >
          <Swords className="w-3.5 h-3.5 text-amber-300" />
          <span>Intermediate</span>
        </button>

        <button
          onClick={() => onSelectSkillMode('pro')}
          title="Pro Mode: Grandmaster Blind Vision (No Move Points) • Master AI (~2200+ ELO)"
          className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            skillMode === 'pro'
              ? 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-md shadow-purple-950/60 scale-[1.02]'
              : 'text-amber-200/70 hover:text-amber-100 hover:bg-amber-950/40'
          }`}
        >
          <Crown className="w-3.5 h-3.5 text-yellow-300" />
          <span>Pro</span>
        </button>
      </div>

      {/* Zone 3: Play Format Links & Actions */}
      <div className="flex items-center gap-3">
        <nav className="hidden lg:flex items-center gap-4 text-xs font-medium text-amber-200/60">
          <button
            onClick={() => onSelectMode('ai')}
            className={`hover:text-amber-100 transition-colors py-1 ${
              mode === 'ai' ? 'text-amber-300 font-semibold' : ''
            }`}
          >
            vs AI
          </button>
          <button
            onClick={() => onSelectMode('pass-and-play')}
            className={`hover:text-amber-100 transition-colors py-1 ${
              mode === 'pass-and-play' ? 'text-amber-300 font-semibold' : ''
            }`}
          >
            Pass & Play
          </button>
          <button
            onClick={onOpenPuzzles}
            className={`hover:text-amber-100 transition-colors py-1 ${
              mode === 'puzzle' ? 'text-amber-300 font-semibold' : ''
            }`}
          >
            Puzzles
          </button>
          <button
            onClick={() => onSelectMode('analysis')}
            className={`hover:text-amber-100 transition-colors py-1 ${
              mode === 'analysis' ? 'text-amber-300 font-semibold' : ''
            }`}
          >
            Analysis
          </button>
        </nav>

        {/* Sound toggle button */}
        <button
          onClick={onToggleSound}
          title={isMuted ? 'Unmute game sounds' : 'Mute game sounds'}
          className="p-2 rounded-lg bg-[#21150e] border border-amber-900/40 text-amber-200/80 hover:text-amber-100 hover:bg-amber-950/60 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-amber-400/60" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>

        {/* New Game Button */}
        <button
          onClick={onNewGame}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-lg shadow-md transition-all whitespace-nowrap active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Game</span>
        </button>
      </div>
    </header>
  );
};
