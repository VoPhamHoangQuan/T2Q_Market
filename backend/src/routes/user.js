const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth.middlewares')
const isAdmin = require('../middleware/isAdmin')

const userController = require('../app/controllers/userController')

router.get('/infor', isAuth, userController.getUser)
router.get('/all_infor',isAuth, isAdmin, userController.getUsersAllInfor)

module.exports = router
