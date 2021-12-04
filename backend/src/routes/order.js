const express = require('express');
const router = express.Router();
const orderController = require('../app/controllers/orderController')
const orderModel = require('../app/models/order');

const authMiddleware = require('../middleware/auth.middlewares');

const isAuth = authMiddleware.isAuth;

router.post('/', orderController.order)
module.exports = router;