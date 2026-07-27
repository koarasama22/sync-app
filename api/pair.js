let pairs = {};

const EXPIRE_TIME = 60 * 1000;

export default function handler(req, res) {
  if (req.method === "POST") {
    const { pairId, action } = req.body;

    if (action === "create") {
      const newId = Math.random().toString(36).substring(2, 8);

      pairs[newId] = {
        accepted: false,
        createdAt: Date.now()
      };

      return res.json({ pairId: newId });
    }

    if (!pairs[pairId]) {
      return res.status(404).json({ error: "invalid id" });
    }

    const pair = pairs[pairId];

    if (Date.now() - pair.createdAt > EXPIRE_TIME) {
      delete pairs[pairId];
      return res.status(410).json({ error: "expired" });
    }

    if (action === "request") {
      pair.accepted = false;
      return res.json({ status: "requested" });
    }

    if (action === "accept") {
      pair.accepted = true;
      return res.json({ status: "accepted" });
    }
  }

  if (req.method === "GET") {
    const { pairId } = req.query;

    const pair = pairs[pairId];

    if (!pair) {
      return res.json({ accepted: false, expired: true });
    }

    if (Date.now() - pair.createdAt > EXPIRE_TIME) {
      delete pairs[pairId];
      return res.json({ accepted: false, expired: true });
    }

    return res.json({
      accepted: pair.accepted,
      expired: false
    });
  }
}
