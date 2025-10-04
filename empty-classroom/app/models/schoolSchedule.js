const mongoose = require("mongoose");
const conn = require("./db");

const schoolScheduleSchema = new mongoose.Schema({
    dateTime: {
        type: Date,
        required: true
    }
});

const schoolSchedule = conn.model("SchoolSchedule", schoolScheduleSchema, "schoolSchedule");
module.exports = schoolSchedule;