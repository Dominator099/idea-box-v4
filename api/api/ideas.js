const { cmd, hasDb, isAdmin } = require('./_redis');

module.exports = async (req, res) => {
  if (!hasDb()) return res.status(500).json({ error: 'no-db' });
  try {
    if (!(await isAdmin(req))) return res.status(401).json({ error: 'wrong passcode' });
    const rows = (await cmd('LRANGE', 'ideas', 0, -1)) || [];
    res.status(200).json({ ideas: rows.map((r) => JSON.parse(r)) });
  } catch (e) {
    res.status(500).json({ error: 'storage' });
  }
};
