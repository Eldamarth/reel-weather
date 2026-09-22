# Reel Weather

A weather consensus app for anglers: instead of showing one forecast, it compares several independent
weather models for your location and time, and tells you not just _what_ they predict but _how much they
agree_ — because conflicting forecasts, not a lack of forecasts, is usually the real problem. It also turns
the resulting conditions into a quick lure-color suggestion, since that's the whole reason this exists.

**Live app:** https://eldamarth.github.io/reel-weather/

## What it does

- **Multi-model consensus.** Pulls hourly forecasts from several [Open-Meteo](https://open-meteo.com/)
  weather models for your location (which models, depends on region and forecast horizon — a short-range
  model like HRRR only exists for the continental US, for example) and combines them into one forecast
  using medians and circular means, not naive averaging.
- **Model agreement, not false confidence.** A headline agreement score (and a "most disagreement:
  precipitation"-style breakdown) shows when the models are actually arguing with each other, so a shaky
  forecast doesn't get presented with the same confidence as a solid one.
- **Hazard flags that don't get averaged away.** If one model out of six calls for thunderstorms while the
  rest say clear, that signal is surfaced directly — it doesn't get smoothed into an unremarkable "mostly
  clear" number.
- **An hourly timeline** covering the full fetched range (not just "now"), with per-hour agreement
  visible before you even tap into it.
- **A lure-color recommender**, built on an evidence-reviewed visual-strategy model (water clarity as the
  dominant input, light as a property modifier, not a hue selector) rather than folklore color rules —
  see `src/config/fishingRules.ts` for the reasoning.
- Runs entirely client-side: no backend, no accounts, no database. Deployed as a static site.

## Tech stack

React 19 + TypeScript + Vite, tested with Vitest + React Testing Library, linted with ESLint + Prettier.
Weather data and geocoding come from Open-Meteo's free API. Deployed to GitHub Pages via GitHub Actions.

## Getting started

Requires Node 20+ (developed against Node 24) and npm.

```bash
npm install
npm run dev
```

Open the printed local URL. Location search and the hourly timeline work immediately; "Use my location"
requires a secure context (HTTPS, or localhost) — that's true of the deployed app too.

### Scripts

| Command                | Does                                               |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server                          |
| `npm run build`        | Type-check, then build for production into `dist/` |
| `npm run preview`      | Serve the production build locally                 |
| `npm test`             | Run the test suite once                            |
| `npm run test:watch`   | Run tests in watch mode                            |
| `npm run lint`         | ESLint                                             |
| `npm run format`       | Prettier, writes changes                           |
| `npm run format:check` | Prettier, check only (used in CI)                  |

## Project structure

```
src/
├── api/          Open-Meteo forecast + geocoding adapters (fetch, parse, normalize)
├── weather/      Pure domain logic: consensus, agreement scoring, hazard flags,
│                 condition/icon mapping, unit conversion, time formatting
├── fishing/      Lure-color visual-strategy engine (clarity/light -> strategy -> colors)
├── config/       Tunable constants: model registry, agreement thresholds, fishing rules
├── hooks/        React state: forecast fetching, geolocation, saved locations, unit preference
├── components/   UI, including components/icons/ (hand-authored weather condition SVGs)
└── styles/       Global CSS custom properties (color/spacing/type tokens)
```

The `weather/` and `fishing/` layers are pure functions with no React or fetch dependency — they're
unit-tested directly against fixtures, independent of the UI.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which lints, tests, builds, and deploys to
GitHub Pages automatically. The app is built with `base: '/reel-weather/'` (see `vite.config.ts`) to match
its GitHub Pages project-site path — if you fork this under a different repo name, update that base path.

## Testing

The domain logic (consensus math, agreement scoring, the fishing rules engine, model selection) is built
test-first: fixtures and edge cases are written before the implementation, particularly for anything with
real failure modes worth locking down (the Open-Meteo provider's handling of unavailable models, property
clamping in the lure-color engine, etc.). UI components are tested with React Testing Library, exercising
real user interactions rather than implementation details.
