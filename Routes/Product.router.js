const express = require("express")
const router = express.Router();
const {AddProduct, GetAllProducts, DeleteProduct, EditProduct, GetProduct, DeleteAllProduct} = require('../Controllers/product.controller');

router.post('/',AddProduct);

router.get('/:id',GetProduct);

router.get('/',GetAllProducts);

router.patch('/:id',EditProduct);

router.delete('/:id',DeleteProduct);


module.exports = router;