const express = require("express")
const router = express.Router();
const {placeOrder, GetAllOrders, GetOrder, CancelOrder,GetUserOrders, confirmOrder} = require("../Controllers/Orders.controller");



router.get('/getAll',GetUserOrders);   

router.get('/:id',GetOrder);   

router.get('/',GetAllOrders);

router.post('/add',placeOrder);

router.patch('/cancel/:id',CancelOrder);

router.patch('/conform/:id',confirmOrder);


module.exports = router;