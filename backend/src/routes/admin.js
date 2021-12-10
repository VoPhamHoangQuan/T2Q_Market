const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth.middlewares')
const isAdmin = require('../middleware/isAdmin')

const userController = require('../app/controllers/userController')

router.get('/:id', isAuth, isAdmin, userController.getUserInfo)

module.exports = router