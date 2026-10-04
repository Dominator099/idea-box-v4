const { cmd, hasDb } = require('./_redis');
const COLORS = ['#FBF6E4', '#CFE3C4', '#9CC58F', '#6FA270', '#E9DDB8'];

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  if (!hasDb()) return res.status(500).json({ error: 'no-db' });
  const b = req.body || {};
  const text = String(b.text || '').trim().slice(0, 500);
  if (!text) return res.status(400).json({ error: 'empty' });
  const color = COLORS.includes(b.color) ? b.color : COLORS[0];
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  try {
    // Only the text, colour and time are stored. Nothing that identifies the sender.
    await cmd('LPUSH', 'ideas', JSON.stringify({ id, text, color, ts: Date.now() }));
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'storage' });
  }
};
