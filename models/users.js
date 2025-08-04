const mongoose = require("mongoose");
const { NotifyDB } = require("../config/dbConnection")

const UserSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    devices: [{ type: String }],
}, {
    timestamps: true,
});
const UserModel = NotifyDB.model('users', UserSchema, 'Users');
module.exports = { UserModel };