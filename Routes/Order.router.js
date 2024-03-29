const express = require("express")
const router = express.Router();
const {placeOrder, GetAllOrders, GetOrder, CancelOrder,GetUserOrders} = require("../Controllers/Orders.controller");



router.get('/:id',GetOrder);   

router.get('/',GetAllOrders);

router.post('/add',placeOrder);

router.get('/getAll',GetUserOrders);   

router.patch('/cancel/:id',CancelOrder);


module.exports = router;