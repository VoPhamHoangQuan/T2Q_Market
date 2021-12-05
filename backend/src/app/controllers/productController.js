const ProductModel = require('../models/product')
const data = require('../../data')

const PAGE_SIZE = 2
class ProductController {
    // GET seed products
    seedProducts(req, res, next) {
        const createdProducts = ProductModel.insertMany(data.products);
        res.send(createdProducts);
    }

    // GET product
    async getAllProducts(req, res, next) {
        const totalCount = (await ProductModel.find({})).length
        // console.log(totalCount);
        var page = req.query.page
        if (page) {
            // get page 
            page = parseInt(page)
            if (page < 1) {
                page = 1
            } if ( page > Math.ceil(totalCount/PAGE_SIZE) ) {
                page = Math.ceil(totalCount/PAGE_SIZE)
                console.log(page)
            }
            var skip = (page - 1) * PAGE_SIZE
            await ProductModel.find({})
                .skip(skip)
                .limit(PAGE_SIZE)
                .then(data => res.json(data))
                .catch(next)
        } else {
            // get All Product
            await ProductModel.find({})
                .then(data => res.json(data))
                .catch(next)
        }

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
            amount: 0,
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
        await ProductModel.updateOne({ _id: req.params.id }, req.body)
            .then(data => res.json(data))
            .catch(next)

    }

    // DELETE product
    async deleteProduct(req, res, next) {
        await ProductModel.deleteOne({ _id: req.params.id })
            .then(() => res.send('OK'))
            .catch(next)
    }

    // POST /:id/review
    async reviewProduct(req, res) {
    const productId = req.params.id;
    const product = await ProductModel.findById(productId);
    if (product) {
        if (product.reviews.find((x) => x.name === req.user.name)) {
            return res
                .status(400)
                .send({ message: 'You already submitted a review' });
        }
        const review = {
            name: req.body.name,
            rating: Number(req.body.rating),
            comment: req.body.comment,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((a, c) => c.rating + a, 0) /
            product.reviews.length;
        const updatedProduct = await product.save();
        res.status(201).send({
            message: 'Review Created',
            review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        });
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
}
}

module.exports = new ProductController();
