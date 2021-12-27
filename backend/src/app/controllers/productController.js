const ProductModel = require('../models/product')
const data = require('../../data')

class ProductController {
    // GET seed products
    seedProducts(req, res, next) {
        const createdProducts = ProductModel.insertMany(data.products);
        res.send(createdProducts);
    }

    // GET product HOME
    async getAllProductsHome(req, res, next) {
        await ProductModel.find({})
                         .then(data => res.send(data))
                         .catch(next)
    }

    async getAllProducts(req, res, next) {
        const pageSize = 12;
        const page = Number(req.query.pageNumber) || 1;
        const name = req.query.name || '';
        const seller = req.query.seller || '';
        const category = req.query.category || '';
        const order = req.query.order || '';
        const id = req.query.id || '';
        const min =
            req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
        const max =
            req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
        const rating =
            req.query.rating && Number(req.query.rating) !== 0
                ? Number(req.query.rating)
                : 0;
        const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
        const sellerFilter = seller ? { seller } : {};
        const categoryFilter = category ? { category } : {};
        const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
        const ratingFilter = rating ? { rating: { $gte: rating } } : {};
        const idFilter = id ? { id } : {};
        const sortOrder =
            order === 'lowest'
                ? { price: 1 }
                : order === 'highest'
                    ? { price: -1 }
                    : order === 'toprated'
                        ? { rating: -1 }
                        : { _id: -1 };
        const count = await ProductModel.count({
            ...sellerFilter,
            ...nameFilter,
            ...categoryFilter,
            ...priceFilter,
            ...ratingFilter,
        });
        const products = await ProductModel.find({
            ...sellerFilter,
            ...nameFilter,
            ...categoryFilter,
            ...priceFilter,
            ...ratingFilter,
            deleted: false,
        })
            .populate('seller', 'seller.name seller.logo')
            .sort(sortOrder)
            .skip(pageSize * (page - 1))
            .limit(pageSize);
        res.send({ products, page, pages: Math.ceil(count / pageSize) });
    }



    // GET product/:id
    async getProduct(req, res, next) {
        await ProductModel.findById(req.params.id).populate(
            'seller',
            'seller.name seller.logo seller.rating seller.numReviews'
        )
            .then(data => res.send(data))
            .catch(next)
    }

    // POST product 
    async createProduct(req, res, next) {
        const product = new ProductModel({
            name: 'sample name' + Date.now(),
            seller: req.user.id,
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
        if (req.body.amount > 0 || typeof req.body.amount === 'number') {
            await ProductModel.updateOne({ _id: req.params.id }, req.body)
            .then(data => res.json(data))
            .catch(next)
        }
        res.json({msg: 'Sai cau truc'})

    }

    // DELETE product
    async deleteProduct(req, res, next) {
        await ProductModel.delete({ _id: req.params.id })
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

    // GET category
    async getCategory(req, res) {
        const categories = await ProductModel.find({}).distinct('category');
        res.send(categories);
    }
}

module.exports = new ProductController();
