const express = require("express");
const router = express.Router();
const utils = require("../utils");

const model = require("../models");

router.get("/", async (req, res) => {
  try {
    const { building, weekday, slotFrom, slotTo } = req.query;
    console.log(`Received params:`, { building, weekday, slotFrom, slotTo });

    // 參數檢查
    if (!utils.timeSlotCheck(slotFrom, slotTo)) {
      return res.status(400).json({ message: "請輸入正確的節次" });
    }

    // 如果傳入的是 weekday 參數，將其轉換為對應的 weekday 字串
    let targetWeekday;
    let targetDate;
    
    if (weekday) {
      // 處理 YYYY-MM-DD 格式的日期字串，避免時區問題
      if (weekday.includes('-') && weekday.length === 10) {
        // YYYY-MM-DD 格式
        const [year, month, day] = weekday.split('-').map(Number);
        targetDate = new Date(year, month - 1, day); // month 是 0-based
      } else {
        // ISO 格式（向後兼容）
        targetDate = new Date(weekday);
      }
      
      const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayOfWeek = targetDate.getDay();
      
      console.log(`Input weekday: ${weekday}, Parsed date: ${targetDate.toDateString()}, Day of week: ${dayOfWeek}`);
      
      // 只允許週一到週五
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return res.status(400).json({ message: "查不到假日的空教室 QAQ 假日就別來學校了" });
      }
      
      targetWeekday = weekdayNames[dayOfWeek];
      console.log(`Target date: ${targetDate.toDateString()}, weekday: ${targetWeekday}`);
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
    
    const result = await model.course.find(query);
    console.log(`Query result count: ${result.length}`);
    res.status(200).json(result);
  } catch (err) {
    console.log(`availability error: ${err}`);
    res.status(500).json({ message: "error occured at backend" });
  }
});

router.get("/week", async (req, res) => {
  try {
    const { weekday, slotFrom, slotTo } = req.query;
    console.log(`Received params:`, { weekday, slotFrom, slotTo });

    // 參數檢查
    if (!utils.timeSlotCheck(slotFrom, slotTo)) {
      return res.status(400).json({ message: "請輸入正確的節次" });
    }

    let targetWeekday;
    let targetDate;
    
    if (weekday) {
      const weekdayResult = utils.getWeekday(weekday);
      targetDate = weekdayResult.targetDate;
      targetWeekday = weekdayResult.targetWeekday;
    }

    // 建立查詢條件
    let query = {};
    
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
    
    const result = await model.course.find(query);
    console.log(`Query result count: ${result.length}`);
    res.status(200).json(result);
  } catch (err) {
    console.log(`availability error: ${err}`);
    res.status(500).json({ message: "error occured at backend" });
  }
});

module.exports = router;
