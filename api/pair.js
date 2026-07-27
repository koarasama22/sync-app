// メモリ保存（簡易）
// ※Vercelでは永続化されない（本番はDB必須）
const store = {};

// 定期クリーン（期限切れ削除）
function cleanup() {
  const now = Date.now();
  for (const code in store) {
    if (now - store[code].created > 30000) {
      delete store[code];
    }
  }
}

export default function handler(req, res) {
  cleanup();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { action, code } = req.body;

    // =========================
    // コード生成
    // =========================
    if (action === "generate") {
      const newCode = Math.random().toString(36).substring(2, 8);

      store[newCode] = {
        created: Date.now(),
        requested: false,
        approved: false
      };

      return res.status(200).json({ code: newCode });
    }

    // =========================
    // 接続申請
    // =========================
    if (action === "request") {
      if (!code || !store[code]) {
        return res.status(200).json({
          ok: false,
          message: "無効または期限切れコード"
        });
      }

      store[code].requested = true;

      return res.status(200).json({
        ok: true,
        message: "申請送信"
      });
    }

    // =========================
    // 承認
    // =========================
    if (action === "approve") {
      if (!code || !store[code]) {
        return res.status(200).json({ ok: false });
      }

      // 申請が来てない場合は承認不可
      if (!store[code].requested) {
        return res.status(200).json({
          ok: false,
          message: "申請がまだ来ていません"
        });
      }

      store[code].approved = true;

      return res.status(200).json({
        ok: true,
        message: "承認完了"
      });
    }

    // =========================
    // 状態チェック
    // =========================
    if (action === "check") {
      if (!code || !store[code]) {
        return res.status(200).json({
          ok: false,
          message: "コード無効"
        });
      }

      return res.status(200).json({
        ok: true,
        requested: store[code].requested,
        approved: store[code].approved
      });
    }

    // =========================
    // 不明アクション
    // =========================
    return res.status(400).json({
      error: "Invalid action"
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      detail: err.message
    });
  }
}
