const { default: mongoose } = require('mongoose');
const { NotificationModel, UserModel, PushedNotificationModel } = require('./../../models');
class NotificationService {
    async sendNotification(req, res, next) {
        try {
            const { userId, message, priority = 'normal', exipreAt = null } = req.body;
            const newNotification = new NotificationModel({
                message, priority, exipreAt
            });
            const saveNotification = await newNotification.save();
            let pushedNotificationSet = [];
            if (typeof userId == 'string' && userId.trim() === 'all') {
                const users = await UserModel.find().select("_id");
                for (const user of users) {
                    pushedNotificationSet.push({
                        userId: user._id,
                        notificationId: saveNotification._id
                    });
                }
            } else {
                for (const id of userId) {
                    pushedNotificationSet.push({
                        userId: id,
                        notificationId: saveNotification._id
                    });
                }
            }
            await PushedNotificationModel.insertMany(pushedNotificationSet);
            return res.status(200).json({
                "message": "Notification sent successfully",
                "data": { userId, message }
            });
        } catch (error) {
            return res.status(500).json({
                errMsg: true,
                message: 'Internal Server Error',
                error: 'Error: ' + error,
            });
        }
    }

    async notificationList(req, res, next) {
        try {
            const { id = null } = req.params;
            let query = {};
            if (id) {
                if (mongoose.Types.ObjectId.isValid(id)) {
                    query = { _id: new mongoose.Types.ObjectId(id) };
                }
                else {
                    return res.status(400).json({
                        errMsg: true,
                        message: 'Invalid notification ID format',
                    });
                }
            }
            const notifications = await NotificationModel.find(query).sort({ createdAt: -1 });
            return res.status(200).json({
                "message": "Notification list fetched successfully",
                "data": notifications
            });
        } catch (error) {
            return res.status(500).json({
                errMsg: true,
                message: 'Internal Server Error',
                error: 'Error: ' + error,
            });
        }
    }

    async userNotificationList(req, res, next) {
        try {
            const { userId } = req.params;
            const notifications = await PushedNotificationModel.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                {
                    $lookup: {
                        from: 'Notifications',
                        localField: 'notificationId',
                        foreignField: '_id',
                        as: 'notification'
                    }

                },
                {
                    $unwind: '$notification'
                },
                {
                    $match: {
                        $or: [
                            { 'notification.expireAt': null },
                            { 'notification.expireAt': { $gt: new Date() } }
                        ]
                    }
                },
                {
                    $project: {
                        // _id: 0,
                        notificationId: '$notification._id',
                        message: '$notification.message',
                        priority: '$notification.priority',
                        exipreAt: '$notification.exipreAt',
                        status: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ]);
            return res.status(200).json({
                "message": "User notification list fetched successfully",
                "data": notifications
            });
        } catch (error) {
            return res.status(500).json({
                errMsg: true,
                message: 'Internal Server Error',
                error: 'Error: ' + error,
            });
        }
    }

    async updateNotificationStatus(req, res, next) {
        try {
            let { userId, notificationId, deviceId, readTime = Date.now() } = req.body;

            readTime = new Date(readTime).getTime();
            if (isNaN(readTime)) {
                return res.status(400).json({
                    errMsg: true,
                    message: 'Invalid read time format',
                })
            }

            const notification = await PushedNotificationModel.findOne({ userId, notificationId });
            if (!notification) {
                return res.status(404).json({
                    errMsg: true,
                    message: 'Notification not found',
                });
            }
            if (readTime > notification.updatedAt) {
                notification.status = 'read';
                notification.updatedAt = readTime;

                const device = notification.readByDevices.findIndex(d => d.deviceId === deviceId);
                if (device >= 0) {
                    notification.readByDevices[device].readTime = new Date(readTime);
                }
                else {
                    notification.readByDevices.push({ deviceId: deviceId, readTime: new Date(readTime) });
                }

                await notification.save();

                return res.status(200).json({
                    "message": "Notification status updated successfully",
                    "data": notification
                });
            }
            else {
                return res.status(400).json({
                    errMsg: true,
                    message: 'Notification already read or read time is invalid',
                });
            }

        }
        catch (error) {
            return res.status(500).json({
                errMsg: true,
                message: 'Internal Server Error',
                error: 'Error: ' + error,
            });
        }

    }
}

module.exports = new NotificationService();