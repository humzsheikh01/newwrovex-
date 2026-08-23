# Rovex Trading

Rovex Trading is an OHLCV-based browser paper-trading and bar-replay simulator. It is not a broker, exchange, tick reconstruction tool, or source of historical order flow.

## Installation

```bash
npm install
npm run dev
```

The browser application uses `/api/market/yahoo`; that serverless endpoint is available when deployed to Vercel. If data cannot be loaded locally, the interface offers an explicitly marked **DEMO DATA** fallback for UI/replay testing only.

## Production

```bash
npm run build
npm run preview
```

## Vercel deployment

1. Push this directory to GitHub.
2. In Vercel, import the repository and select **Vite**.
3. Use build command `npm run build` and output directory `dist`.
4. Optionally add `ALPHA_VANTAGE_API_KEY` from `.env.example` in Vercel Environment Variables.
5. Deploy. The `api/market/*` functions proxy provider requests so keys never enter browser code.

Yahoo is the primary source; Alpha Vantage is an optional daily-data fallback route; Hyperliquid supports public crypto candles. Provider coverage and availability vary. Unsupported order-flow, footprint, depth, seconds, tick, and Renko views are deliberately not simulated.

## Simulation rules

Paper trades enter at the visible candle close. For OHLC bars touching both a TP and SL, the deterministic protective rule is applied: **SL is checked first**, then TP. This does not claim intrabar/tick accuracy. Trade state, settings, bookmarks, and drawings are stored locally under `rovex-trading:v1`.
