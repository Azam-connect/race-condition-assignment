const express = require('express');
const router = express.Router();

const {UserController}=require("../../controllers")

router.get("/",UserController.userList);
router.post("/",UserController.addUser);

module.exports = router;