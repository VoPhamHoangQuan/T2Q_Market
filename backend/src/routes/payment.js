const express = require('express');
const paymentControllder = require('../app/controllers/paymentController')

const router = express.Router();
router.get('/paypal', paymentControllder.getPaypalId)

module.exports = router