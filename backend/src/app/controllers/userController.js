const userModel = require('../models/users');

class UserController {
    async getUser(req, res, next) {
        try {
            const user = await userModel.findById(req.user.id).select('-password')

            res.json(user)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
    async getUsersAllInfor(req, res) {
        try {
            const users = await userModel.find().select('-password')

            res.json(users)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = new UserController()
