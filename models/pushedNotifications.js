const mongoose = require("mongoose");
const { NotifyDB } = require("../config/dbConnection")

const PushedNotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'users',
        trim: true,
    },
    notificationId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'notifications',
        trim: true,
    },
    status: {
        type: String,
        enum: ['read', 'unread'],
        trim: true,
        default: 'unread'
    },
    readByDevices: [{deviceId: { type: String, trim: true }, readTime: { type: Date, default: Date.now } }],
}, {
    timestamps: true,
});
const PushedNotificationModel = NotifyDB.model('pushednotifications', PushedNotificationSchema, 'PushedNotifications');
module.exports = { PushedNotificationModel };