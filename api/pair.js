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
  }

  if (req.method === "GET") {
    const { pairId } = req.query;

    const pair = pairs[pairId];

    return res.json({
      accepted: pair ? pair.accepted : false
    });
  }
}
