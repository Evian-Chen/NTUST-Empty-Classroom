const express = require("express");
const router = express.Router();
const utils = require("../utils");

const model = require("../models");

router.get("/:roomKey", async (req, res) => {
  try {
    const { roomKey } = req.params;
    const { weekday } = req.query;

    // 檢查 roomKey
    if (
      !["EE", "T4", "T3", "TR", "IB", "E1", "E2", "MA"].includes(
        roomKey.split("-")[0]
      )
    ) {
      return res.status(400).json({ message: "請輸入正確的大樓" });
    }

    // 處理 weekday
    let targetDate;
    let targetWeekday;

    if (weekday) {
      try {
        const weekdayResult = utils.getWeekday(weekday);
        targetWeekday = weekdayResult.targetWeekday;
        targetDate = weekdayResult.targetDate;
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }

    const query = {
      buildingCode: roomKey.split("-")[0],
      roomNumber: roomKey.split("-")[1],
    };

    if (targetWeekday) {
      query.weekday = targetWeekday;
    }
    const result = await model.course.find(query);
    res.status(200).json(result);
  } catch (err) {
    console.log(`room detail error: ${err}`);
    res.status(500).json({ message: "error occured at backend" });
  }
});

module.exports = router;
