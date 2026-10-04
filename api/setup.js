const { hasDb, setPasscode } = require('./_redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  if (!hasDb()) return res.status(500).json({ error: 'no-db' });
  const code = String((req.body || {}).code || '');
  if (code.length < 6 || code.length > 100) return res.status(400).json({ error: 'length' });
  try {
    const created = await setPasscode(code);
    if (!created) return res.status(409).json({ error: 'already-set' });
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'storage' });
  }
};
