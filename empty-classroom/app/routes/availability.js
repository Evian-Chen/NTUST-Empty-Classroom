const express = require("express");
const router = express.Router();
const utils = require("../utils");

const model = require("../models");

router.get("/", async (req, res) => {
  try {
    const { building, date, slotFrom, slotTo } = req.query; // T4 2025-10-04 1 3
    const dateTime = date;

    // 參數檢查
    if (
      (slotFrom && slotTo && slotFrom > slotTo) ||
      (!slotFrom && slotTo) ||
      (!slotTo && slotFrom)
    ) {
      return res.status(400).json({ message: "請輸入正確的節次" });
    }
    const dateCheckResult = utils.dateCheck(dateTime);
    if (!dateCheckResult.valid) {
      return res.status(400).json({ message: dateCheckResult.message });
    }

    // 建立查詢條件
    let query = {};
    if (building) {
      query.buildingCode = building;
    }
    const targetDate = new Date(dateTime);
    query.dateTime = targetDate;
    if (slotFrom && slotTo) {
      query.timeSlotNo = { $gte: parseInt(slotFrom), $lte: parseInt(slotTo) };
    } else if (slotFrom) {
      query.timeSlotNo = { $gte: parseInt(slotFrom) };
    } else if (slotTo) {
      query.timeSlotNo = { $lte: parseInt(slotTo) };
    }
    // 照理來說，如果時間段合法，那應該都要查得到東西
    // 如果是空的，professor和course是空字串
    const result = await model.course.find(query);
    res.status(200).json(result);
  } catch (err) {
    console.log(`availability error: ${err}`);
    res.status(500).json({ message: "error occured at backend" });
  }
});

// TODO:
// buildingForm -> Date 改成 week
// RoomForm -> Date 改成 week
// week 不要有週六週日
router.get("/week", async (req, res) => {
  try {
    const { weekday, slotFrom, slotTo } = req.query;
    res.status(200).json({ message: "testing" });
  } catch (err) {
    console.log(`availability error: ${err}`);
    res.status(500).json({ message: "error occured at backend" });
  }
});

module.exports = router;
