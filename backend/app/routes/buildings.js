const express = require("express");
const router = express.Router();

const model = require("../models");

router.get("/", async (req, res) => {
  try {
    allBuildings = await model.building.find(
      {},
      { buildingCode: 1, name: 1, _id: 0 }
    );
    res.json({ items: allBuildings, total: allBuildings.length });
  } catch (err) {
    console.log(`fetching error: ${err}`);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
