const {NotificationService} = require("./../../services");

class NotificationController {
    async sendNotification(req, res, next){
        return NotificationService.sendNotification(req, res, next);
    }

    async notificationList(req, res, next) {
        return NotificationService.notificationList(req, res, next);
    }

    async userNotificationList(req, res, next) {
        return NotificationService.userNotificationList(req, res, next);
    }

    async updateNotificationStatus(req,res,next){
        return NotificationService.updateNotificationStatus(req, res, next);
    }

}

module.exports = new NotificationController();