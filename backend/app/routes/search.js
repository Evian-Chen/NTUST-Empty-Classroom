var express = require("express");
var router = express.Router();

const model = require("../models");

router.post("/", async (req, res) => {
  try {
    await model.search.create({
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      timestamp: new Date(),
    });
    console.log(`Logged search from IP: ${req.ip}`);
    res.status(200).json({ message: "Search logged." });
  } catch (err) {
    console.log(`fetching error: ${err}`);
    res.status(500).json({ message: "Server error." });
  }
});

router.get("/count", async (req, res) => {
  try {
    const stats = await model.search.countDocuments();
    console.log(`Total searches: ${stats}`);
    res.status(200).json({ message: "get stats succeffully", total: stats });
  } catch (err) {
    console.log(`fetching error: ${err}`);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
