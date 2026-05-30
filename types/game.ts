export type GameStatus = "idle" | "running" | "paused" | "recovering" | "won" | "lost";

export type ResultStatus = "win" | "game-over";

export interface PlayerProfile {
  name: string;
  username: string;
}

export interface GroundConfig {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  accent: string;
  road: string;
  lane: string;
  background: string;
  obstacle: string;
}

export interface LevelConfig {
  level: number;
  playerSpeed: number;
  roadSpeed: number;
  obstacleSpeed: number;
  obstacleSpawnRate: number;
  obstacleCount: number;
  obstacleTypes: string[];
  requiredSurvivalTime: number;
  scoreMultiplier: number;
  winScoreTarget: number;
}

export interface GameProgress {
  username: string;
  unlockedLevels: number[];
  bestScores: Record<string, number>;
}

export interface GameRecord {
  id: string;
  name: string;
  username: string;
  groundId: string;
  groundName: string;
  level: number;
  score: number;
  status: ResultStatus;
  timeSurvived: number;
  createdAt: string;
}

export interface GameResult {
  status: ResultStatus;
  username: string;
  ground: GroundConfig;
  level: number;
  score: number;
  timeSurvived: number;
}
