import express from "express";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import data from "../data.js"
import { generateToken } from "../utills.js"
import expressAsyncHandler from "express-async-handler";

const userRouter = express.Router();

//init mongo database
userRouter.get("/seed",
    expressAsyncHandler(async (req, res) => {
        const createUsers = await User.insertMany(data.users);
        res.send(createUsers);
    })
)

//login 
userRouter.post("/signin", expressAsyncHandler(
    async (req, res) => {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.send({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user),
                });
            }
            return;
        }
        res.status(401).send({ message: "invalid email or password" });
    })
)

//register
userRouter.post('/register', expressAsyncHandler(
    async (req, res) => {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
        });
        const emailExist = await User.findOne({ email: newUser.email });
        if (!emailExist) {
            const createUser = await newUser.save();
            res.send({
                _id: createUser._id,
                name: createUser.name,
                email: createUser.email,
                isAdmin: createUser.isAdmin,
                token: generateToken(createUser),
            });
        }
        res.status(401).send({ message: "Email is existed" });
    }
));

export default userRouter;