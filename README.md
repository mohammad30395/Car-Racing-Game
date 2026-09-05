# Apex Lane - Car Racing Game

Apex Lane is a browser-based car racing game built with Next.js, React, TypeScript, and Tailwind CSS. The game runs fully on the frontend: players create a local profile, choose a racing ground, unlock levels, avoid obstacles, and save scores in the browser with `localStorage`.

## Overview

The project is designed as a polished single-player racing experience with multiple screens for player setup, ground selection, level progression, gameplay, rules, settings, and leaderboard history. It does not require a backend or external database.

Players start at level 1, race through increasingly difficult challenges, and unlock the next level by winning the current one. Progress is tied to the saved username in the same browser.

## Features

- Canvas-based racing gameplay
- Three-lane road movement with obstacle avoidance
- Keyboard and touch-friendly controls
- Jump action with cooldown
- Three chances per race
- 10 progressive difficulty levels
- 5 selectable racing grounds:
  - City Road
  - Desert Highway
  - Snow Track
  - Neon Night
  - Forest Road
- Local player profile
- Per-user level unlocks and best scores
- Browser-only leaderboard
- Settings page for profile updates, progress reset, and clearing all saved data
- Responsive UI built with reusable components

## Tech Stack

- [Next.js](https://nextjs.org/) app router
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- HTML Canvas for the core game loop and rendering
- Browser `localStorage` for profiles, progress, records, and leaderboard data

## Getting Started

### Prerequisites

Install Node.js and npm before running the project.

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

### Type Checking

```bash
npm run typecheck
```

## How to Play

1. Create or update your player profile.
2. Choose a racing ground.
3. Select an unlocked level.
4. Dodge obstacles and survive until the required time or score target is reached.
5. Win a level to unlock the next one for the current username.

## Controls

| Action | Desktop | Mobile |
| --- | --- | --- |
| Move left | `ArrowLeft` or `A` | Left touch button |
| Move right | `ArrowRight` or `D` | Right touch button |
| Jump | `Space` or click the car | Tap the car |
| Pause | `P` | Pause button in the game UI |

## Game Rules

- Each race starts with 3 chances.
- Crashing into an obstacle uses one chance.
- If chances remain, the road briefly resets and the race continues.
- The race ends when all chances are used.
- A level is won by surviving the required time or reaching the score target.
- Score increases over time and scales with the level multiplier.
- Winning a level unlocks the next level for the current username only.

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page and main navigation |
| `/player` | Create or edit the player profile |
| `/grounds` | Choose the racing ground |
| `/levels` | Select an unlocked level |
| `/game?level=1` | Start a race for a selected level |
| `/rules` | View gameplay rules and controls |
| `/leaderboard` | View saved local race records |
| `/settings` | Update profile, reset progress, or clear local game data |

## Project Structure

```text
app/
  game/             Game route
  grounds/          Ground selection page
  leaderboard/      Local leaderboard page
  levels/           Level selection page
  player/           Player profile page
  rules/            Rules page
  settings/         Settings page
components/
  game/             Canvas game, HUD, and touch controls
  layout/           Shared layout and navigation
  ui/               Reusable UI primitives
hooks/              Local React hooks
lib/                Game configuration, storage, grounds, and utilities
types/              Shared TypeScript game types
```

## Data Storage

This project stores game data in the browser using `localStorage`. The saved data includes:

- Current player profile
- Selected ground
- Per-username level progress
- Best scores
- Race records
- Leaderboard entries

Because there is no backend, saved progress is specific to the current browser and device. Clearing browser storage or using another browser will not carry over saved results.

## Configuration

Core game settings live in:

- `lib/gameConfig.ts` for level difficulty, scoring targets, obstacle behavior, and win conditions
- `lib/grounds.ts` for available grounds, colors, descriptions, and difficulty labels
- `lib/storage.ts` for local profile, progress, records, and leaderboard persistence

## Notes for Contributors

- Keep gameplay constants centralized in `lib/gameConfig.ts` when changing level balance.
- Add new grounds through `lib/grounds.ts`.
- Keep saved data keys under the existing `carGame_` prefix in `lib/storage.ts`.
- Run `npm run typecheck` before submitting changes.

## License

This repository does not currently include a license file. Add one before distributing or reusing the project publicly.
