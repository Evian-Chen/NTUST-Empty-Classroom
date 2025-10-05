const mongoose = require("mongoose");
const conn = require("./db");

const buildingsSchema = mongoose.Schema({
    buildingCode: {  // 代號，例如 TR
        type: String,
        required: true,
    },
    name: {  // 名稱，例如 研揚大樓
        type: String,
        required: true,
    },
    campus: {
        type: String,
        default: "Main"
    }
});

const Building = conn.model("Building", buildingsSchema, "building");
module.exports = Building;