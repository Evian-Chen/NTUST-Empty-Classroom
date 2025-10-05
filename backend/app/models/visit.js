const mongoose = require("mongoose");
const conn = require("./db");

const visitSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    }
}, { timestamps: true });

const visit = conn.model("Visit", visitSchema, "visit");
module.exports = visit;