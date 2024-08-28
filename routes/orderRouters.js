const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController')


router.post('/create',orderController.createOrder)

router.post('/pay',orderController.payMent)

router.post('/initialpayment',orderController.iniTialpaymnet)

router.post('/paymentnotification',orderController.paymetNotification)

module.exports = router;