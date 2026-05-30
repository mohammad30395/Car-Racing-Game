import { LEVELS } from "@/lib/gameConfig";
import { normalizeUsername } from "@/lib/utils";
import type {
  GameProgress,
  GameRecord,
  GroundConfig,
  LevelConfig,
  PlayerProfile,
  ResultStatus,
} from "@/types/game";

export const STORAGE_KEYS = {
  profile: "carGame_profile",
  selectedGround: "carGame_selectedGround",
  records: "carGame_records",
  leaderboard: "carGame_leaderboard",
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function progressKey(username: string) {
  return `carGame_progress_${normalizeUsername(username)}`;
}

export function getProfile(): PlayerProfile | null {
  return readJson<PlayerProfile | null>(STORAGE_KEYS.profile, null);
}

export function saveProfile(profile: PlayerProfile) {
  writeJson(STORAGE_KEYS.profile, {
    name: profile.name.trim(),
    username: normalizeUsername(profile.username),
  });
}

export function getSelectedGroundId() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(STORAGE_KEYS.selectedGround);
}

export function saveSelectedGroundId(groundId: string) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.selectedGround, groundId);
}

export function getProgress(username: string): GameProgress {
  const normalized = normalizeUsername(username);

  return readJson<GameProgress>(progressKey(normalized), {
    username: normalized,
    unlockedLevels: [1],
    bestScores: {},
  });
}

export function saveProgress(progress: GameProgress) {
  const normalized = normalizeUsername(progress.username);
  const cleanLevels = Array.from(new Set(progress.unlockedLevels))
    .filter((level) => level >= 1 && level <= LEVELS.length)
    .sort((a, b) => a - b);

  writeJson(progressKey(normalized), {
    username: normalized,
    unlockedLevels: cleanLevels.length ? cleanLevels : [1],
    bestScores: progress.bestScores,
  });
}

export function resetProgress(username: string) {
  saveProgress({
    username: normalizeUsername(username),
    unlockedLevels: [1],
    bestScores: {},
  });
}

export function getRecords() {
  return readJson<GameRecord[]>(STORAGE_KEYS.records, []);
}

export function getLeaderboard() {
  return readJson<GameRecord[]>(STORAGE_KEYS.leaderboard, []);
}

export function getHighestUnlockedLevel(username: string) {
  const progress = getProgress(username);
  return Math.max(...progress.unlockedLevels, 1);
}

export function addGameRecord(record: GameRecord) {
  const records = [record, ...getRecords()];
  const leaderboard = [record, ...getLeaderboard()];

  writeJson(STORAGE_KEYS.records, records);
  writeJson(STORAGE_KEYS.leaderboard, leaderboard);
}

export function saveGameResult(params: {
  profile: PlayerProfile;
  ground: GroundConfig;
  level: LevelConfig;
  status: ResultStatus;
  score: number;
  timeSurvived: number;
}) {
  const username = normalizeUsername(params.profile.username);
  const record: GameRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: params.profile.name.trim(),
    username,
    groundId: params.ground.id,
    groundName: params.ground.name,
    level: params.level.level,
    score: Math.max(0, Math.round(params.score)),
    status: params.status,
    timeSurvived: Number(params.timeSurvived.toFixed(1)),
    createdAt: new Date().toISOString(),
  };

  const progress = getProgress(username);
  const previousBest = progress.bestScores[String(params.level.level)] ?? 0;
  progress.bestScores[String(params.level.level)] = Math.max(previousBest, record.score);

  if (params.status === "win" && params.level.level < LEVELS.length) {
    progress.unlockedLevels = Array.from(
      new Set([...progress.unlockedLevels, params.level.level + 1]),
    );
  }

  saveProgress(progress);
  addGameRecord(record);

  return record;
}

export function clearAllGameData() {
  if (!canUseStorage()) {
    return;
  }

  const keys = Array.from({ length: window.localStorage.length }, (_, index) =>
    window.localStorage.key(index),
  ).filter((key): key is string => Boolean(key?.startsWith("carGame_")));

  keys.forEach((key) => window.localStorage.removeItem(key));
}
