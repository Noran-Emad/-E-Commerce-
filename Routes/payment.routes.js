const express = require("express")
const router = express.Router();
const {payment}=require('../Controllers/payment.controller')
router.post('/checkout/:id',payment);
module.exports = router;