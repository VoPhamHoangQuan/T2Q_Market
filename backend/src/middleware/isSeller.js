const Users = require('../app/models/users')

exports.isSeller = async (req, res, next) => {
    try {
        const user = await Users.findOne({ _id: req.user.id })

        if (user.isSeller !== true)
            return res.status(500).json({ msg: "Admin resources access denied." })

        next()
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

exports.isSellerOrAdmin = async (req, res, next) => {
    try {
        const user = await Users.findOne({ _id: req.user.id })

        if (user.isSeller || user.isAdmin) {
            next()
        } else {
            res.status(401).send({ message: 'Invalid Admin/Seller Token' });
        }
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}