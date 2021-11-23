import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Products from "../models/productModel.js";

const productRouter = express.Router();

productRouter.get("/", expressAsyncHandler(
    async (req, res) => {
        const products = await Products.find({});
        res.send(products);
    })
);

productRouter.get("/seed", expressAsyncHandler(
    async (req, res) => {
        const createdProducts = await Products.insertMany(data.products);
        res.send(createdProducts);
    }
));

productRouter.get("/:id",
    expressAsyncHandler(
        async (req, res) => {
            const product = await Products.findById(req.params.id);
            if (product) {
                res.send(product);
            } else {
                res.status(404).send({ message: 'Product not found!' });
            }
        }
    )
);
export default productRouter;