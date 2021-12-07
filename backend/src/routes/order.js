const express = require('express');
const router = express.Router();
const orderController = require('../app/controllers/orderController')

const isAuth = require('../middleware/auth.middlewares');
const isAdmin = require('../middleware/isAdmin')
const isSellerOrAdmin = require('../middleware/isSellerOrAdmin')

router.get('/summary', isAuth, isAdmin, orderController.getDashboard)
router.get('/:id', isAuth, orderController.getDetailsOrder)
router.get('/mine', isAuth, orderController.getOrder)
router.put('/:id/pay', isAuth, orderController.updateStatus)
router.delete('/:id', isAuth, isAdmin, orderController.deleteOder)
router.put('/:id/deliver',isAuth,isAdmin, orderController.updateDeliver)
router.post('/', isAuth, orderController.order)
router.get('/', isAuth, isSellerOrAdmin, orderController.getAll)

module.exports = router;
