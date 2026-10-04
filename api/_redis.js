const crypto = require('crypto');

// Finds the database keys even if Vercel gave them a prefix.
function find(suffixes) {
  for (const k of Object.keys(process.env)) {
    if (process.env[k] && suffixes.some((s) => k.endsWith(s))) return process.env[k];
  }
}
const URL_ = find(['KV_REST_API_URL', 'UPSTASH_REDIS_REST_URL']);
const TOKEN = find(['KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_TOKEN']);
const hasDb = () => !!(URL_ && TOKEN);
const envNames = () => Object.keys(process.env).filter((k) => /KV|REDIS|UPSTASH|STORAGE/i.test(k));

async function cmd(...args) {
  const r = await fetch(URL_, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

const KEY = 'admin:passcode';
const hash = (code, salt) => crypto.scryptSync(code, salt, 32).toString('hex');

async function hasPasscode() {
  return !!(await cmd('GET', KEY));
}

// SET ... NX only writes if nothing is stored yet, so the passcode can be created once, ever.
async function setPasscode(code) {
  const salt = crypto.randomBytes(16).toString('hex');
  return (await cmd('SET', KEY, salt + ':' + hash(code, salt), 'NX')) === 'OK';
}

async function isAdmin(req) {
  const code = String(req.headers['x-admin-code'] || '');
  if (!code) return false;
  const stored = await cmd('GET', KEY);
  if (!stored) return false;
  const [salt, h] = stored.split(':');
  const a = Buffer.from(hash(code, salt), 'hex');
  const b = Buffer.from(h, 'hex');
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) await new Promise((r) => setTimeout(r, 500));
  return ok;
}

module.exports = { cmd, hasDb, envNames, hasPasscode, setPasscode, isAdmin };
