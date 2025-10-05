require("dotenv").config();

function dateCheck(date) {
  // 1. 無法查詢今天之前
  // 2. 無法查詢假日
  // 3. 無法查詢學期間以外的時間
  const schoolStartDay = new Date(process.env.SCHOOL_START_DAY);
  const schoolEndDay = new Date(process.env.SCHOOL_END_DAY);
  const dateTime = new Date(date);
  const res = { valid: false, message: "" };
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dateTime < today) {
    res.message = "查不到過去的空教室 QAQ 不要拘泥於過去";
    return res;
  }
  if ([6, 0].includes(dateTime.getDay())) {
    res.message = "查不到假日的空教室 QAQ 假日就別來學校了";
    return res;
  }
  if (dateTime < schoolStartDay || dateTime > schoolEndDay) {
    res.message = "查不到學期間以外的空教室 QAQ 放假就別來學校了";
    return res;
  }
  res.valid = true;
  return res;
}

const timeSlotCheck = (slotFrom, slotTo) => {
  if (
    (slotFrom && slotTo && slotFrom > slotTo) ||
    (!slotFrom && slotTo) ||
    (!slotTo && slotFrom)
  ) {
    return false;
  }
  return true;
};

const getWeekday = (weekday) => {
  let targetWeekday;
  let targetDate;
  
  console.log('Processing weekday:', weekday);
  
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
    throw new Error("查不到假日的空教室 QAQ 假日就別來學校了");
  }

  targetWeekday = weekdayNames[dayOfWeek];
  console.log(`Target date: ${targetDate.toDateString()}, weekday: ${targetWeekday}`);

  return { targetWeekday, targetDate };
};

module.exports = { dateCheck, timeSlotCheck, getWeekday };
