const express = require('express');
const router = express.Router();
const productController = require('../app/controllers/productController')

router.get('/seed', productController.seedProducts)
router.get('/:id', productController.getProduct)
router.get('/', productController.getAllProducts)

module.exports = router;