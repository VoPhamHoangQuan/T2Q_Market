const Users = require('../app/models/users')

const isSellerOrAdmin = async (req, res, next) => {
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

module.exports = isSellerOrAdmin