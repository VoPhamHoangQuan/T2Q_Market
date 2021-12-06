const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth.middlewares')
const isAdmin = require('../middleware/isAdmin')

const userController = require('../app/controllers/userController')

router.get('/top-sellers', userController.topSeller)
router.get('/info', isAuth, userController.getUser)
router.get('/:id', isAuth, userController.getUserInfo)
router.get('/seller/:id', userController.getUserInfo)
router.put('/profile', isAuth, userController.updateProfile)
router.put('/:id', isAuth, isAdmin, userController.updateUser)
router.delete('/:id', isAuth, isAdmin, userController.deleteUser)
router.get('/',isAuth, isAdmin, userController.getUsersAllInfor)


module.exports = router



