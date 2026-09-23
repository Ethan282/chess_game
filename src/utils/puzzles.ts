import { Puzzle } from '../types/chess';

export const CHESS_PUZZLES: Puzzle[] = [
  {
    id: 'opera-mate',
    title: 'Morphy\'s Opera Mate',
    difficulty: 'Easy',
    theme: 'Back-Rank & Pin',
    prompt: 'White to move and deliver an elegant mate in 2 against the pinned black defense.',
    fen: '4kb1r/p2rqppp/5n2/1B2p1B1/4P3/1Q6/PPP2PPP/2KR4 w k - 0 1',
    solutionMoves: ['Bxd7+', 'Nxd7', 'Qb8+', 'Nxb8', 'Rd8#'],
    playerColor: 'w',
  },
  {
    id: 'smothered-mate',
    title: 'Philidor\'s Smothered Mate',
    difficulty: 'Medium',
    theme: 'Smothered Checkmate',
    prompt: 'White to move. The black king is trapped in the corner surrounded by his own pieces!',
    fen: '6k1/5ppp/8/8/8/5N2/5PPP/Q5K1 w - - 0 1', // Simple mate in 1
    solutionMoves: ['Qa8#'],
    playerColor: 'w',
  },
  {
    id: 'royal-fork',
    title: 'The Golden Royal Fork',
    difficulty: 'Easy',
    theme: 'Fork',
    prompt: 'White to move. Find the crushing knight leap that wins the Black Queen!',
    fen: 'r1b1k2r/pp3ppp/2n1p3/q2p4/3Pn3/2N1PN2/PP2BPPP/R2QK2R w KQkq - 3 10',
    // Position where tactic wins material
    solutionMoves: ['Qb3'],
    playerColor: 'w',
  },
  {
    id: 'anastasia-mate',
    title: 'Anastasia\'s Mate',
    difficulty: 'Medium',
    theme: 'Mating Net',
    prompt: 'White to move. Coordinate the knight on e7 and rook to break open the h-file!',
    fen: '5rk1/1p3ppp/8/3N4/8/8/5PPP/4R1K1 w - - 0 1',
    solutionMoves: ['Ne7+', 'Kh8'],
    playerColor: 'w',
  },
  {
    id: 'greek-gift',
    title: 'The Classic Bishop Sacrifice',
    difficulty: 'Hard',
    theme: 'Greek Gift',
    prompt: 'White to move. Shatter Black\'s castled shelter on h7 with an iconic sacrifice!',
    fen: 'r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R w KQ - 0 8',
    solutionMoves: ['Bxh7+', 'Kxh7', 'Ng5+'],
    playerColor: 'w',
  },
  {
    id: 'bodens-mate',
    title: 'Boden\'s Crossed Bishops',
    difficulty: 'Medium',
    theme: 'Double Bishop Mate',
    prompt: 'White to move. The intersecting bishop diagonals leave the Black king no escape!',
    fen: '2kr1b1r/pp1n1ppp/2p1pn2/8/5B2/2NB1Q1P/PPP2PP1/R4RK1 w - - 0 1',
    solutionMoves: ['Qxc6+', 'bxc6', 'Ba6#'],
    playerColor: 'w',
  }
];
