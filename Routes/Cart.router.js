const express = require("express")
const router = express.Router();
const { GetCart, AddToCart, clearcart, removefromCart,EditCart } = require("../Controllers/Cart.controller");


router.get('/',GetCart);

router.post('/add',AddToCart);

router.delete('/clear',clearcart);

router.patch('/update/:id',EditCart);

router.delete('/remove/:id',removefromCart);


module.exports = router;