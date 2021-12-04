const ProductModel = require('../models/product')
const data = require('../../data')

class ProductController {
    // GET seed products
    seedProducts(req, res, next) {
        const createdProducts = ProductModel.insertMany(data.products);
        res.send(createdProducts);
    }

    // GET product
    async getAllProducts(req, res, next) {
        await ProductModel.find({})
            .then(data => res.json(data))
            .catch(next)
    }


    // GET product/:id
    async getProduct(req, res, next) {
        await ProductModel.findById(req.params.id)
            .then(data => res.json(data))
            .catch(next)
    }

    // POST product 
    async createProduct(req, res, next) {
        const product = new ProductModel({
            name: 'sample name' + Date.now(),
            image: '/images/p1.jpg',
            price: 0,
            category: 'sample category',
            brand: 'sample brand',
            countInStock: 0,
            rating: 0,
            numReviews: 0,
            description: 'sample description',
        })
        await product.save()
            .then(data => res.send(data))
            .catch(next)
    }

    // PUT product
    async editProduct(req, res, next) {
        await ProductModel.updateOne({_id: req.params.id}, req.body)
                            .then(data => res.json(data))
                            .catch(next)

    }

    // DELETE product
    async deleteProduct(req, res, next) {
        await ProductModel.deleteOne({_id: req.params.id})
                            .then(() => res.send('OK'))
                            .catch(next)
    }
}

module.exports = new ProductController();
