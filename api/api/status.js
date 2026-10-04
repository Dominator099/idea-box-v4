const { hasDb, hasPasscode, envNames } = require('./_redis');

module.exports = async (req, res) => {
  if (!hasDb()) return res.status(200).json({ db: false, passcode: false, reason: 'no-keys', seen: envNames() });
  try {
    res.status(200).json({ db: true, passcode: await hasPasscode() });
  } catch (e) {
    res.status(200).json({ db: false, passcode: false, reason: 'error', detail: String((e && e.message) || e).slice(0, 200) });
  }
};
