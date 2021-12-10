const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const orderSchema = new mongoose.Schema(
    {
        orderItems: [
            {
                name: { type: String, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
                product: {//link to product id
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
            },
        ],
        shippingAddress: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
            lat: Number,
            lng: Number,
        },
        paymentMethod: { type: String, required: true },
        paymentResult: {//save payment result info
            id: String,
            status: String,
            update_time: String,
            email_address: String,
        },
        itemsPrice: { type: Number, required: true },
        shippingPrice: { type: Number, required: true },
        taxPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },//link to user
        seller: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
        isPaid: { type: Boolean, default: false },//status
        paidAt: { type: Date },
        isDelivered: { type: Boolean, default: false },
        deliveredAt: { type: Date },
    },
    {
        timestamps: true,
    }
);

orderSchema.plugin(mongooseDelete, {
    deletedAt: true
})
module.exports = mongoose.model('orders', orderSchema)