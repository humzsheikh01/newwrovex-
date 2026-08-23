# Rovex Trading — Developer Guide

## Overview
Rovex Trading is a Vite + React 18 trading terminal for OHLCV bar replay, technical analysis, paper trading, and browser-local backtesting. It is designed for Vercel; there is no database, authentication, conventional server, or client-side secret.

## Commands
`npm install`, `npm run dev`, `npm run build`, and `npm run preview` are the supported workflows. Vercel uses `npm run build` and serves `dist` with the functions in `api/`.

## Architecture
- `src/App.jsx`: composition, UI state, keyboard commands, replay and session interactions.
- `src/components/Chart.jsx`: stable Lightweight Charts instance and imperative series updates.
- `src/trading/engine.js`: one canonical P&L, close-trigger, and statistic implementation.
- `src/indicators/calc.js`: OHLCV indicator calculations.
- `src/data/demo.js`: explicitly labeled offline demo data—not market data.
- `src/lib/storage.js`: resilient versioned LocalStorage schema (`rovex-trading:v1`).
- `api/market/`: serverless provider proxies. Validate all query input and never expose keys.

## Market data and security
Yahoo is the primary route; Alpha Vantage reads `ALPHA_VANTAGE_API_KEY` only on the Vercel function. Hyperliquid is for public crypto candles. Do not add arbitrary URL fetching. Provider errors must be displayed; never quietly substitute demo bars.

## Replay and trading
The original bar list is retained; `visible` is derived up to `replay.index`. Trades execute at current bar close. `closeTriggered` checks SL before TP when both can be reached in one OHLC bar—an intentional deterministic limitation, not tick-level reconstruction. Future intrabar animation should update a temporary final candle through `requestAnimationFrame` without mutating source bars.

## Indicators and drawings
EMA, VWAP and Bollinger lines are chart overlays. RSI/MACD/volume/S&R are selectable UI architecture points for expanded pane support. Drawings are stateful and stored locally; chart overlays currently render horizontal levels. Do not present OHLCV as order flow. Footprint, volume delta, DOM/depth, tick/seconds and Renko require a supporting source and must say unavailable when one is absent.

## Conventions
Use small pure utility functions, React hooks for orchestration, refs for chart APIs, accessible labels, and the dark Rovex visual language. Persist settings defensively. Keep browser code free of Node APIs. Product branding is always **Rovex Trading**.
