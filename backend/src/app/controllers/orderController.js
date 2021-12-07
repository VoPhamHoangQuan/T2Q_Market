const orderModel = require('../models/order')

class OrderController {
    //  admin get all orders
    async getAll(req, res, next) {
        const seller = req.query.seller || '';
        const sellerFilter = seller ? { seller } : {};

        const orders = await orderModel.find({ ...sellerFilter }).populate(
            'user',
            'name'
        );
        res.send(orders)
    }

    //route to return order of current user
    async getOrder(req, res) {
        const orders = await orderModel.find({ user: req.body._id });
        res.send(orders);
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
        const order = await orderModel.findById(req.params.id);//order id
        if (order) {
            res.send(order);
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    }


    //update status of order, only access user can add payment
    async updateStatus(req, res) {
        const order = await orderModel.findById(req.params.id);//find by id get from url
        if (order) {//if have order
            //set info of order
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                //info from paypal
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };
            const updatedOrder = await order.save();//update info
            res.send({ message: 'Order Paid', order: updatedOrder });
        } else {
            //send error
            res.status(404).send({ message: 'Order Not Found' });
        }
    }

    //admin delete order
    async deleteOder(req, res) {
        const order = await orderModel.findById(req.params.id);
        if (order) {//if exist, call del func, send 
            const deleteOrder = await order.remove();
            res.send({ message: 'Order Deleted', order: deleteOrder });
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    }

    //admin change deliver status
    async updateDeliver(req, res, next) {
        const order = await orderModel.findById(req.params.id);//find order by id
        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.send({ message: 'Order Delivered', order: updatedOrder });
        } else {
            res.status(404).send({ message: 'Order Not Found' })
        }
    }

}


module.exports = new OrderController();