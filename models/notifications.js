const mongoose = require("mongoose");
const { NotifyDB } = require("../config/dbConnection")

const NotificationSchema = new mongoose.Schema({
    message: { type: String, trim: true, required: true },
    priority:{
      type: String,
      trim: true,
      enum: ['normal', 'high'],
      default: 'normal',
    },
    expireAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
});
const NotificationModel = NotifyDB.model('notifications', NotificationSchema, 'Notifications');
module.exports = { NotificationModel };