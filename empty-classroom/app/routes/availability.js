const express = require("express");
const router = express.Router();
const utils = require("../utils");

const model = require("../models");

router.get("/", async (req, res) => {
  try {
    const { building, weekday, slotFrom, slotTo } = req.query;
    console.log(`Received params:`, { building, weekday, slotFrom, slotTo });

    // 參數檢查
    if (
      (slotFrom && slotTo && slotFrom > slotTo) ||
      (!slotFrom && slotTo) ||
      (!slotTo && slotFrom)
    ) {
      return res.status(400).json({ message: "請輸入正確的節次" });
    }

    // 如果傳入的是 weekday 參數，將其轉換為對應的 weekday 字串
    let targetWeekday;
    let targetDate;
    
    if (weekday) {
      targetDate = new Date(weekday);
      const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayOfWeek = targetDate.getDay();
      
      // 只允許週一到週五
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return res.status(400).json({ message: "查不到假日的空教室 QAQ 假日就別來學校了" });
      }
      
      targetWeekday = weekdayNames[dayOfWeek];
      console.log(`Target date: ${targetDate}, weekday: ${targetWeekday}`);
    }

    // 建立查詢條件
    let query = {};
    if (building) {
      query.buildingCode = building;
    }
    
    // 使用 weekday 字串查詢
    if (targetWeekday) {
      query.weekday = targetWeekday;
    }
    
    // 使用日期範圍查詢 (當天的所有課程)
    if (targetDate) {
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      query.dateTime = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }
    
    if (slotFrom && slotTo) {
      query.timeSlotNo = { $gte: parseInt(slotFrom), $lte: parseInt(slotTo) };
    } else if (slotFrom) {
      query.timeSlotNo = { $gte: parseInt(slotFrom) };
    } else if (slotTo) {
      query.timeSlotNo = { $lte: parseInt(slotTo) };
    }

    console.log(`MongoDB query:`, JSON.stringify(query, null, 2));
    
    // 照理來說，如果時間段合法，那應該都要查得到東西
    // 如果是空的，professor和course是空字串
    const result = await model.course.find(query);
    console.log(`Query result count: ${result.length}`);
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
