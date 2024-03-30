const express = require("express");
const router = express.Router();
const { payment, failedpayment, successpayment, PaymentStatus, getPayment } = require('../Controllers/payment.controller');

router.post('/checkout/:id', payment);
router.get('/result/:id', PaymentStatus);

router.get('/success/:id', successpayment);
router.get('/failed/:id', failedpayment);

module.exports = router;
