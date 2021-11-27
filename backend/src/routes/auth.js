const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/auth.middlewares')

const authController = require('../app/controllers/auth.controllers');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/activation', authController.activateEmail)
router.post('/refresh_token', authController.getAccessToken)
router.post('/forgot', authController.forgotPassword)
router.post('/reset',isAuth, authController.resetPassword)
router.post('/google_login', authController.googleLogin)
router.post('/facebook_login', authController.facebookLogin)
router.get('/logout', authController.logout)

module.exports = router;
