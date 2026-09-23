import React from 'react';

interface GameClockProps {
  seconds: number;
  isActive: boolean; // True when it's this player's turn to move
  playerName: string;
  isWhite: boolean;
  isFlagged?: boolean;
  hasTimer?: boolean;
  isThinking?: boolean;
}

export const GameClock: React.FC<GameClockProps> = ({
  seconds,
  isActive,
  playerName,
  isWhite,
  isFlagged = false,
  hasTimer = true,
  isThinking = false,
}) => {
  const formatTime = (secs: number) => {
    if (secs < 0) secs = 0;
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);

    const mStr = String(m).padStart(2, '0');
    const sStr = String(s).padStart(2, '0');

    if (m === 0 && secs < 20) {
      return `${sStr}.${ms}s`;
    }
    return `${mStr}:${sStr}`;
  };

  const isLowTime = hasTimer && seconds <= 30 && seconds > 0;
  const isCriticalTime = hasTimer && seconds <= 10 && seconds > 0;

  return (
    <div
      className={`relative px-3 py-2 rounded-xl transition-all duration-300 flex items-center justify-between border ${
        isActive
          ? 'bg-gradient-to-r from-[#2f1d13] via-[#3a2418] to-[#25170e] border-amber-400/90 shadow-[0_0_20px_rgba(245,158,11,0.35),inset_0_0_12px_rgba(245,158,11,0.15)] ring-2 ring-amber-400/60 scale-[1.01]'
          : 'bg-[#140d08]/80 border-amber-950/40 opacity-70 hover:opacity-85'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {/* Piece color dot with active radiant halo */}
        <div className="relative flex items-center justify-center">
          <div
            className={`w-3.5 h-3.5 rounded-full border shadow-sm transition-all ${
              isWhite
                ? 'bg-[#f7efe1] border-stone-300'
                : 'bg-[#221711] border-amber-700/60'
            } ${
              isActive
                ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-[#2f1d13] shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                : ''
            }`}
          />
          {isActive && (
            <div className="absolute -inset-1 rounded-full bg-amber-400/25 animate-ping pointer-events-none" />
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-bold tracking-wide truncate max-w-[110px] transition-colors ${
                isActive ? 'text-amber-100 font-serif' : 'text-amber-200/60'
              }`}
            >
              {playerName}
            </span>
            {/* Active Turn Badge */}
            {isActive && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono-code font-bold tracking-wider uppercase bg-amber-500/25 text-amber-300 border border-amber-400/60 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                {isThinking ? 'Thinking' : 'To Move'}
              </span>
            )}
          </div>
          <span className="text-[10px] text-amber-200/40 uppercase tracking-wider font-mono-code">
            {isWhite ? 'White' : 'Black'}
          </span>
        </div>
      </div>

      {/* Clock display or Casual Turn indicator */}
      <div
        className={`px-2.5 py-1 rounded-lg font-mono-code text-xs sm:text-sm font-bold tracking-wider tabular-nums border transition-all ${
          isCriticalTime
            ? 'bg-red-950/80 text-red-400 border-red-800/80 animate-pulse'
            : isLowTime
            ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
            : isActive
            ? 'bg-black/60 text-amber-200 border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
            : 'bg-black/40 text-amber-200/40 border-amber-950/40'
        }`}
      >
        {isFlagged ? (
          'FLAG'
        ) : hasTimer ? (
          formatTime(seconds)
        ) : isActive ? (
          <span className="text-[11px] font-mono-code text-amber-300 flex items-center gap-1.5 font-bold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Turn
          </span>
        ) : (
          <span className="text-[11px] font-mono-code text-amber-200/40 tracking-wider uppercase">Wait</span>
        )}
      </div>
    </div>
  );
};
