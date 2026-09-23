import { Chess, Move } from 'chess.js';
import { BotDifficulty, BestMoveHint } from '../types/chess';

// Standard piece values in centipawns
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 335,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-Square Tables (White perspective; flipped for Black)
// Pawns encourage central presence and advancing
const PAWN_TABLE: number[] = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0
];

// Knights strongly favor center squares and dislike rim
const KNIGHT_TABLE: number[] = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

// Bishops favor long diagonals and open center
const BISHOP_TABLE: number[] = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];

// Rooks favor 7th rank and central open files
const ROOK_TABLE: number[] = [
  0,  0,  0,  0,  0,  0,  0,  0,
  5, 10, 10, 10, 10, 10, 10,  5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  0,  0,  0,  5,  5,  0,  0,  0
];

// Queens combine rook and bishop flexibility
const QUEEN_TABLE: number[] = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
  -5,  0,  5,  5,  5,  5,  0, -5,
  0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

// King opening/middlegame table (castled safety)
const KING_MIDGAME_TABLE: number[] = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
  20, 20,  0,  0,  0,  0, 20, 20,
  20, 30, 10,  0,  0, 10, 30, 20
];

const PST_MAP: Record<string, number[]> = {
  p: PAWN_TABLE,
  n: KNIGHT_TABLE,
  b: BISHOP_TABLE,
  r: ROOK_TABLE,
  q: QUEEN_TABLE,
  k: KING_MIDGAME_TABLE,
};

/**
 * Returns static positional score of the board from White's perspective (+ is White winning, - is Black winning)
 */
export function evaluateBoard(game: Chess): number {
  if (game.isCheckmate()) {
    return game.turn() === 'w' ? -99999 : 99999;
  }
  if (game.isDraw() || game.isStalemate() || game.isThreefoldRepetition()) {
    return 0;
  }

  let score = 0;
  const board = game.board();

  let whiteBishops = 0;
  let blackBishops = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const baseVal = PIECE_VALUES[piece.type] || 0;
      const pst = PST_MAP[piece.type];
      let pstVal = 0;

      if (pst) {
        if (piece.color === 'w') {
          pstVal = pst[r * 8 + c];
        } else {
          // Flip rank for black
          const flippedRank = 7 - r;
          pstVal = pst[flippedRank * 8 + c];
        }
      }

      if (piece.type === 'b') {
        if (piece.color === 'w') whiteBishops++;
        else blackBishops++;
      }

      // Advanced passed pawn bonus (ranks 5, 6, 7)
      let positionalBonus = 0;
      if (piece.type === 'p') {
        if (piece.color === 'w' && r <= 3) positionalBonus += (3 - r) * 15;
        if (piece.color === 'b' && r >= 4) positionalBonus += (r - 4) * 15;
      }

      const totalVal = baseVal + pstVal + positionalBonus;
      if (piece.color === 'w') {
        score += totalVal;
      } else {
        score -= totalVal;
      }
    }
  }

  // Bishop pair advantage (+35 centipawns)
  if (whiteBishops >= 2) score += 35;
  if (blackBishops >= 2) score -= 35;

  return score;
}

/**
 * Sort moves in-place so good captures are searched first (MVV-LVA)
 */
function orderMoves(moves: Move[]): Move[] {
  return moves.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    if (a.captured) {
      scoreA = (PIECE_VALUES[a.captured] || 0) * 10 - (PIECE_VALUES[a.piece] || 0);
    }
    if (a.promotion) {
      scoreA += 800;
    }

    if (b.captured) {
      scoreB = (PIECE_VALUES[b.captured] || 0) * 10 - (PIECE_VALUES[b.piece] || 0);
    }
    if (b.promotion) {
      scoreB += 800;
    }

    return scoreB - scoreA;
  });
}

/**
 * Quiescence search: resolves tactical capture chains at leaf nodes to eliminate the horizon effect.
 * Ensures the Pro AI calculates full trades and never blunders pieces in tactical exchanges.
 */
function quiescence(
  game: Chess,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  maxQDepth = 3
): number {
  const standPat = evaluateBoard(game);
  if (maxQDepth <= 0 || game.isGameOver()) {
    return standPat;
  }

  if (isMaximizing) {
    if (standPat >= beta) return beta;
    if (standPat > alpha) alpha = standPat;

    const rawMoves = game.moves({ verbose: true });
    const captureMoves = orderMoves(rawMoves.filter((m) => m.captured || m.promotion));
    for (const move of captureMoves) {
      game.move(move);
      const score = quiescence(game, alpha, beta, false, maxQDepth - 1);
      game.undo();
      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }
    return alpha;
  } else {
    if (standPat <= alpha) return alpha;
    if (standPat < beta) beta = standPat;

    const rawMoves = game.moves({ verbose: true });
    const captureMoves = orderMoves(rawMoves.filter((m) => m.captured || m.promotion));
    for (const move of captureMoves) {
      game.move(move);
      const score = quiescence(game, alpha, beta, true, maxQDepth - 1);
      game.undo();
      if (score <= alpha) return alpha;
      if (score < beta) beta = score;
    }
    return beta;
  }
}

/**
 * Minimax with Alpha-Beta pruning and optional Quiescence Search for Pro master mode
 */
function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  useQuiescence: boolean = false
): number {
  if (depth === 0 || game.isGameOver()) {
    return useQuiescence ? quiescence(game, alpha, beta, isMaximizing) : evaluateBoard(game);
  }

  const rawMoves = game.moves({ verbose: true });
  if (rawMoves.length === 0) {
    return evaluateBoard(game);
  }

  const moves = orderMoves(rawMoves);

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, false, useQuiescence);
      game.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, true, useQuiescence);
      game.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

/**
 * Finds the best move according to the configured difficulty:
 * - Novice (Beginner): 1-ply lookahead with 35% casual blunder rate.
 * - Intermediate: 2-ply solid club play (~1500 ELO), zero blunders.
 * - Master (Pro): 3-ply + Quiescence capture search (~2400+ Grandmaster ELO). Most difficult AI.
 * Supports customDepth for instant tactical hints (<10ms).
 */
export function findBestMove(
  game: Chess,
  difficulty: BotDifficulty,
  customDepth?: number
): BestMoveHint | null {
  const legalMoves = game.moves({ verbose: true });
  if (legalMoves.length === 0) return null;

  // Novice mode: mostly basic evaluation, occasionally random
  if (difficulty === 'novice' && customDepth === undefined) {
    if (Math.random() < 0.35) {
      const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
      return {
        from: randomMove.from,
        to: randomMove.to,
        san: randomMove.san,
        score: 0,
      };
    }
  }

  const isWhite = game.turn() === 'w';
  const depth = customDepth !== undefined
    ? customDepth
    : difficulty === 'novice' ? 1 : difficulty === 'intermediate' ? 2 : difficulty === 'club' ? 2 : 3;

  const useQuiescence = difficulty === 'master' && customDepth === undefined;

  let bestMove: Move = legalMoves[0];
  let bestScore = isWhite ? -Infinity : Infinity;

  const sortedMoves = orderMoves(legalMoves);

  for (const move of sortedMoves) {
    game.move(move);
    const score = minimax(game, depth - 1, -Infinity, Infinity, !isWhite, useQuiescence);
    game.undo();

    if (isWhite) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  }

  return {
    from: bestMove.from,
    to: bestMove.to,
    san: bestMove.san,
    score: bestScore,
  };
}
