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
            const users = await userModel.find({deleted : false})
            res.send(users)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async updateProfile(req, res, next) {
        // console.log(req.body)
        const user = await userModel.findById(req.user.id).select('-password')
        if (user) {
            user.name = req.body.name
            if (user.isSeller) {
                user.seller.name = req.body.sellerName || user.seller.name;
                user.seller.logo = req.body.sellerLogo || user.seller.logo;
                user.seller.description =
                    req.body.sellerDescription || user.seller.description;
            }
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
                isSeller: updatedUser.isSeller,
            });
        }
    }

    async updateUser(req, res, next) {
        await userModel.updateOne({ _id: req.params.id }, req.body)
            .then((data) => res.send(data))
            .catch(next)
    }

    async deleteUser(req, res, next) {
        await userModel.delete({ _id: req.params.id })
            .then(() => res.send('OK'))
            .catch(next)
    }

    async topSeller(req, res, next) {
        const topSellers = await userModel.find({ isSeller: true })
            .sort({ 'seller.rating': -1 })
            .limit(3);
        res.send(topSellers);
    }

}

module.exports = new UserController()
