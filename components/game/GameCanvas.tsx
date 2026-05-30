"use client";

import { type PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { GameHUD } from "@/components/game/GameHUD";
import { TouchControls } from "@/components/game/TouchControls";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { clamp } from "@/lib/utils";
import { saveGameResult } from "@/lib/storage";
import type {
  GameResult,
  GameStatus,
  GroundConfig,
  LevelConfig,
  PlayerProfile,
  ResultStatus,
} from "@/types/game";

const LANE_COUNT = 3;
const STARTING_LIVES = 3;
const RECOVERY_DELAY_MS = 1400;
const JUMP_DURATION = 1.55;
const JUMP_COOLDOWN = 2.05;

interface Obstacle {
  lane: number;
  y: number;
  width: number;
  height: number;
  type: string;
}

interface LoopState {
  targetLane: number;
  carX: number;
  obstacles: Obstacle[];
  score: number;
  elapsed: number;
  spawnClock: number;
  status: GameStatus;
  lastTime: number;
  pointerStartX: number | null;
  pointerStartY: number | null;
  lives: number;
  jumpUntil: number;
  jumpCooldownUntil: number;
}

interface GameCanvasProps {
  profile: PlayerProfile;
  ground: GroundConfig;
  level: LevelConfig;
}

function createInitialState(): LoopState {
  return {
    targetLane: 1,
    carX: 0,
    obstacles: [],
    score: 0,
    elapsed: 0,
    spawnClock: 0,
    status: "running",
    lastTime: 0,
    pointerStartX: null,
    pointerStartY: null,
    lives: STARTING_LIVES,
    jumpUntil: 0,
    jumpCooldownUntil: 0,
  };
}

export function GameCanvas({ profile, ground, level }: GameCanvasProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const recoveryTimeoutRef = useRef<number | null>(null);
  const stateRef = useRef<LoopState>(createInitialState());
  const savedResultRef = useRef(false);
  const [canvasSize, setCanvasSize] = useState({ width: 360, height: 520 });
  const [status, setStatus] = useState<GameStatus>("running");
  const [score, setScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [result, setResult] = useState<GameResult | null>(null);

  const setGameStatus = useCallback((nextStatus: GameStatus) => {
    stateRef.current.status = nextStatus;
    setStatus(nextStatus);
  }, []);

  const resetGame = useCallback(() => {
    if (recoveryTimeoutRef.current) {
      window.clearTimeout(recoveryTimeoutRef.current);
      recoveryTimeoutRef.current = null;
    }

    savedResultRef.current = false;
    stateRef.current = createInitialState();
    setResult(null);
    setScore(0);
    setElapsed(0);
    setLives(STARTING_LIVES);
    setStatus("running");
  }, []);

  const moveLane = useCallback((direction: -1 | 1) => {
    const state = stateRef.current;
    if (state.status !== "running") {
      return;
    }

    state.targetLane = clamp(state.targetLane + direction, 0, LANE_COUNT - 1);
  }, []);

  const jumpCar = useCallback(() => {
    const state = stateRef.current;
    if (state.status !== "running" || state.elapsed < state.jumpCooldownUntil) {
      return;
    }

    state.jumpUntil = state.elapsed + JUMP_DURATION;
    state.jumpCooldownUntil = state.elapsed + JUMP_COOLDOWN;
  }, []);

  const finishGame = useCallback(
    (finishStatus: ResultStatus) => {
      if (savedResultRef.current) {
        return;
      }

      savedResultRef.current = true;
      const state = stateRef.current;
      const finalScore = Math.round(state.score);
      const finalTime = Number(state.elapsed.toFixed(1));

      saveGameResult({
        profile,
        ground,
        level,
        status: finishStatus,
        score: finalScore,
        timeSurvived: finalTime,
      });

      setGameStatus(finishStatus === "win" ? "won" : "lost");
      setResult({
        status: finishStatus,
        username: profile.username,
        ground,
        level: level.level,
        score: finalScore,
        timeSurvived: finalTime,
      });
      setScore(finalScore);
      setElapsed(finalTime);
    },
    [ground, level, profile, setGameStatus],
  );

  const spendChance = useCallback(() => {
    const state = stateRef.current;
    if (state.lives <= 1) {
      finishGame("game-over");
      return;
    }

    state.lives -= 1;
    state.status = "recovering";
    state.obstacles = [];
    state.spawnClock = -0.3;
    state.jumpUntil = 0;
    state.jumpCooldownUntil = state.elapsed + 0.35;
    state.targetLane = 1;
    state.carX = getLaneCenter(getRoad(canvasSize.width).x, getRoad(canvasSize.width).width, 1);
    state.lastTime = 0;
    setLives(state.lives);
    setStatus("recovering");

    if (recoveryTimeoutRef.current) {
      window.clearTimeout(recoveryTimeoutRef.current);
    }

    recoveryTimeoutRef.current = window.setTimeout(() => {
      const current = stateRef.current;
      if (current.status === "recovering") {
        current.status = "running";
        current.lastTime = 0;
        setStatus("running");
      }
      recoveryTimeoutRef.current = null;
    }, RECOVERY_DELAY_MS);
  }, [canvasSize.width, finishGame]);

  const togglePause = useCallback(() => {
    const state = stateRef.current;
    if (state.status === "running") {
      setGameStatus("paused");
      return;
    }

    if (state.status === "paused") {
      setGameStatus("running");
    }
  }, [setGameStatus]);

  useEffect(() => {
    resetGame();
  }, [ground.id, level.level, resetGame]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = Math.max(280, Math.floor(entry.contentRect.width));
      const height = Math.max(260, Math.floor(entry.contentRect.height));
      setCanvasSize({ width, height });
    });

    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        event.preventDefault();
        moveLane(-1);
      }

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        event.preventDefault();
        moveLane(1);
      }

      if (event.key === " ") {
        event.preventDefault();
        jumpCar();
      }

      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        togglePause();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jumpCar, moveLane, togglePause]);

  useEffect(() => {
    return () => {
      if (recoveryTimeoutRef.current) {
        window.clearTimeout(recoveryTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    const ctx = context;
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    function loop(time: number) {
      const state = stateRef.current;
      if (!state.lastTime) {
        state.lastTime = time;
      }

      const rawDelta = (time - state.lastTime) / 1000;
      const delta = Math.min(rawDelta, 0.04);
      state.lastTime = time;

      if (state.status === "running") {
        updateGame(state, delta, canvasSize.width, canvasSize.height, level);
        setScore(state.score);
        setElapsed(state.elapsed);

        if (hasPlayerCollision(state, canvasSize.width, canvasSize.height)) {
          spendChance();
        } else if (
          state.elapsed >= level.requiredSurvivalTime ||
          state.score >= level.winScoreTarget
        ) {
          finishGame("win");
        }
      }

      drawGame(ctx, state, canvasSize.width, canvasSize.height, ground, level);
      frameRef.current = window.requestAnimationFrame(loop);
    }

    frameRef.current = window.requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [canvasSize.height, canvasSize.width, finishGame, ground, level, spendChance]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <GameHUD
        elapsed={elapsed}
        ground={ground}
        level={level}
        lives={lives}
        onExit={() => router.push("/levels")}
        onPauseToggle={togglePause}
        profile={profile}
        score={score}
        status={status}
      />

      <div
        className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-white/10 bg-slate-950 shadow-2xl"
        ref={wrapRef}
      >
        <canvas
          className="h-full w-full touch-none"
          onPointerDown={(event) => {
            stateRef.current.pointerStartX = event.clientX;
            stateRef.current.pointerStartY = event.clientY;
          }}
          onPointerUp={(event) => {
            const startX = stateRef.current.pointerStartX;
            const startY = stateRef.current.pointerStartY;
            stateRef.current.pointerStartX = null;
            stateRef.current.pointerStartY = null;
            if (startX === null || startY === null) {
              return;
            }

            const delta = event.clientX - startX;
            const verticalDelta = event.clientY - startY;
            if (Math.abs(delta) > 28 && Math.abs(delta) > Math.abs(verticalDelta)) {
              moveLane(delta > 0 ? 1 : -1);
              return;
            }

            if (isPointerOnPlayer(event, canvasRef.current, stateRef.current, canvasSize)) {
              jumpCar();
            }
          }}
          ref={canvasRef}
        />
        {status === "paused" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55 backdrop-blur-sm">
            <div className="rounded-lg border border-white/10 bg-slate-950/90 px-6 py-4 text-center shadow-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">Paused</p>
              <p className="mt-1 text-white">Press P or tap Resume.</p>
            </div>
          </div>
        ) : null}
        {status === "recovering" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
            <div className="rounded-lg border border-cyan-200/20 bg-slate-950/90 px-6 py-4 text-center shadow-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">
                Chance Lost
              </p>
              <p className="mt-1 text-white">{lives} chances left. Restarting...</p>
            </div>
          </div>
        ) : null}
      </div>

      <TouchControls onLeft={() => moveLane(-1)} onRight={() => moveLane(1)} />

      <Modal open={Boolean(result)} title={result?.status === "win" ? "Race Won" : "Game Over"}>
        {result ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <ResultItem label="Username" value={result.username} />
              <ResultItem label="Ground" value={result.ground.name} />
              <ResultItem label="Level" value={String(result.level)} />
              <ResultItem label="Score" value={String(result.score)} />
              <ResultItem label="Time" value={`${result.timeSurvived}s`} />
              <ResultItem label="Status" value={result.status === "win" ? "Win" : "Game Over"} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button fullWidth onClick={resetGame}>
                Retry
              </Button>
              {result.status === "win" && result.level < 10 ? (
                <Button
                  fullWidth
                  onClick={() => router.push(`/game?level=${result.level + 1}`)}
                  variant="success"
                >
                  Next Level
                </Button>
              ) : null}
              <Button fullWidth onClick={() => router.push("/levels")} variant="secondary">
                Level Menu
              </Button>
              <Button fullWidth onClick={() => router.push("/")} variant="ghost">
                Home
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/[0.06] p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 truncate font-black text-white">{value}</p>
    </div>
  );
}

function updateGame(
  state: LoopState,
  delta: number,
  width: number,
  height: number,
  level: LevelConfig,
) {
  const road = getRoad(width);
  const targetX = getLaneCenter(road.x, road.width, state.targetLane);

  if (!state.carX) {
    state.carX = targetX;
  }

  state.carX += (targetX - state.carX) * clamp(delta * level.playerSpeed, 0, 1);
  state.elapsed += delta;
  state.score += delta * (12 + level.roadSpeed / 16) * level.scoreMultiplier;
  state.spawnClock += delta;

  const spawnRate = Math.max(0.42, level.obstacleSpawnRate);
  if (state.spawnClock >= spawnRate) {
    state.spawnClock = 0;
    spawnObstacles(state, road.width, level);
  }

  const obstacleSpeed = level.obstacleSpeed + level.roadSpeed * 0.15;
  state.obstacles = state.obstacles
    .map((obstacle) => ({
      ...obstacle,
      y: obstacle.y + obstacleSpeed * delta,
    }))
    .filter((obstacle) => obstacle.y < height + obstacle.height + 40);
}

function spawnObstacles(state: LoopState, roadWidth: number, level: LevelConfig) {
  const laneWidth = roadWidth / LANE_COUNT;
  const canSpawnPair = level.obstacleCount >= 3 && Math.random() > 0.55;
  const lanes = canSpawnPair ? [0, 2] : [chooseSingleObstacleLane(state)];

  lanes.forEach((lane, index) => {
    const type = level.obstacleTypes[Math.floor(Math.random() * level.obstacleTypes.length)];
    const size = getObstacleSize(type, laneWidth);
    state.obstacles.push({
      lane,
      type,
      width: size.width,
      height: size.height,
      y: -size.height - index * 96,
    });
  });
}

function chooseSingleObstacleLane(state: LoopState) {
  const recentBlockedLanes = new Set(
    state.obstacles.filter((obstacle) => obstacle.y < 160).map((obstacle) => obstacle.lane),
  );
  const candidates = [0, 1, 2].filter((lane) => !recentBlockedLanes.has(lane));
  const available = candidates.length ? candidates : [0, 1, 2];

  return available[Math.floor(Math.random() * available.length)];
}

function drawGame(
  context: CanvasRenderingContext2D,
  state: LoopState,
  width: number,
  height: number,
  ground: GroundConfig,
  level: LevelConfig,
) {
  const road = getRoad(width);
  const laneWidth = road.width / LANE_COUNT;

  context.clearRect(0, 0, width, height);
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#020617");
  gradient.addColorStop(0.5, "#0f172a");
  gradient.addColorStop(1, ground.accent);
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.fillStyle = "rgba(255, 255, 255, 0.05)";
  for (let i = 0; i < 14; i += 1) {
    const x = ((i * 97 + state.elapsed * 22) % (width + 120)) - 60;
    const y = (i * 71) % height;
    context.fillRect(x, y, 18, 2);
  }

  context.fillStyle = "rgba(15, 23, 42, 0.72)";
  context.fillRect(road.x - 18, 0, road.width + 36, height);
  context.fillStyle = ground.road;
  context.fillRect(road.x, 0, road.width, height);

  context.fillStyle = `${ground.accent}33`;
  context.fillRect(road.x - 6, 0, 4, height);
  context.fillRect(road.x + road.width + 2, 0, 4, height);

  context.save();
  context.strokeStyle = ground.lane;
  context.lineWidth = Math.max(2, width * 0.006);
  context.setLineDash([height * 0.08, height * 0.075]);
  context.lineDashOffset = -((state.elapsed * level.roadSpeed) % (height * 0.155));
  for (let lane = 1; lane < LANE_COUNT; lane += 1) {
    const x = road.x + laneWidth * lane;
    context.beginPath();
    context.moveTo(x, -height * 0.2);
    context.lineTo(x, height * 1.2);
    context.stroke();
  }
  context.restore();

  state.obstacles.forEach((obstacle) => {
    const x = getLaneCenter(road.x, road.width, obstacle.lane) - obstacle.width / 2;
    drawObstacle(context, x, obstacle.y, obstacle.width, obstacle.height, obstacle.type, ground);
  });

  const player = getPlayerRect(state, width, height);
  const jumpProgress = getJumpProgress(state);
  const jumpLift = Math.sin(jumpProgress * Math.PI) * Math.min(58, height * 0.11);
  drawPlayerShadow(context, player.x, player.y, player.width, player.height, jumpProgress);
  drawPlayerCar(
    context,
    player.x,
    player.y - jumpLift,
    player.width,
    player.height,
    ground,
    jumpProgress > 0,
  );

  const progressWidth = Math.min(1, state.score / level.winScoreTarget) * (width - 28);
  context.fillStyle = "rgba(255, 255, 255, 0.14)";
  roundRect(context, 14, 12, width - 28, 6, 3);
  context.fill();
  context.fillStyle = ground.accent;
  roundRect(context, 14, 12, progressWidth, 6, 3);
  context.fill();
}

function drawObstacle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  type: string,
  ground: GroundConfig,
) {
  if (type === "oil") {
    context.fillStyle = "rgba(2, 6, 23, 0.86)";
    context.beginPath();
    context.ellipse(x + width / 2, y + height / 2, width / 2, height / 2.4, 0, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = ground.accent;
    context.lineWidth = 2;
    context.stroke();
    return;
  }

  const fill = type === "truck" ? "#f97316" : type === "barrel" ? "#ef4444" : ground.obstacle;
  context.fillStyle = fill;
  roundRect(context, x, y, width, height, 8);
  context.fill();

  context.fillStyle = "rgba(15, 23, 42, 0.65)";
  roundRect(context, x + width * 0.18, y + height * 0.12, width * 0.64, height * 0.24, 5);
  context.fill();

  context.fillStyle = "rgba(255, 255, 255, 0.8)";
  context.fillRect(x + width * 0.14, y + height * 0.76, width * 0.18, height * 0.08);
  context.fillRect(x + width * 0.68, y + height * 0.76, width * 0.18, height * 0.08);
}

function drawPlayerCar(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  ground: GroundConfig,
  jumping: boolean,
) {
  context.save();
  if (jumping) {
    context.translate(x + width / 2, y + height / 2);
    context.scale(1.08, 1.08);
    context.translate(-(x + width / 2), -(y + height / 2));
  }

  context.shadowBlur = jumping ? 28 : 18;
  context.shadowColor = ground.accent;
  context.fillStyle = ground.accent;
  roundRect(context, x, y, width, height, 12);
  context.fill();
  context.shadowBlur = 0;

  context.fillStyle = "rgba(2, 6, 23, 0.78)";
  roundRect(context, x + width * 0.2, y + height * 0.14, width * 0.6, height * 0.26, 6);
  context.fill();

  context.fillStyle = "#0f172a";
  roundRect(context, x - width * 0.08, y + height * 0.18, width * 0.16, height * 0.22, 4);
  context.fill();
  roundRect(context, x + width * 0.92, y + height * 0.18, width * 0.16, height * 0.22, 4);
  context.fill();
  roundRect(context, x - width * 0.08, y + height * 0.64, width * 0.16, height * 0.22, 4);
  context.fill();
  roundRect(context, x + width * 0.92, y + height * 0.64, width * 0.16, height * 0.22, 4);
  context.fill();

  context.fillStyle = "rgba(255, 255, 255, 0.92)";
  context.fillRect(x + width * 0.18, y + height * 0.83, width * 0.2, height * 0.05);
  context.fillRect(x + width * 0.62, y + height * 0.83, width * 0.2, height * 0.05);
  context.restore();
}

function drawPlayerShadow(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  jumpProgress: number,
) {
  const opacity = 0.28 - jumpProgress * 0.16;
  const scale = 1 - jumpProgress * 0.22;
  context.fillStyle = `rgba(2, 6, 23, ${opacity})`;
  context.beginPath();
  context.ellipse(
    x + width / 2,
    y + height * 0.88,
    (width * scale) / 1.5,
    (height * scale) / 5,
    0,
    0,
    Math.PI * 2,
  );
  context.fill();
}

function getObstacleSize(type: string, laneWidth: number) {
  if (type === "truck") {
    return { width: laneWidth * 0.48, height: laneWidth * 1.08 };
  }

  if (type === "oil") {
    return { width: laneWidth * 0.54, height: laneWidth * 0.44 };
  }

  if (type === "barrel") {
    return { width: laneWidth * 0.42, height: laneWidth * 0.52 };
  }

  return { width: laneWidth * 0.46, height: laneWidth * 0.86 };
}

function hasPlayerCollision(state: LoopState, width: number, height: number) {
  if (state.elapsed < state.jumpUntil) {
    return false;
  }

  const road = getRoad(width);
  const player = getPlayerRect(state, width, height);
  const playerRect = shrinkRect(player, 8);

  return state.obstacles.some((obstacle) => {
    const obstacleRect = shrinkRect(
      {
        x: getLaneCenter(road.x, road.width, obstacle.lane) - obstacle.width / 2,
        y: obstacle.y,
        width: obstacle.width,
        height: obstacle.height,
      },
      6,
    );

    return rectsOverlap(playerRect, obstacleRect);
  });
}

function getRoad(width: number) {
  const roadWidth = Math.min(width * 0.78, 460);
  return {
    x: (width - roadWidth) / 2,
    width: roadWidth,
  };
}

function getLaneCenter(roadX: number, roadWidth: number, lane: number) {
  return roadX + (roadWidth / LANE_COUNT) * (lane + 0.5);
}

function getPlayerRect(state: LoopState, width: number, height: number) {
  const road = getRoad(width);
  const laneWidth = road.width / LANE_COUNT;
  const playerWidth = laneWidth * 0.48;
  const playerHeight = laneWidth * 0.92;
  const fallbackX = getLaneCenter(road.x, road.width, state.targetLane);
  const carX = state.carX || fallbackX;

  return {
    x: carX - playerWidth / 2,
    y: height - playerHeight - Math.max(18, height * 0.035),
    width: playerWidth,
    height: playerHeight,
  };
}

function getJumpProgress(state: LoopState) {
  if (state.elapsed >= state.jumpUntil) {
    return 0;
  }

  const jumpStart = state.jumpUntil - JUMP_DURATION;
  return clamp((state.elapsed - jumpStart) / JUMP_DURATION, 0, 1);
}

function isPointerOnPlayer(
  event: PointerEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement | null,
  state: LoopState,
  canvasSize: { width: number; height: number },
) {
  if (!canvas) {
    return false;
  }

  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * canvasSize.width;
  const y = ((event.clientY - rect.top) / rect.height) * canvasSize.height;
  const player = getPlayerRect(state, canvasSize.width, canvasSize.height);
  const tapArea = {
    x: player.x - player.width * 0.45,
    y: player.y - player.height * 0.35,
    width: player.width * 1.9,
    height: player.height * 1.7,
  };

  return (
    x >= tapArea.x &&
    x <= tapArea.x + tapArea.width &&
    y >= tapArea.y &&
    y <= tapArea.y + tapArea.height
  );
}

function shrinkRect<T extends { x: number; y: number; width: number; height: number }>(
  rect: T,
  amount: number,
) {
  return {
    x: rect.x + amount,
    y: rect.y + amount,
    width: Math.max(0, rect.width - amount * 2),
    height: Math.max(0, rect.height - amount * 2),
  };
}

function rectsOverlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}
