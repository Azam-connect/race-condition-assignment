const {UserService} = require("../../services")

class UserController {
    async addUser(req, res, next) {
        return UserService.addUser(req, res, next);
    }

    async userList(req, res, next) {
        return UserService.userList(req, res, next);
    }
}

module.exports = new UserController();