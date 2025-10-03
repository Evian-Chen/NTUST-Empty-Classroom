const mongoose = require("mongoose");
const conn = require("./db");

const courseSchema = mongoose.Schema({
    professor: {  // 授課教師
        type: String,
        required: true,
    },
    courseName: {  // 課程名稱
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endtime: {
        type: Date,
        required: true,
    },
    buildingCode: {
        type: String,  // TR
        required: true,
    },
    roomNumber: {  // 213，教室編號是 {buildingCode}-{roomNumber}，例如 TR-213
        type: String,
        required: true,
    },
    weekday: {
        type: String,  // 星期幾，e.g. Mon, Tue, Wed, Thu, Fri
        required: true,
    },
    timeSlotNo: {
        type: Number,
        required: true,
    }
});

const Course = conn.model("Course", courseSchema, "course");
module.exports = Course;