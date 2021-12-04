const userModel = require('../models/users');
const bcrypt = require('bcrypt');

class UserController {
    async getUser(req, res, next) {
        try {
            const user = await userModel.findById(req.user.id)
            res.json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async getUserInfo(req, res, next) {
        try {
            const user = await userModel.findById(req.params.id)
            res.send(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async getUsersAllInfor(req, res) {
        try {
            const users = await userModel.find({})
            res.send(users)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async updateProfile(req, res, next) {
        const user = await userModel.findById(req.user.id).select('-password')
        if (user) {
            user.name = req.body.name
            if (req.body.password) {//if user fill pass, hash and save
                user.password = bcrypt.hashSync(req.body.password, 8);
            }
            const updatedUser = await user.save();
            //send user info back to frontend.
            res.send({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
            });
        }
    }

    async updateUser(req, res, next) {
        await userModel.updateOne({ _id: req.params.id}, req.body)
                        .then((data) => res.send(data))
                        .catch(next)
    }

    async deleteUser(req, res, next) {
        await userModel.deleteOne({ _id: req.params.id})
                        .then( () => res.send('OK'))
                        .catch(next)
    }

}

module.exports = new UserController()
