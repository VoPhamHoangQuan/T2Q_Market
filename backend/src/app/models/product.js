const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    cateid: { type: Number, required: true },
    companyid: { type: Number, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    origin: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, required: true },
    numReview: { type: Number, required: true },
    discount: { type: Boolean, required: false },
    IsDelete: { type: Boolean, required: false },
}, {
    timestamps: true,
});
module.exports = mongoose.model('products', ProductSchema)
