export default async function handler(req, res) {
  const coin = String(req.query.coin || 'BTC').toUpperCase(); if (!/^[A-Z]{2,10}$/.test(coin)) return res.status(400).json({ error: 'Invalid coin' });
  try { const r = await fetch('https://api.hyperliquid.xyz/info', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ type:'candleSnapshot', req:{ coin, interval:req.query.tf || '1h', startTime: Date.now()-90*86400000, endTime:Date.now() } }) }); const rows = await r.json(); if (!Array.isArray(rows)) throw new Error('Malformed Hyperliquid response'); res.status(200).json({ symbol:coin, bars:rows.map(x=>({ time:Math.floor(x.t/1000), open:+x.o, high:+x.h, low:+x.l, close:+x.c, volume:+x.v })) }); } catch (e) { res.status(502).json({ error:e.message }); }
}
