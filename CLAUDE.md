# Skill Health Checker

## Project Overview
Web app where users paste a GitHub link to a tessl skill and instantly see their eval score + actionable improvement guidance.

## Tech Stack
- Next.js (App Router) with TypeScript
- Tailwind CSS v4 (dark theme, monochrome)
- Geist fonts (sans + mono)
- Deployed on Vercel

## Conventions
- All components in `src/components/`
- All utility/lib code in `src/lib/`
- Custom hooks in `src/hooks/`
- API routes in `src/app/api/`
- Use `execFile` (never `exec`) for spawning CLI processes
- Strict input validation on all API endpoints
- `TESSL_TOKEN` is a server-only secret — never expose to the client

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint check
