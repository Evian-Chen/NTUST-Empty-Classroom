var express = require("express");
var router = express.Router();

const model = require("../models");

router.post("/", async (req, res) => {
  try {
    await model.visit.create({
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      timestamp: new Date(),
    });
    res.status(200).json({ message: "Visit logged." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const stats = await model.visit.countDocuments();
    res.status(200).json({ message: "get stats succeffully", total: stats });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
