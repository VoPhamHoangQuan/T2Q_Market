const express = require('express');
const router = express.Router();
const productController = require('../app/controllers/productController')
const isAuth = require('../middleware/auth.middlewares')
const isSellerOrAdmin = require('../middleware/isSellerOrAdmin')

router.get('/categories', productController.getCategory)
router.delete('/:id',isAuth,isSellerOrAdmin, productController.deleteProduct)
router.put('/:id',isAuth, isSellerOrAdmin, productController.editProduct)
router.get('/seed', productController.seedProducts)
router.get('/:id', productController.getProduct)
router.post('/:id/reviews', isAuth, productController.reviewProduct)
router.get('/', productController.getAllProducts)
router.post('/',isAuth, isSellerOrAdmin, productController.createProduct)

module.exports = router;