let pairs = {};

export default function handler(req, res) {
  if (req.method === "POST") {
    const { pairId, action } = req.body;

    if (!pairs[pairId]) {
      pairs[pairId] = { accepted: false };
    }

    if (action === "request") {
      pairs[pairId].accepted = false;
      return res.json({ status: "requested" });
    }

    if (action === "accept") {
      pairs[pairId].accepted = true;
      return res.json({ status: "accepted" });
    }

    if (action === "send") {
      if (!pairs[pairId]?.accepted) {
        return res.status(403).json({ error: "not connected" });
      }

      return res.json({ status: "file received" });
    }
  }

  if (req.method === "GET") {
    const { pairId } = req.query;

    const pair = pairs[pairId];

    if (!pair) {
      return res.json({ accepted: false });
    }

    return res.json({ accepted: pair.accepted });
  }
}
