const express = require("express")
const router = express.Router();
const {placeOrder, GetAllOrders, GetOrder, CancelOrder} = require("../Controllers/Orders.controller");


router.get('/:id',GetOrder);    

router.get('/',GetAllOrders);

router.post('/add',placeOrder);

router.patch('/cancel/:id',CancelOrder);


module.exports = router;