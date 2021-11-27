const ProductModel = require('../models/product')
const data = require('../../data')

class ProductController {
    // GET seed products
    seedProducts(req, res, next) {
        const createdProducts = ProductModel.insertMany(data.products);
        res.send(createdProducts);
    }

    // GET product
    getAllProducts(req, res, next) {
        ProductModel.find({})
                    .then(data => res.json(data))
                    .catch(next)
    }

    
    // GET product/:id
    getProduct(req, res, next) {
        ProductModel.findById(req.params.id)
                    .then(data => res.json(data))
                    .catch(next)
    }

}

module.exports = new ProductController();
