import React, { useState } from 'react';
import { GameMode, SkillMode } from '../types/chess';
import { Volume2, VolumeX, RotateCcw, Sparkles, Swords, Crown, LayoutGrid, Menu, X, Eye } from 'lucide-react';

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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const skillBadge = () => {
    if (skillMode === 'beginner') return (
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-emerald-950/90 to-teal-950/80 border border-emerald-500/60 text-emerald-200 text-[10px] font-semibold shrink-0">
        <Eye className="w-3 h-3 text-emerald-400 shrink-0" />
        <span className="font-bold text-emerald-100 hidden sm:inline">Beginner</span>
        <span className="font-mono-code text-emerald-400/90 bg-emerald-900/60 px-1 py-0.5 rounded text-[9px]">800</span>
      </div>
    );
    if (skillMode === 'intermediate') return (
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-amber-950/90 to-[#27170c] border border-amber-500/60 text-amber-200 text-[10px] font-semibold shrink-0">
        <Swords className="w-3 h-3 text-amber-400 shrink-0" />
        <span className="font-bold text-amber-100 hidden sm:inline">Intermediate</span>
        <span className="font-mono-code text-amber-300 bg-amber-900/60 px-1 py-0.5 rounded text-[9px]">1500</span>
      </div>
    );
    if (skillMode === 'pro') return (
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-purple-950/90 via-[#20102b] to-purple-950/90 border border-purple-500/60 text-purple-200 text-[10px] font-semibold shrink-0">
        <Crown className="w-3 h-3 text-yellow-400 shrink-0" />
        <span className="font-bold text-purple-100 hidden sm:inline">Pro Master</span>
        <span className="font-mono-code text-purple-300 bg-purple-900/60 px-1 py-0.5 rounded text-[9px]">2400+</span>
      </div>
    );
    return null;
  };

  return (
    <>
      <header className="w-full flex items-center justify-between gap-2 px-3 sm:px-5 py-1.5 border-b border-amber-950/60 bg-[#140e0a]/95 backdrop-blur-md shrink-0 z-30 shadow-lg">

        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2 min-w-0">
          <a
            href="/"
            className="font-serif font-bold tracking-tight text-amber-100 hover:text-amber-200 transition-colors shrink-0 text-sm sm:text-base md:text-lg lg:text-xl leading-tight"
          >
            <span className="hidden sm:inline">Grandmaster 3D Chess</span>
            <span className="sm:hidden">GM Chess</span>
          </a>
        </div>

        {/* Zone 2: Skill Badge (always visible, compact on mobile) */}
        {skillBadge()}

        {/* Zone 3: Desktop nav actions (hidden on mobile) */}
        <div className="hidden xl:flex items-center gap-2">
          <button
            onClick={onOpenLobby}
            title="Open Match Lobby & Player Setup"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21150e] border border-amber-800/60 hover:bg-[#301d14] hover:border-amber-500/70 text-amber-200 text-xs font-semibold shadow transition-all active:scale-95"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
            <span>Lobby</span>
          </button>

          <button
            onClick={onToggleSound}
            title={isMuted ? 'Unmute game sounds' : 'Mute game sounds'}
            className="p-2 rounded-lg bg-[#21150e] border border-amber-900/40 text-amber-200/80 hover:text-amber-100 hover:bg-amber-950/60 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-amber-400/60" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={onNewGame}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-950 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-lg shadow-md transition-all whitespace-nowrap active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Game</span>
          </button>

          {onUndo && (
            <button
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo last move"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#21150e] border border-amber-900/60 hover:border-amber-600/70 hover:bg-[#301d14] disabled:opacity-40 disabled:pointer-events-none text-amber-200 text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Undo</span>
            </button>
          )}

          {onHint && skillMode !== 'pro' && (
            <button
              onClick={onHint}
              disabled={isAiThinking}
              title={hasActiveHint ? 'Clear tactical hint' : 'Get instant tactical hint'}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition-all active:scale-95 ${
                hasActiveHint
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 ring-1 ring-emerald-400/50'
                  : 'bg-[#21150e] border-amber-900/60 hover:border-amber-600/70 hover:bg-[#301d14] text-amber-200'
              } disabled:opacity-40 disabled:pointer-events-none`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${hasActiveHint ? 'text-emerald-400 animate-spin' : 'text-amber-400'}`} style={hasActiveHint ? { animationDuration: '3s' } : undefined} />
              <span>{hasActiveHint ? 'Active' : 'Hint'}</span>
            </button>
          )}

          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              title={isMobileMenuOpen ? 'Close panel' : 'Open Controls & Move History'}
              aria-label="Toggle game panel"
              className="flex items-center justify-center p-2 rounded-lg bg-[#21150e] border border-amber-800/80 hover:bg-[#301d14] hover:border-amber-500 text-amber-200 shadow-md transition-all active:scale-95 relative"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 text-amber-300" /> : <Menu className="w-4 h-4 text-amber-300" />}
              {!isMobileMenuOpen && moveCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-stone-950 font-bold text-[9px] rounded-full flex items-center justify-center shadow">
                  {moveCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Zone 3 Mobile: icon-only compact right side */}
        <div className="flex xl:hidden items-center gap-1.5 shrink-0">

          {/* Mobile Undo icon */}
          {onUndo && (
            <button
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo"
              className="flex items-center justify-center p-1.5 rounded-lg bg-[#21150e] border border-amber-900/60 hover:bg-[#301d14] disabled:opacity-40 disabled:pointer-events-none text-amber-200 transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}

          {/* Mobile Hint icon (hidden in pro mode) */}
          {onHint && skillMode !== 'pro' && (
            <button
              onClick={onHint}
              disabled={isAiThinking}
              title={hasActiveHint ? 'Clear hint' : 'Hint'}
              className={`flex items-center justify-center p-1.5 rounded-lg border transition-all active:scale-95 ${
                hasActiveHint
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                  : 'bg-[#21150e] border-amber-900/60 hover:bg-[#301d14] text-amber-200'
              } disabled:opacity-40 disabled:pointer-events-none`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${hasActiveHint ? 'text-emerald-400 animate-spin' : 'text-amber-400'}`} style={hasActiveHint ? { animationDuration: '3s' } : undefined} />
            </button>
          )}

          {/* Panel Drawer toggle (controls + move history) */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              title={isMobileMenuOpen ? 'Close Controls' : 'Open Controls & Moves'}
              aria-label="Toggle game panel"
              className="flex items-center justify-center p-1.5 rounded-lg bg-[#21150e] border border-amber-800/80 hover:bg-[#301d14] hover:border-amber-500 text-amber-200 transition-all active:scale-95 relative"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 text-amber-300" /> : <Menu className="w-4 h-4 text-amber-300" />}
              {!isMobileMenuOpen && moveCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-stone-950 font-bold text-[9px] rounded-full flex items-center justify-center shadow">
                  {moveCount > 99 ? '99+' : moveCount}
                </span>
              )}
            </button>
          )}

          {/* Mobile ⋯ hamburger: Lobby, Sound, New Game */}
          <div className="relative">
            <button
              onClick={() => setIsMobileNavOpen((v) => !v)}
              title="More options"
              aria-label="More navigation options"
              className="flex items-center justify-center p-1.5 rounded-lg bg-amber-600/20 border border-amber-600/50 hover:bg-amber-600/30 text-amber-200 transition-all active:scale-95"
            >
              {isMobileNavOpen ? <X className="w-4 h-4 text-amber-300" /> : <Menu className="w-4 h-4 text-amber-300" />}
            </button>

            {isMobileNavOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMobileNavOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 z-50 w-48 bg-[#1a0f0a] border border-amber-800/70 rounded-xl shadow-2xl overflow-hidden">
                  <button
                    onClick={() => { onOpenLobby(); setIsMobileNavOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[11px] font-semibold text-amber-200 hover:bg-amber-900/40 transition-colors"
                  >
                    <LayoutGrid className="w-4 h-4 text-amber-400 shrink-0" />
                    Lobby / Settings
                  </button>
                  <div className="h-px bg-amber-950/60" />
                  <button
                    onClick={() => { onToggleSound(); setIsMobileNavOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[11px] font-semibold text-amber-200 hover:bg-amber-900/40 transition-colors"
                  >
                    {isMuted
                      ? <VolumeX className="w-4 h-4 text-amber-400/60 shrink-0" />
                      : <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />}
                    {isMuted ? 'Unmute Sounds' : 'Mute Sounds'}
                  </button>
                  <div className="h-px bg-amber-950/60" />
                  <button
                    onClick={() => { onNewGame(); setIsMobileNavOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[11px] font-semibold text-amber-100 hover:bg-amber-700/25 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
                    New Game
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      </header>
    </>
  );
};

