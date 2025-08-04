const { UserModel } = require('../../models')
class UserService {
    async addUser(req, res, next) {
        try {
            const { name, device } = req.body;
            const newUser = new UserModel({ name, devices: [device] });
            const saveUser = await newUser.save();
            return res.status(201).json({
                "message": "User added successfully",
                "data": saveUser
            })

        } catch (error) {
            return res.status(500).json({
                errMsg: true,
                message: 'Internal Server Error',
                error: 'Error: ' + error,
            });
        }
    }

    async userList(req, res, next) {
        try {
            const users = await UserModel.find({});
            return res.status(200).json({
                "message": "User list fetched successfully",
                "data": users
            });
        } catch (error) {
            return res.status(500).json({
                errMsg: true,
                message: 'Internal Server Error',
                error: 'Error: ' + error,
            });
        }
    }
}

module.exports = new UserService();