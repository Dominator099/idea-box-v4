const { cmd, hasDb, isAdmin } = require('./_redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  if (!hasDb()) return res.status(500).json({ error: 'no-db' });
  try {
    if (!(await isAdmin(req))) return res.status(401).json({ error: 'wrong passcode' });
    const id = String((req.body || {}).id || '');
    const rows = (await cmd('LRANGE', 'ideas', 0, -1)) || [];
    const hit = rows.find((r) => JSON.parse(r).id === id);
    if (hit) await cmd('LREM', 'ideas', 1, hit);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'storage' });
  }
};
