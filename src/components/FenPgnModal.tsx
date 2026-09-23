import React, { useState } from 'react';
import { X, Copy, Check, Upload } from 'lucide-react';

interface FenPgnModalProps {
  isOpen: boolean;
  onClose: () => void;
  fen: string;
  pgn: string;
  onLoadFen: (fen: string) => boolean;
  onLoadPgn: (pgn: string) => boolean;
}

export const FenPgnModal: React.FC<FenPgnModalProps> = ({
  isOpen,
  onClose,
  fen,
  pgn,
  onLoadFen,
  onLoadPgn,
}) => {
  const [tab, setTab] = useState<'fen' | 'pgn'>('fen');
  const [inputVal, setInputVal] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDisplay = tab === 'fen' ? fen : pgn;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoad = () => {
    setErrorMsg(null);
    if (!inputVal.trim()) return;

    if (tab === 'fen') {
      const ok = onLoadFen(inputVal.trim());
      if (ok) {
        setInputVal('');
        onClose();
      } else {
        setErrorMsg('Invalid FEN position string. Please verify standard Forsyth-Edwards Notation.');
      }
    } else {
      const ok = onLoadPgn(inputVal.trim());
      if (ok) {
        setInputVal('');
        onClose();
      } else {
        setErrorMsg('Invalid PGN transcript format.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#1e130c] border border-amber-800/80 rounded-2xl p-6 shadow-2xl flex flex-col">
        {/* Brass corner ornaments */}
        <div className="absolute top-2 left-2 w-4 h-4 brass-corner rounded-tl-sm opacity-90" />
        <div className="absolute top-2 right-2 w-4 h-4 brass-corner rounded-tr-sm opacity-90" />
        <div className="absolute bottom-2 left-2 w-4 h-4 brass-corner rounded-bl-sm opacity-90" />
        <div className="absolute bottom-2 right-2 w-4 h-4 brass-corner rounded-br-sm opacity-90" />

        <div className="flex items-center justify-between pb-4 border-b border-amber-900/40">
          <h3 className="font-serif text-lg font-bold text-amber-100">
            Export & Import Game State
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-200/50 hover:text-amber-100 hover:bg-amber-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 my-4">
          <button
            onClick={() => {
              setTab('fen');
              setErrorMsg(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === 'fen'
                ? 'bg-amber-600/40 text-amber-100 border border-amber-500/60'
                : 'bg-black/30 text-amber-200/60 hover:text-amber-100'
            }`}
          >
            FEN (Position)
          </button>
          <button
            onClick={() => {
              setTab('pgn');
              setErrorMsg(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === 'pgn'
                ? 'bg-amber-600/40 text-amber-100 border border-amber-500/60'
                : 'bg-black/30 text-amber-200/60 hover:text-amber-100'
            }`}
          >
            PGN (Transcript)
          </button>
        </div>

        {/* Current State Box with Copy Button */}
        <div className="space-y-1 mb-4">
          <div className="flex justify-between items-center text-xs text-amber-200/60">
            <span>Current {tab.toUpperCase()}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-mono-code transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            readOnly
            value={currentDisplay}
            rows={tab === 'fen' ? 2 : 4}
            className="w-full bg-[#130b07] border border-amber-900/50 rounded-lg p-2.5 text-xs font-mono-code text-amber-200/90 resize-none select-all focus:outline-none"
          />
        </div>

        {/* Custom Input to Load */}
        <div className="space-y-2">
          <label className="text-xs text-amber-200/70 font-semibold block">
            Load custom {tab.toUpperCase()}
          </label>
          <textarea
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              tab === 'fen'
                ? 'Paste FEN string (e.g. rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1)'
                : 'Paste standard PGN text...'
            }
            rows={3}
            className="w-full bg-[#130b07] border border-amber-900/60 focus:border-amber-500 rounded-lg p-2.5 text-xs font-mono-code text-amber-100 resize-none focus:outline-none transition-colors"
          />

          {errorMsg && (
            <p className="text-xs text-red-400 font-mono-code">{errorMsg}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-amber-200/60 hover:text-amber-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLoad}
              disabled={!inputVal.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-stone-950 transition-colors shadow-md"
            >
              <Upload className="w-3.5 h-3.5" />
              Load Position
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
