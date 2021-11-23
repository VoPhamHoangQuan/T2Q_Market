import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRouter from './routers/userRouter.js';
import productRouter from './routers/productRouter.js';


dotenv.config();
const app = express();

app.use(express.json()); //nhận được data dạng json ở body request 
app.use(express.urlencoded());

mongoose.connect('mongodb://localhost:27017/T2Qmarket')

app.use('/api/users', userRouter);

app.use('/api/products', productRouter)

app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
})

app.listen(5000, () => {
    console.log("localhost:5000/");
})



