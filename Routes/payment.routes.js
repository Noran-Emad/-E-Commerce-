const express = require("express");
const router = express.Router();
const { payment, failedpayment, successpayment, PaymentStatus } = require('../Controllers/payment.controller');

router.post('/checkout/:id', payment);
router.post('/result/:id', PaymentStatus);

router.get('/success/:id', successpayment);
router.get('/failed/:id', failedpayment);

module.exports = router;
