import { useState, useEffect, useRef, useCallback } from 'react';
import { Chess, Square, Move } from 'chess.js';
import {
  PlayerColor,
  GameMode,
  SkillMode,
  BotDifficulty,
  CameraView,
  ClockPresetId,
  ClockSetting,
  MoveRecord,
  CapturedPiecesState,
  Puzzle,
  BestMoveHint,
} from './types/chess';
import { evaluateBoard, findBestMove } from './utils/chessEngine';
import { soundManager } from './utils/audio';
import { TopNavbar } from './components/TopNavbar';
import { ChessBoard } from './components/ChessBoard';
import { GameClock } from './components/GameClock';
import { CapturedPieces } from './components/CapturedPieces';
import { MoveHistory } from './components/MoveHistory';
import { EvaluationBar } from './components/EvaluationBar';
import { GameControls } from './components/GameControls';
import { PromotionModal } from './components/PromotionModal';
import { GameOverModal } from './components/GameOverModal';
import { PuzzlesModal } from './components/PuzzlesModal';
import { FenPgnModal } from './components/FenPgnModal';
import { ShieldCheck, Trophy, Sparkles, Swords, Crown, Eye, EyeOff, Play } from 'lucide-react';

const CLOCK_PRESETS: Record<ClockPresetId, ClockSetting> = {
  casual: { id: 'casual', label: 'Casual', sublabel: 'No Timer', initialSeconds: 0, incrementSeconds: 0 },
  bullet1: { id: 'bullet1', label: '1 min', sublabel: 'Bullet', initialSeconds: 60, incrementSeconds: 0 },
  blitz3: { id: 'blitz3', label: '3 min', sublabel: 'Blitz', initialSeconds: 180, incrementSeconds: 0 },
  blitz5_3: { id: 'blitz5_3', label: '5 | 3', sublabel: 'Blitz', initialSeconds: 300, incrementSeconds: 3 },
  rapid10: { id: 'rapid10', label: '10 min', sublabel: 'Rapid', initialSeconds: 600, incrementSeconds: 0 },
  classical15_10: { id: 'classical15_10', label: '15 | 10', sublabel: 'Classical', initialSeconds: 900, incrementSeconds: 10 },
};

export default function App() {
  // Game state
  const [game, setGame] = useState<Chess>(() => new Chess());
  const [boardFen, setBoardFen] = useState<string>(() => new Chess().fen());
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [skillMode, setSkillMode] = useState<SkillMode>('intermediate');
  const [humanColor, setHumanColor] = useState<PlayerColor>('w');
  const [boardOrientation, setBoardOrientation] = useState<PlayerColor>('w');
  const [cameraView, setCameraView] = useState<CameraView>('2d-flat');
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>('intermediate');
  const [clockPreset, setClockPreset] = useState<ClockPresetId>('casual');
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  // Move and interaction state
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [invalidSquare, setInvalidSquare] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [viewMoveIndex, setViewMoveIndex] = useState<number>(-1);
  const [evalScore, setEvalScore] = useState<number>(0);
  const [capturedPieces, setCapturedPieces] = useState<CapturedPiecesState>({ w: [], b: [] });
  const [hintMove, setHintMove] = useState<BestMoveHint | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);

  // Audio mute
  const [isMuted, setIsMuted] = useState(false);

  // Clocks
  const [whiteSeconds, setWhiteSeconds] = useState(0);
  const [blackSeconds, setBlackSeconds] = useState(0);
  const [isClockRunning, setIsClockRunning] = useState(false);

  // Modals & Puzzles
  const [gameOver, setGameOver] = useState<{
    isOpen: boolean;
    result: 'white_win' | 'black_win' | 'draw';
    reason: string;
  } | null>(null);
  const [activePuzzle, setActivePuzzle] = useState<Puzzle | null>(null);
  const [puzzleMoveIndex, setPuzzleMoveIndex] = useState<number>(0);
  const [completedPuzzleIds, setCompletedPuzzleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gm_chess_completed_puzzles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isPuzzlesModalOpen, setIsPuzzlesModalOpen] = useState(false);
  const [isFenPgnModalOpen, setIsFenPgnModalOpen] = useState(false);

  // Sound toggle handler
  const handleToggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
  };

  // Helper to recompute captured pieces
  const calculateCaptures = useCallback((history: MoveRecord[]) => {
    const wCaps: string[] = [];
    const bCaps: string[] = [];
    for (const m of history) {
      if (m.captured) {
        if (m.color === 'w') {
          // White captured a black piece
          wCaps.push(m.captured);
        } else {
          // Black captured a white piece
          bCaps.push(m.captured);
        }
      }
    }
    setCapturedPieces({ w: wCaps, b: bCaps });
  }, []);

  // Check Game Over status
  const checkGameEnd = useCallback((currentGame: Chess): boolean => {
    if (currentGame.isCheckmate()) {
      const winner = currentGame.turn() === 'w' ? 'black_win' : 'white_win';
      soundManager.playVictory();
      setGameOver({
        isOpen: true,
        result: winner,
        reason: 'Checkmate',
      });
      setIsClockRunning(false);
      return true;
    }

    if (currentGame.isDraw()) {
      soundManager.playDefeat();
      let reason = 'Draw';
      if (currentGame.isStalemate()) reason = 'Stalemate';
      else if (currentGame.isThreefoldRepetition()) reason = 'Threefold Repetition';
      else if (currentGame.isInsufficientMaterial()) reason = 'Insufficient Material';
      setGameOver({
        isOpen: true,
        result: 'draw',
        reason,
      });
      setIsClockRunning(false);
      return true;
    }

    return false;
  }, []);

  // Clock countdown timer effect
  useEffect(() => {
    if (!isClockRunning || clockPreset === 'casual') return;

    const interval = setInterval(() => {
      const currentTurn = game.turn();
      if (currentTurn === 'w') {
        setWhiteSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsClockRunning(false);
            soundManager.playDefeat();
            setGameOver({
              isOpen: true,
              result: 'black_win',
              reason: 'White Flag Fall (Timeout)',
            });
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsClockRunning(false);
            soundManager.playVictory();
            setGameOver({
              isOpen: true,
              result: 'white_win',
              reason: 'Black Flag Fall (Timeout)',
            });
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isClockRunning, clockPreset, game]);

  // Execute a chess move on the board
  const makeMove = useCallback(
    (from: Square, to: Square, promotionPiece?: string) => {
      // Clear hints and selection
      setSelectedSquare(null);
      setValidMoves([]);
      setHintMove(null);

      // Check if this move requires pawn promotion
      const piece = game.get(from);
      if (
        piece &&
        piece.type === 'p' &&
        ((piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1')) &&
        !promotionPiece
      ) {
        if (gameMode === 'ai' && piece.color !== humanColor) {
          promotionPiece = 'q';
        } else {
          setPendingPromotion({ from, to });
          return false;
        }
      }

      let executedMove: Move | null = null;
      try {
        executedMove = game.move({
          from,
          to,
          promotion: promotionPiece || 'q',
        });
      } catch {
        return false;
      }

      if (!executedMove) return false;

      // Audio feedback
      if (executedMove.captured) {
        soundManager.playCapture();
      } else if (executedMove.flags.includes('k') || executedMove.flags.includes('q')) {
        soundManager.playCastle();
      } else {
        soundManager.playMove();
      }

      if (game.isCheck() && !game.isCheckmate()) {
        soundManager.playCheck();
      }

      // Add clock increment if any
      const preset = CLOCK_PRESETS[clockPreset];
      if (preset.incrementSeconds > 0) {
        if (executedMove.color === 'w') {
          setWhiteSeconds((s) => s + preset.incrementSeconds);
        } else {
          setBlackSeconds((s) => s + preset.incrementSeconds);
        }
      }

      // Start clock on first move
      if (clockPreset !== 'casual' && !isClockRunning) {
        setIsClockRunning(true);
      }

      // Record move
      const record: MoveRecord = {
        san: executedMove.san,
        from: executedMove.from,
        to: executedMove.to,
        piece: executedMove.piece,
        color: executedMove.color as PlayerColor,
        captured: executedMove.captured,
        fen: game.fen(),
        moveNumber: Math.floor(moveHistory.length / 2) + 1,
      };

      const updatedHistory = [...moveHistory, record];
      setMoveHistory(updatedHistory);
      setViewMoveIndex(updatedHistory.length - 1);
      setLastMove({ from, to });
      calculateCaptures(updatedHistory);

      // Update board FEN and evaluation score
      setBoardFen(game.fen());
      setEvalScore(evaluateBoard(game));

      // Check for Puzzle Progression
      if (gameMode === 'puzzle' && activePuzzle) {
        const expectedMove = activePuzzle.solutionMoves[puzzleMoveIndex];
        const isCorrect =
          executedMove.san === expectedMove ||
          `${executedMove.from}${executedMove.to}` === expectedMove;

        if (isCorrect) {
          const nextIndex = puzzleMoveIndex + 1;
          setPuzzleMoveIndex(nextIndex);

          if (nextIndex >= activePuzzle.solutionMoves.length) {
            // Puzzle completed!
            soundManager.playVictory();
            if (!completedPuzzleIds.includes(activePuzzle.id)) {
              const updatedIds = [...completedPuzzleIds, activePuzzle.id];
              setCompletedPuzzleIds(updatedIds);
              try {
                localStorage.setItem('gm_chess_completed_puzzles', JSON.stringify(updatedIds));
              } catch {}
            }
          } else {
            // Opponent puzzle move
            setTimeout(() => {
              const botUci = activePuzzle.solutionMoves[nextIndex];
              try {
                const botMove = game.move(botUci);
                if (botMove) {
                  soundManager.playMove();
                  setPuzzleMoveIndex(nextIndex + 1);
                  setBoardFen(game.fen());
                  setLastMove({ from: botMove.from, to: botMove.to });
                }
              } catch {}
            }, 600);
          }
        } else {
          // Wrong puzzle move
          soundManager.playDefeat();
          setTimeout(() => {
            game.undo();
            setBoardFen(game.fen());
            setMoveHistory((prev) => prev.slice(0, -1));
          }, 600);
          return false;
        }
      }

      // Check for standard game over
      const isEnded = checkGameEnd(game);

      // If AI mode and game continues, trigger AI turn
      if (!isEnded && gameMode === 'ai' && game.turn() !== humanColor) {
        triggerAiMove();
      }

      return true;
    },
    [
      game,
      clockPreset,
      isClockRunning,
      moveHistory,
      calculateCaptures,
      gameMode,
      activePuzzle,
      puzzleMoveIndex,
      completedPuzzleIds,
      checkGameEnd,
      humanColor,
    ]
  );

  // AI bot move execution
  const triggerAiMove = useCallback(() => {
    setIsAiThinking(true);
    // Realistic thinking pause so the experience feels physical
    const delay = Math.floor(Math.random() * 400) + 600;

    setTimeout(() => {
      const best = findBestMove(game, botDifficulty);
      if (best) {
        makeMove(best.from as Square, best.to as Square, 'q');
      }
      setIsAiThinking(false);
    }, delay);
  }, [game, botDifficulty, makeMove]);

  // Skill Mode Selection handler
  const handleSelectSkillMode = (mode: SkillMode) => {
    setSkillMode(mode);
    if (mode === 'beginner') {
      setBotDifficulty('novice');
    } else if (mode === 'intermediate') {
      setBotDifficulty('intermediate');
    } else if (mode === 'pro') {
      setBotDifficulty('master');
    }
  };

  // Start Match
  const handleStartMatch = (chosenColor?: PlayerColor) => {
    const finalColor = chosenColor || humanColor;
    if (chosenColor) {
      setHumanColor(chosenColor);
      setBoardOrientation(chosenColor);
    }
    setIsGameStarted(true);

    const preset = CLOCK_PRESETS[clockPreset];
    setWhiteSeconds(preset.initialSeconds);
    setBlackSeconds(preset.initialSeconds);
    if (clockPreset !== 'casual') {
      setIsClockRunning(true);
    }

    // If human selected Black vs AI, AI opens with White's first move
    if (gameMode === 'ai' && finalColor === 'b' && game.history().length === 0) {
      setIsAiThinking(true);
      setTimeout(() => {
        const best = findBestMove(game, botDifficulty);
        if (best) {
          const m = game.move({ from: best.from, to: best.to, promotion: 'q' });
          if (m) {
            soundManager.playMove();
            setBoardFen(game.fen());
            setLastMove({ from: best.from as Square, to: best.to as Square });
            setMoveHistory([
              {
                san: m.san,
                from: m.from,
                to: m.to,
                piece: m.piece,
                color: m.color as PlayerColor,
                fen: game.fen(),
                moveNumber: 1,
              },
            ]);
            setViewMoveIndex(0);
          }
        }
        setIsAiThinking(false);
      }, 700);
    }
  };

  // Click on a board square
  const handleSquareClick = (square: Square) => {
    // If reviewing past moves, reset to latest
    if (viewMoveIndex !== moveHistory.length - 1 && moveHistory.length > 0) {
      handleNavigateMove(moveHistory.length - 1);
      return;
    }

    if (gameOver?.isOpen || isAiThinking) return;

    // Pieces are NOT movable before match start!
    if (!isGameStarted && gameMode !== 'puzzle') {
      setInvalidSquare(square);
      setTimeout(() => setInvalidSquare(null), 350);
      return;
    }

    // In AI mode, prevent moving during AI turn
    if (gameMode === 'ai' && game.turn() !== humanColor) return;

    if (selectedSquare) {
      if (selectedSquare === square) {
        // Deselect
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }

      // If clicked another piece of same color, change selection
      const clickedPiece = game.get(square);
      if (clickedPiece && clickedPiece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setValidMoves(moves.map((m) => m.to));
        return;
      }

      // Attempt to move to target square
      const success = makeMove(selectedSquare, square);
      if (!success) {
        // Trigger invalid move feedback
        setInvalidSquare(square);
        setTimeout(() => setInvalidSquare(null), 350);
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else {
      // First click: select piece if it belongs to current player
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setValidMoves(moves.map((m) => m.to));
      }
    }
  };

  // Drag and drop handler
  const handlePieceDrop = (from: Square, to: Square) => {
    if (viewMoveIndex !== moveHistory.length - 1 && moveHistory.length > 0) {
      handleNavigateMove(moveHistory.length - 1);
    }
    if (gameOver?.isOpen || isAiThinking) return;
    if (!isGameStarted && gameMode !== 'puzzle') return;
    if (gameMode === 'ai' && game.turn() !== humanColor) return;

    makeMove(from, to);
  };

  // Restart / New Game
  const handleStartNewGame = useCallback(() => {
    const newG = new Chess();
    setGame(newG);
    setBoardFen(newG.fen());
    setSelectedSquare(null);
    setValidMoves([]);
    setLastMove(null);
    setMoveHistory([]);
    setViewMoveIndex(-1);
    setEvalScore(0);
    setCapturedPieces({ w: [], b: [] });
    setHintMove(null);
    setIsAiThinking(false);
    setPendingPromotion(null);
    setGameOver(null);
    setActivePuzzle(null);
    setIsGameStarted(false);

    // Reset clocks based on preset
    const preset = CLOCK_PRESETS[clockPreset];
    setWhiteSeconds(preset.initialSeconds);
    setBlackSeconds(preset.initialSeconds);
    setIsClockRunning(false);

    // If human selected Black vs AI, AI makes opening move
    if (gameMode === 'ai' && humanColor === 'b') {
      setIsAiThinking(true);
      setTimeout(() => {
        const best = findBestMove(newG, botDifficulty);
        if (best) {
          const m = newG.move({ from: best.from, to: best.to });
          if (m) {
            soundManager.playMove();
            setBoardFen(newG.fen());
            setLastMove({ from: best.from as Square, to: best.to as Square });
            setMoveHistory([
              {
                san: m.san,
                from: m.from,
                to: m.to,
                piece: m.piece,
                color: m.color as PlayerColor,
                fen: newG.fen(),
                moveNumber: 1,
              },
            ]);
            setViewMoveIndex(0);
          }
        }
        setIsAiThinking(false);
      }, 700);
    }
  }, [clockPreset, gameMode, humanColor, botDifficulty]);

  // Undo move
  const handleUndoMove = () => {
    if (moveHistory.length === 0 || isAiThinking) return;

    // In AI mode, undo 2 plies (player's move + bot's response)
    const undoCount = gameMode === 'ai' ? 2 : 1;
    for (let i = 0; i < undoCount; i++) {
      if (game.history().length > 0) {
        game.undo();
      }
    }

    const updatedHistory = moveHistory.slice(0, -undoCount);
    setMoveHistory(updatedHistory);
    setViewMoveIndex(updatedHistory.length - 1);
    setBoardFen(game.fen());
    setSelectedSquare(null);
    setValidMoves([]);
    setHintMove(null);
    setEvalScore(evaluateBoard(game));
    calculateCaptures(updatedHistory);

    if (updatedHistory.length > 0) {
      const prevMove = updatedHistory[updatedHistory.length - 1];
      setLastMove({ from: prevMove.from as Square, to: prevMove.to as Square });
    } else {
      setLastMove(null);
    }
  };

  // Tactical Hint Calculation
  const handleCalculateHint = () => {
    if (isAiThinking) return;
    const best = findBestMove(game, 'master');
    if (best) {
      setHintMove(best);
      soundManager.playCheck();
    }
  };

  // Flip board perspective
  const handleFlipBoard = () => {
    setBoardOrientation((prev) => (prev === 'w' ? 'b' : 'w'));
  };

  // Promotion choice
  const handleSelectPromotion = (piece: 'q' | 'r' | 'b' | 'n') => {
    if (!pendingPromotion) return;
    const { from, to } = pendingPromotion;
    setPendingPromotion(null);
    makeMove(from, to, piece);
  };

  // Navigate through move history
  const handleNavigateMove = (index: number) => {
    if (index === -1) {
      // Initial position
      const tempGame = new Chess();
      setBoardFen(tempGame.fen());
      setViewMoveIndex(-1);
      setLastMove(null);
    } else if (index >= 0 && index < moveHistory.length) {
      const targetMove = moveHistory[index];
      setBoardFen(targetMove.fen);
      setViewMoveIndex(index);
      setLastMove({ from: targetMove.from as Square, to: targetMove.to as Square });
    }
  };

  // Load a curated puzzle
  const handleSelectPuzzle = (puzzle: Puzzle) => {
    const puzzleGame = new Chess(puzzle.fen);
    setGame(puzzleGame);
    setBoardFen(puzzleGame.fen());
    setActivePuzzle(puzzle);
    setPuzzleMoveIndex(0);
    setGameMode('puzzle');
    setHumanColor(puzzle.playerColor);
    setBoardOrientation(puzzle.playerColor);
    setSelectedSquare(null);
    setValidMoves([]);
    setLastMove(null);
    setMoveHistory([]);
    setViewMoveIndex(-1);
    setGameOver(null);
    setIsClockRunning(false);
    setEvalScore(evaluateBoard(puzzleGame));
  };

  // Resign game
  const handleResign = () => {
    if (gameOver?.isOpen) return;
    const currentTurn = game.turn();
    const winner = currentTurn === 'w' ? 'black_win' : 'white_win';
    soundManager.playDefeat();
    setGameOver({
      isOpen: true,
      result: winner,
      reason: `${currentTurn === 'w' ? 'White' : 'Black'} Resigned`,
    });
    setIsClockRunning(false);
  };

  // Offer / Claim draw
  const handleOfferDraw = () => {
    if (gameOver?.isOpen) return;
    soundManager.playDefeat();
    setGameOver({
      isOpen: true,
      result: 'draw',
      reason: 'Draw Agreed by Mutual Consent',
    });
    setIsClockRunning(false);
  };

  // FEN / PGN loaders
  const handleLoadFen = (fenStr: string): boolean => {
    try {
      const newG = new Chess(fenStr);
      setGame(newG);
      setBoardFen(newG.fen());
      setSelectedSquare(null);
      setValidMoves([]);
      setLastMove(null);
      setMoveHistory([]);
      setViewMoveIndex(-1);
      setEvalScore(evaluateBoard(newG));
      setGameOver(null);
      return true;
    } catch {
      return false;
    }
  };

  const handleLoadPgn = (pgnStr: string): boolean => {
    try {
      const newG = new Chess();
      newG.loadPgn(pgnStr);
      setGame(newG);
      setBoardFen(newG.fen());
      setSelectedSquare(null);
      setValidMoves([]);
      setMoveHistory([]);
      setViewMoveIndex(-1);
      setEvalScore(evaluateBoard(newG));
      setGameOver(null);
      return true;
    } catch {
      return false;
    }
  };

  // King square in check for visual ruby alert
  const inCheckSquare = game.isCheck()
    ? (() => {
        const board = game.board();
        const turn = game.turn();
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && p.type === 'k' && p.color === turn) {
              return `${'abcdefgh'[c]}${8 - r}` as Square;
            }
          }
        }
        return null;
      })()
    : null;

  // Material advantage tally
  const whiteMatScore = capturedPieces.w.reduce((acc, p) => acc + (p === 'q' ? 9 : p === 'r' ? 5 : p === 'b' || p === 'n' ? 3 : 1), 0);
  const blackMatScore = capturedPieces.b.reduce((acc, p) => acc + (p === 'q' ? 9 : p === 'r' ? 5 : p === 'b' || p === 'n' ? 3 : 1), 0);
  const whiteAdvantage = whiteMatScore > blackMatScore ? whiteMatScore - blackMatScore : 0;
  const blackAdvantage = blackMatScore > whiteMatScore ? blackMatScore - whiteMatScore : 0;

  // Top/Bottom player configuration based on board orientation
  const topPlayerColor: PlayerColor = boardOrientation === 'w' ? 'b' : 'w';
  const bottomPlayerColor: PlayerColor = boardOrientation === 'w' ? 'w' : 'b';

  const getPlayerLabel = (color: PlayerColor) => {
    if (gameMode === 'ai') {
      const modeTag = skillMode === 'beginner' ? 'Beginner 800' : skillMode === 'intermediate' ? 'Club 1500' : 'Master 2200';
      return color === humanColor ? 'You' : `StockBot (${modeTag})`;
    }
    if (gameMode === 'puzzle') {
      return color === humanColor ? 'You (Tactician)' : 'Opponent';
    }
    return color === 'w' ? 'Player 1' : 'Player 2';
  };

  return (
    <div className="min-h-screen bg-[#100b07] text-[#e8e4dc] flex flex-col selection:bg-amber-800/40">
      {/* Top Navbar with 3-Mode Selector */}
      <TopNavbar
        mode={gameMode}
        onSelectMode={(m) => {
          setGameMode(m);
          handleStartNewGame();
        }}
        skillMode={skillMode}
        onSelectSkillMode={handleSelectSkillMode}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onNewGame={handleStartNewGame}
        onOpenPuzzles={() => setIsPuzzlesModalOpen(true)}
      />

      {/* Main Parlor Canvas: Deep Wooden Desk Backing */}
      <main className="flex-1 flex flex-col xl:flex-row items-center justify-center p-2 sm:p-3 md:p-4 gap-3 lg:gap-5 max-w-7xl mx-auto w-full">
        {/* Center Arena: 3D Chess Board Stage with Clocks & HUD */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[620px]">
          {/* Top Player HUD (Clocks & Captures) */}
          <div className="w-full flex items-center justify-between gap-2.5 mb-1.5 px-0.5">
            <div className="flex-1">
              <GameClock
                seconds={topPlayerColor === 'w' ? whiteSeconds : blackSeconds}
                isActive={game.turn() === topPlayerColor}
                playerName={getPlayerLabel(topPlayerColor)}
                isWhite={topPlayerColor === 'w'}
                hasTimer={clockPreset !== 'casual'}
                isThinking={gameMode === 'ai' && topPlayerColor !== humanColor && isAiThinking}
              />
            </div>
            <div className="flex-1">
              <CapturedPieces
                captured={topPlayerColor === 'w' ? capturedPieces.w : capturedPieces.b}
                color={topPlayerColor === 'w' ? 'b' : 'w'}
                materialAdvantage={topPlayerColor === 'w' ? whiteAdvantage : blackAdvantage}
              />
            </div>
          </div>

          {/* Active Skill Mode & Move Assist Banner */}
          <div
            className={`mb-1.5 w-full flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs shadow-md transition-all ${
              skillMode === 'beginner'
                ? 'bg-emerald-950/70 border-emerald-600/50 text-emerald-200'
                : skillMode === 'intermediate'
                ? 'bg-amber-950/70 border-amber-600/50 text-amber-200'
                : 'bg-purple-950/70 border-purple-600/50 text-purple-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {skillMode === 'beginner' && <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              {skillMode === 'intermediate' && <Swords className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
              {skillMode === 'pro' && <Crown className="w-3.5 h-3.5 text-yellow-400 shrink-0" />}
              <span className="font-semibold capitalize">
                {skillMode} Mode
              </span>
              <span className="opacity-80 hidden md:inline text-[11px]">
                {skillMode === 'beginner' && '• Move points illuminated on token click'}
                {skillMode === 'intermediate' && '• Move points illuminated on token click'}
                {skillMode === 'pro' && '• Blind vision: Move points hidden'}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!isGameStarted ? (
                <button
                  onClick={() => handleStartMatch(humanColor)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95 animate-pulse"
                >
                  <Play className="w-3 h-3 fill-stone-950" />
                  <span>Start Match</span>
                </button>
              ) : skillMode === 'pro' ? (
                <span className="flex items-center gap-1 text-[10px] font-mono-code font-bold text-purple-300 bg-purple-900/60 border border-purple-700/60 px-2 py-0.5 rounded-full">
                  <EyeOff className="w-3 h-3 text-purple-300" />
                  Blind Vision
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-mono-code font-bold text-emerald-300 bg-emerald-900/60 border border-emerald-700/60 px-2 py-0.5 rounded-full">
                  <Eye className="w-3 h-3 text-emerald-300" />
                  Move Points ON
                </span>
              )}
            </div>
          </div>

          {/* Active AI Thinking Indicator Banner */}
          {isAiThinking && (
            <div className="mb-1.5 flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/50 text-xs font-medium text-amber-200 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>StockBot is calculating optimal variations...</span>
            </div>
          )}

          {/* Puzzle Prompt Indicator Banner */}
          {gameMode === 'puzzle' && activePuzzle && (
            <div className="mb-1.5 w-full px-4 py-2 rounded-xl bg-[#1e2a1b] border border-emerald-800/60 text-xs text-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">{activePuzzle.title}:</span>
                <span className="text-emerald-100/80">{activePuzzle.prompt}</span>
              </div>
              <span className="font-mono-code text-[11px] text-emerald-300">
                Move {Math.floor(puzzleMoveIndex / 2) + 1}
              </span>
            </div>
          )}

          {/* Main Board Arena with Integrated Evaluation Gauge beside Board */}
          <div className="relative flex items-center justify-center gap-2 sm:gap-3 w-full">
            {/* Evaluation Gauge snugly beside board */}
            <div className="hidden sm:flex flex-col items-center justify-center h-[min(480px,calc(100vh-190px))] py-1">
              <EvaluationBar score={evalScore} orientation={boardOrientation} />
            </div>

            {/* The 3D Wooden Chess Board */}
            <ChessBoard
              board={game.board()}
              turn={game.turn() as PlayerColor}
              playerOrientation={boardOrientation}
              selectedSquare={selectedSquare}
              validMoves={validMoves}
              lastMove={lastMove}
              inCheckSquare={inCheckSquare}
              hintMove={hintMove}
              cameraView={cameraView}
              onSquareClick={handleSquareClick}
              onPieceDrop={handlePieceDrop}
              disabled={isAiThinking}
              showMovePoints={skillMode !== 'pro'}
              invalidSquare={invalidSquare}
              isGameStarted={isGameStarted}
            />
          </div>

          {/* Bottom Player HUD (Clocks & Captures) */}
          <div className="w-full flex items-center justify-between gap-2.5 mt-1.5 px-0.5">
            <div className="flex-1">
              <GameClock
                seconds={bottomPlayerColor === 'w' ? whiteSeconds : blackSeconds}
                isActive={game.turn() === bottomPlayerColor}
                playerName={getPlayerLabel(bottomPlayerColor)}
                isWhite={bottomPlayerColor === 'w'}
                hasTimer={clockPreset !== 'casual'}
                isThinking={gameMode === 'ai' && bottomPlayerColor !== humanColor && isAiThinking}
              />
            </div>
            <div className="flex-1">
              <CapturedPieces
                captured={bottomPlayerColor === 'w' ? capturedPieces.w : capturedPieces.b}
                color={bottomPlayerColor === 'w' ? 'b' : 'w'}
                materialAdvantage={bottomPlayerColor === 'w' ? whiteAdvantage : blackAdvantage}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar: Game Controls & Algebraic Move History */}
        <div className="w-full xl:w-[330px] flex flex-col gap-3 self-stretch justify-start shrink-0">
          {/* Controls Panel */}
          <GameControls
            mode={gameMode}
            skillMode={skillMode}
            onChangeSkillMode={handleSelectSkillMode}
            cameraView={cameraView}
            onChangeCamera={setCameraView}
            onFlipBoard={handleFlipBoard}
            onUndo={handleUndoMove}
            onHint={handleCalculateHint}
            onOpenFenPgn={() => setIsFenPgnModalOpen(true)}
            onResign={handleResign}
            onOfferDraw={handleOfferDraw}
            canUndo={moveHistory.length > 0}
            botDifficulty={botDifficulty}
            onChangeDifficulty={(diff) => {
              setBotDifficulty(diff);
              if (diff === 'novice') setSkillMode('beginner');
              else if (diff === 'intermediate' || diff === 'club') setSkillMode('intermediate');
              else if (diff === 'master') setSkillMode('pro');
            }}
            clockPreset={clockPreset}
            onChangeClock={(preset) => {
              setClockPreset(preset);
              const p = CLOCK_PRESETS[preset];
              setWhiteSeconds(p.initialSeconds);
              setBlackSeconds(p.initialSeconds);
            }}
            isAiThinking={isAiThinking}
            isGameStarted={isGameStarted}
            onStartMatch={handleStartMatch}
            humanColor={humanColor}
            onChangeHumanColor={(c) => {
              setHumanColor(c);
              setBoardOrientation(c);
            }}
          />

          {/* Move History / Notation Box */}
          <div className="flex-1 min-h-[260px] max-h-[460px]">
            <MoveHistory
              moves={moveHistory}
              currentMoveIndex={viewMoveIndex}
              onNavigateMove={handleNavigateMove}
            />
          </div>

          {/* Status badge and Fair Play notice */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#17100b]/80 border border-amber-950/40 text-xs text-amber-200/50">
            <span className="flex items-center gap-1.5 font-serif">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500/70" />
              FIDE Rules Compliant
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-mono-code text-[11px] font-bold text-amber-300">
                {getPlayerLabel(game.turn() as PlayerColor)} to move
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Promotion Dialog Modal */}
      {pendingPromotion && (
        <PromotionModal
          color={game.turn() as PlayerColor}
          onSelect={handleSelectPromotion}
          onCancel={() => setPendingPromotion(null)}
        />
      )}

      {/* Game Over Modal */}
      {gameOver && (
        <GameOverModal
          isOpen={gameOver.isOpen}
          result={gameOver.result}
          reason={gameOver.reason}
          onPlayAgain={handleStartNewGame}
          onReviewBoard={() => setGameOver({ ...gameOver, isOpen: false })}
        />
      )}

      {/* Puzzles Dialog Modal */}
      <PuzzlesModal
        isOpen={isPuzzlesModalOpen}
        onClose={() => setIsPuzzlesModalOpen(false)}
        onSelectPuzzle={handleSelectPuzzle}
        completedPuzzleIds={completedPuzzleIds}
      />

      {/* FEN / PGN Dialog Modal */}
      <FenPgnModal
        isOpen={isFenPgnModalOpen}
        onClose={() => setIsFenPgnModalOpen(false)}
        fen={boardFen}
        pgn={game.pgn()}
        onLoadFen={handleLoadFen}
        onLoadPgn={handleLoadPgn}
      />
    </div>
  );
}
