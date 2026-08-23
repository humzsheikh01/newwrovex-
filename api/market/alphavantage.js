export default async function handler(req, res) {
  if (!process.env.ALPHA_VANTAGE_API_KEY) return res.status(503).json({ error: 'ALPHA_VANTAGE_API_KEY is not configured' });
  const symbol = String(req.query.symbol || '').toUpperCase(); if (!/^[A-Z0-9.\-]{1,15}$/.test(symbol)) return res.status(400).json({ error: 'Invalid symbol' });
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&outputsize=full&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
  const body = await (await fetch(url)).json(); const series = body['Time Series (Daily)']; if (!series) return res.status(502).json({ error: body.Note || body['Error Message'] || 'Malformed Alpha Vantage response' });
  const bars = Object.entries(series).map(([date, v]) => ({ time: Math.floor(new Date(date + 'T00:00:00Z').getTime()/1000), open:+v['1. open'], high:+v['2. high'], low:+v['3. low'], close:+v['4. close'], volume:+v['5. volume'] })).reverse(); res.status(200).json({ symbol, bars });
}
