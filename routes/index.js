const express = require('express');
const router = express.Router();

const UserRoute = require("./user/userRoute");
const NotificationRoute = require("./notification/notificationRoute");

router.use("/user", UserRoute);
router.use("/notification", NotificationRoute);

module.exports = router;