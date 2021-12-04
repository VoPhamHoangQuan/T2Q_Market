const express = require('express');
const router = express.Router();
const productController = require('../app/controllers/productController')
const isAuth = require('../middleware/auth.middlewares')
const isAdmin = require('../middleware/isAdmin')

router.delete('/:id',isAuth, isAdmin, productController.deleteProduct)
router.put('/:id',isAuth, isAdmin, productController.editProduct)
router.get('/seed', productController.seedProducts)
router.get('/:id', productController.getProduct)
router.get('/', productController.getAllProducts)
router.post('/',isAuth, isAdmin, productController.createProduct)

module.exports = router;