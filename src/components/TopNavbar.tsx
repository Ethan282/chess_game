import React from 'react';
import { GameMode, SkillMode } from '../types/chess';
import { Volume2, VolumeX, RotateCcw, Sparkles, Swords, Crown, LayoutGrid, Menu, X } from 'lucide-react';

interface TopNavbarProps {
  mode: GameMode;
  onSelectMode?: (mode: GameMode) => void;
  skillMode: SkillMode;
  onSelectSkillMode?: (skill: SkillMode) => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onNewGame: () => void;
  onOpenPuzzles: () => void;
  onOpenLobby: () => void;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  moveCount?: number;
  onUndo?: () => void;
  canUndo?: boolean;
  onHint?: () => void;
  hasActiveHint?: boolean;
  isAiThinking?: boolean;
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
  onOpenLobby,
  isMobileMenuOpen = false,
  onToggleMobileMenu,
  moveCount = 0,
  onUndo,
  canUndo = false,
  onHint,
  hasActiveHint = false,
  isAiThinking = false,
}) => {
  return (
    <header className="w-full flex items-center justify-between gap-2 px-3 sm:px-6 py-1.5 sm:py-2 border-b border-amber-950/60 bg-[#140e0a]/95 backdrop-blur-md shrink-0 z-30 shadow-lg">
      {/* Zone 1: Wordmark & Logo */}
      <div className="flex items-center gap-3">
        <a href="/" className="text-lg md:text-xl font-serif font-bold tracking-tight text-amber-100 hover:text-amber-200 transition-colors shrink-0 flex items-center gap-2">
          <span>Grandmaster 3D</span>
        </a>
      </div>

      {/* Zone 2: Chosen Mode Indicator (Locked to Starting Page Selection) */}
      <div className="flex items-center">
        {skillMode === 'beginner' && (
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/90 to-teal-950/80 border border-emerald-500/60 shadow-md text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-emerald-100">Beginner</span>
            <span className="text-[10px] font-mono-code text-emerald-400/90 bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-700/50">
              800 ELO
            </span>
            {mode === 'ai' && (
              <span className="hidden sm:inline-block text-[10px] text-emerald-300/80 border-l border-emerald-800/60 pl-2">
                vs AI
              </span>
            )}
            {mode === 'pass-and-play' && (
              <span className="hidden sm:inline-block text-[10px] text-emerald-300/80 border-l border-emerald-800/60 pl-2">
                Pass & Play
              </span>
            )}
          </div>
        )}

        {skillMode === 'intermediate' && (
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/90 to-[#27170c] border border-amber-500/60 shadow-md text-amber-200 text-xs font-semibold">
            <Swords className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-amber-100">Intermediate</span>
            <span className="text-[10px] font-mono-code text-amber-300 bg-amber-900/60 px-1.5 py-0.5 rounded border border-amber-700/60">
              1500 ELO
            </span>
            {mode === 'ai' && (
              <span className="hidden sm:inline-block text-[10px] text-amber-300/80 border-l border-amber-800/60 pl-2">
                vs AI
              </span>
            )}
            {mode === 'pass-and-play' && (
              <span className="hidden sm:inline-block text-[10px] text-amber-300/80 border-l border-amber-800/60 pl-2">
                Pass & Play
              </span>
            )}
          </div>
        )}

        {skillMode === 'pro' && (
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-950/90 via-[#20102b] to-purple-950/90 border border-purple-500/60 shadow-md text-purple-200 text-xs font-semibold">
            <Crown className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-bold text-purple-100">Pro Master</span>
            <span className="text-[10px] font-mono-code text-purple-300 bg-purple-900/60 px-1.5 py-0.5 rounded border border-purple-700/60">
              2400+ ELO
            </span>
            {mode === 'ai' && (
              <span className="hidden sm:inline-block text-[10px] text-purple-300/80 border-l border-purple-800/60 pl-2">
                vs AI
              </span>
            )}
            {mode === 'pass-and-play' && (
              <span className="hidden sm:inline-block text-[10px] text-purple-300/80 border-l border-purple-800/60 pl-2">
                Pass & Play
              </span>
            )}
          </div>
        )}
      </div>

      {/* Zone 3: Play Format Links & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Lobby / Setup Button */}
        <button
          onClick={onOpenLobby}
          title="Open Match Lobby & Player Setup"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21150e] border border-amber-800/60 hover:bg-[#301d14] hover:border-amber-500/70 text-amber-200 text-xs font-semibold shadow transition-all active:scale-95"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
          <span>Lobby</span>
        </button>

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

        {/* Mobile View Quick Action: Undo Button */}
        {onUndo && (
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo last move"
            className="xl:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#21150e] border border-amber-900/60 hover:border-amber-600/70 hover:bg-[#301d14] disabled:opacity-40 disabled:pointer-events-none text-amber-200 text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Undo</span>
          </button>
        )}

        {/* Mobile View Quick Action: Hint Button (Hidden in Pro mode) */}
        {onHint && skillMode !== 'pro' && (
          <button
            onClick={onHint}
            disabled={isAiThinking}
            title={hasActiveHint ? "Clear tactical hint" : "Get instant tactical hint"}
            className={`xl:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition-all active:scale-95 ${
              hasActiveHint
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 ring-1 ring-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'bg-[#21150e] border-amber-900/60 hover:border-amber-600/70 hover:bg-[#301d14] text-amber-200'
            } disabled:opacity-40 disabled:pointer-events-none`}
          >
            <Sparkles
              className={`w-3.5 h-3.5 ${hasActiveHint ? 'text-emerald-400 animate-spin' : 'text-amber-400'}`}
              style={hasActiveHint ? { animationDuration: '3s' } : undefined}
            />
            <span>{hasActiveHint ? 'Active' : 'Hint'}</span>
          </button>
        )}

        {/* Mobile Hamburger Menu Icon: opens controls & move history from right */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            title={isMobileMenuOpen ? 'Close Controls & Move History' : 'Open Controls & Move History'}
            aria-label="Toggle game panel"
            className="xl:hidden flex items-center justify-center p-2 rounded-lg bg-[#21150e] border border-amber-800/80 hover:bg-[#301d14] hover:border-amber-500 text-amber-200 shadow-md transition-all active:scale-95 relative"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 text-amber-300" />
            ) : (
              <Menu className="w-4 h-4 text-amber-300" />
            )}
            {!isMobileMenuOpen && moveCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-stone-950 font-bold text-[9px] rounded-full flex items-center justify-center shadow">
                {moveCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
