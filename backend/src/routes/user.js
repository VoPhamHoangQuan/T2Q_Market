const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth.middlewares')
const isAdmin = require('../middleware/isAdmin')

const userController = require('../app/controllers/userController')

router.get('/:id', isAuth, userController.getUser)
router.get('/ad/:id', isAuth, isAdmin, userController.getUserInfo)
router.put('/profile', isAuth, userController.updateProfile)
router.put('/:id', isAuth, isAdmin, userController.updateUser)
router.delete('/:id', isAuth, isAdmin, userController.deleteUser)
router.get('/',isAuth, isAdmin, userController.getUsersAllInfor)


module.exports = router
