const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        comment: { type: String, required: true },
        rating: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    seller: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
    image: { type: String, required: true },
    brand: { type: String, required: false },
    category: { type: String, required: false },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: false },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    reviews:[reviewSchema]
}, {
    timestamps: true,
});
module.exports = mongoose.model('products', ProductSchema)
