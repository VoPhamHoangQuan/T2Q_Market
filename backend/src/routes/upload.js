const multer = require('multer');
const express = require('express');
const  isAuth  = require('../middleware/auth.middlewares');

const uploadRouter = express.Router();//implement express

//function save folder in upload folder and rename to datetime.jpg
const storage = multer.diskStorage({//defile local storage
    destination(req, file, cb) {//
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}.jpg`);
    },
});

const upload = multer({ storage });

uploadRouter.post('/', isAuth, upload.single('image'), (req, res) => {//only admin can upload, 
    res.send(`/${req.file.path}`);//send file name
});

module.exports =  uploadRouter;