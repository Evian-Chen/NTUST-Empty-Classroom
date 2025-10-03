const express = require("express");
const router = express.Router();

// 簡單的按讚功能
let likes = 42; // 初始值

router.get("/likes", (req, res) => {
  res.json({ likesTotal: likes });
});

router.post("/like", (req, res) => {
  likes += 1;
  res.json({ likesTotal: likes });
});

module.exports = router;
