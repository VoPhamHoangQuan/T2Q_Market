const orderModel = require('../models/order')
const userModel = require('../models/users')
const productModel = require('../models/product')
const orderMail = require('./orderMail')

class OrderController {
    //  admin get all orders
    async getAll(req, res, next) {
        const seller = req.query.seller || '';
        const sellerFilter = seller ? { seller } : {};
        const order = req.query.order || '';
        const sortOrder =
        order === 'new'
            ? { createdAt: -1 }
            : order === 'old'
                ? { createdAt: 1 }
                    : { _id: -1 };

        const orders = await orderModel.find({ ...sellerFilter, deleted: false }).populate(
            'user',
            'name'
        ).sort(sortOrder);
        res.send(orders)
    }
    // admin get all deleted order
    async getAllDeleted(req, res, next) {
        const seller = req.query.seller || '';
        const sellerFilter = seller ? { seller } : {};
        const order = req.query.order || '';
        const sortOrder =
        order === 'new'
            ? { createdAt: -1 }
            : order === 'old'
                ? { createdAt: 1 }
                    : { _id: -1 };

        const orders = await orderModel.find({ ...sellerFilter, deleted: true }).populate(
            'user',
            'name'
        ).sort(sortOrder);
        res.send(orders)
    }

    //route to return order of current user
    async getOrder(req, res) {
        try {
            const orders = await orderModel.find({ user: req.params.id, deleted: false })
            console.log(req.params.id)
            if (orders) res.send(orders);
            res.status(400).json({ msg: 'Loi' })
        }
        catch (err) {
            res.send(err);
        }
    }


    // POST /order
    async order(req, res, next) {
        if (req.body.orderItems.length === 0) {
            res.status(400).send({ message: 'Cart is empty' });
        } else {
            const order = new orderModel({
                seller: req.body.orderItems[0].seller._id,
                orderItems: req.body.orderItems,
                shippingAddress: req.body.shippingAddress,
                paymentMethod: req.body.paymentMethod,
                itemsPrice: req.body.itemsPrice,
                shippingPrice: req.body.shippingPrice,
                taxPrice: req.body.taxPrice,
                totalPrice: req.body.totalPrice,
                user: req.user.id,
            });
            const createdOrder = await order.save();
            res
                .status(201)
                .send({ message: 'New Order Created', order: createdOrder });
        }
    }

    //only author user can access to detail order
    async getDetailsOrder(req, res) {
        try {
            const order = await orderModel.findById(req.params.id);//order id
            if (order) {
                res.send(order);
            } else {
                res.status(404).send({ message: 'Order Not Found' });
            }
        } catch (err) {
            res.send(err);
        }
    }


    //update status of order, only access user can add payment
    async updateStatus(req, res) {
        const order = await orderModel.findById(req.params.id).populate(
            'user',
            'email name'
        );
        if (order) {
            //if have order
            //set info of order
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                //info from paypal
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: order.user.email,
            };
            const updatedOrder = await order.save();//update info
            for (let i = 0; i < order.orderItems.length; i++) {
                var product = await productModel.findById(order.orderItems[i].product)
                if (product) {
                    product.amount = product.amount - order.orderItems[i].quantity
                }
                await product.save()
            }
            orderMail(order.user.email, order._id, order.orderItems[0].price, order.shippingAddress.address, order.totalPrice, req.body.update_time, order.orderItems[0].name, order.taxPrice, order.shippingPrice, order.user.name)
            res.send({ message: 'Order Paid', order: updatedOrder });
        } else {
            //send error
            res.status(404).send({ message: 'Order Not Found' });
        }
    }

    //admin delete order
    async deleteOder(req, res) {
        const order = await orderModel.delete({ _id: req.params.id });
        if (order) {//if exist, call del func, send 
            res.send({ message: 'Order Deleted'});
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    }

    //admin restore order
    async restore(req, res) {
        const order = await orderModel.restore({ _id: req.params.id });
        console.log(req.headers.Authorization)
        if (order) {//if exist, call del func, send 
            res.send({ message: 'Order restore'});
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    }

    //admin change deliver status
    async updateDeliver(req, res, next) {
        const order = await orderModel.findById(req.params.id);//find order by id
        if (order && order.deleted === false) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.send({ message: 'Order Delivered', order: updatedOrder });
        } else {
            res.status(404).send({ message: 'Order Not Found' })
        }
    }

    async getDashboard(req, res, next) {
        const orders = await orderModel.aggregate([
            {
                $group: {
                    _id: null,
                    numOrders: { $sum: 1 },
                    totalSales: { $sum: '$totalPrice' },
                },
            },
        ]);
        const users = await userModel.aggregate([
            {
                $group: {
                    _id: null,
                    numUsers: { $sum: 1 },
                },
            },
        ]);
        const dailyOrders = await orderModel.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    orders: { $sum: 1 },
                    sales: { $sum: '$totalPrice' },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const productCategories = await productModel.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                },
            },
        ]);
        res.send({ users, orders, dailyOrders, productCategories });
    }
}


module.exports = new OrderController();