const VALID_TF = { '1m': ['1m', '7d'], '5m': ['5m', '60d'], '15m': ['15m', '60d'], '1h': ['1h', '730d'], '4h': ['1h', '730d'], '1d': ['1d', '5y'], '1w': ['1wk', '10y'] };
export default async function handler(req, res) {
  const symbol = String(req.query.symbol || 'AAPL').toUpperCase(); const tf = req.query.tf || '1d';
  if (!/^[A-Z0-9.\-^]{1,15}$/.test(symbol) || !VALID_TF[tf]) return res.status(400).json({ error: 'Invalid symbol or timeframe' });
  try {
    const [interval, range] = VALID_TF[tf]; const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=${range}&includePrePost=false`);
    if (!response.ok) throw new Error(`Yahoo returned ${response.status}`);
    const json = await response.json(); const result = json.chart?.result?.[0]; if (!result?.timestamp) throw new Error(json.chart?.error?.description || 'Empty dataset');
    const q = result.indicators.quote[0]; let bars = result.timestamp.map((time, i) => ({ time, open: q.open[i], high: q.high[i], low: q.low[i], close: q.close[i], volume: q.volume[i] || 0 })).filter(b => Object.values(b).every(v => v !== null && Number.isFinite(v)));
    if (tf === '4h') bars = bars.filter((_, i) => i % 4 === 0).map((b, i, a) => ({ ...b, high: Math.max(...a.slice(i, i + 4).map(x => x.high)), low: Math.min(...a.slice(i, i + 4).map(x => x.low)), close: a[Math.min(i + 3, a.length - 1)].close, volume: a.slice(i, i + 4).reduce((s, x) => s + x.volume, 0) }));
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300'); res.status(200).json({ symbol, bars });
  } catch (error) { res.status(502).json({ error: error.message || 'Market data unavailable' }); }
}
