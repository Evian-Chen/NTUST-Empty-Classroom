const mongoose = require("mongoose");
const conn = require("./db");


/**
 * Club {
  id: string
  name: string
  type: 'student' | 'community' | 'corporate'
  area: string // 區域/Division
  city?: string
  meetingTime: string // e.g. Wed 19:00-21:00
  language: 'zh' | 'en' | 'bilingual'
  meetingMode: 'online' | 'offline' | 'hybrid'
  venue?: { address: string; lat?: number; lng?: number }
  contact: { email?: string; facebook?: string; line?: string; website?: string }
  officers?: { role: string; name: string; email?: string }[]
  description?: string
  tags?: string[]
  coverImageUrl?: string
}
 */

const clubSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    // === TODO === //
}, {
    timestamps: true,
    collection: 'club-table'
});

const clubModel = conn.model("Club", clubSchema);
module.exports = clubModel;