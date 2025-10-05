const mongoose = require("mongoose");
const conn = require("./db");

const searchSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    }
}, { timestamps: true });

const search = conn.model("Search", searchSchema, "search");
module.exports = search;