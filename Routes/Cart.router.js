const express = require("express")
const router = express.Router();
const { GetCart, AddToCart, clearcart, removefromCart,EditCart, AssignLocalCCart } = require("../Controllers/Cart.controller");


router.get('/',GetCart);

router.post('/add',AddToCart);

router.post('/addlocal',AssignLocalCCart);

router.delete('/clear',clearcart);

router.patch('/update/:id',EditCart);

router.delete('/remove/:id',removefromCart);


module.exports = router;