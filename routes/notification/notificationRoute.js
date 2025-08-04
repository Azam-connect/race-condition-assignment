const express = require('express');
const router = express.Router();

const { NotificationController } = require("../../controllers");

router.get("/", NotificationController.notificationList);
router.get("/notification-details/:id", NotificationController.notificationList);
router.post("/", NotificationController.sendNotification);
router.get("/user/:userId", NotificationController.userNotificationList);
router.post("/push-notification/", NotificationController.updateNotificationStatus);


module.exports = router;