# Repository Guidelines

## Project Structure & Module Organization
Nine Forum uses the Next.js 15 App Router with all source under `src`. Page routes, server components, and layouts live in `src/app`. Shared UI is grouped in `src/components`, API and WebSocket helpers sit in `src/axios`, business logic and utilities go in `src/func`, and shared contracts belong in `src/types`. Static assets (avatars, icons, Live2D models) live in `public`, while configuration (ESLint, Tailwind, TS) is at the repo root. Keep new modules close to the feature they support to preserve the current vertical-slice structure.

## Build, Test, and Development Commands
- `pnpm dev`: Launches the Turbopack-powered dev server at `localhost:3000` with fast refresh.
- `pnpm build`: Produces an optimized production bundle; linting is skipped, so run `pnpm lint` first.
- `pnpm start`: Serves the build on port 80, matching the deployment target.
- `pnpm lint`: Runs the flat ESLint config (`next/core-web-vitals` + TypeScript) across the repo.
Stick to `pnpm` to avoid lockfile churn; `npm` or `yarn` should only be used for quick experiments.

## Coding Style & Naming Conventions
Code is TypeScript-first; prefer React Server Components unless client state or browser APIs are needed, and mark client modules with `"use client"`. Use PascalCase filenames for components, camelCase for hooks/utility functions, and suffix hooks with `use`. Keep modules under 200 lines and colocate styles/assets with their component when practical. ESLint enforces the Next.js Core Web Vitals ruleset—treat warnings as failures and auto-fix before committing. Follow existing import grouping: React/Next, third-party UI (Ant Design/GSAP), then local aliases.

## Testing Guidelines
There is no dedicated test runner yet, so every change must at least pass `pnpm lint` and manual smoke tests through `pnpm dev`. When adding automated coverage, colocate `*.test.ts(x)` files beside the implementation or in `src/__tests__`, use Testing Library for components, and favor Vitest or Jest with jsdom so suites can be wired into a future `pnpm test` script. Name tests after the scenario being protected (e.g., `ThreadList.test.tsx` > `renders unread badge when ...`) and document any new fixtures in the PR.

## Commit & Pull Request Guidelines
Follow Conventional Commits as seen in history (`feat(chat): ...`, `chore(nohup): ...`). Scope names should match directories (`chat`, `security`, `config`), and messages can be multilingual as long as the first line stays concise. Each PR should include: a synopsis of the change, screenshots or screen captures for UI updates, reproduction steps for bug fixes, a checklist of commands run (`pnpm lint`, local smoke tests), and links to any related issues or discussion threads. Keep PRs small enough for a <15 minute review.

## Security & Configuration Tips
Secrets for LangChain, STOMP brokers, and upstream APIs must be stored in `.env.local`; prefix client-exposed keys with `NEXT_PUBLIC_` and keep server-only values unprefixed. Do not commit `.env*` files or downloaded AI assets—add new patterns to `.gitignore` if needed. When touching auth or messaging code, validate that no PII is logged and that axios clients continue to read URLs from env variables rather than literals.
