export type PlayerColor = 'w' | 'b';

export type GameMode = 'ai' | 'pass-and-play' | 'puzzle' | 'analysis';

export type SkillMode = 'beginner' | 'intermediate' | 'pro';

export interface SkillModeConfig {
  id: SkillMode;
  name: string;
  tagline: string;
  description: string;
  elo: number;
  showMovePoints: boolean;
  botDifficulty: BotDifficulty;
  badgeLabel: string;
}

export type BotDifficulty = 'novice' | 'intermediate' | 'club' | 'master';

export type CameraView = '3d-angled' | '3d-front' | '2d-flat';

export type ClockPresetId = 'casual' | 'bullet1' | 'blitz3' | 'blitz5_3' | 'rapid10' | 'classical15_10';

export interface ClockSetting {
  id: ClockPresetId;
  label: string;
  sublabel: string;
  initialSeconds: number;
  incrementSeconds: number;
}

export interface MoveRecord {
  san: string;
  from: string;
  to: string;
  piece: string;
  color: PlayerColor;
  captured?: string;
  fen: string;
  moveNumber: number;
}

export interface CapturedPiecesState {
  w: string[];
  b: string[];
}

export interface Puzzle {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  theme: string;
  prompt: string;
  fen: string;
  solutionMoves: string[]; // UCI or SAN moves in sequence
  playerColor: PlayerColor;
}

export interface BestMoveHint {
  from: string;
  to: string;
  san: string;
  score: number;
}
