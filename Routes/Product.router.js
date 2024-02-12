const express = require("express")
const router = express.Router();
const {AddProduct, GetAllProducts, DeleteProduct, EditProduct, GetProduct, DeleteAllProduct} = require('../Controllers/product.controller');

router.get('/',GetAllProducts);

router.get('/:id',GetProduct);

router.post('/',AddProduct);

router.patch('/:id',EditProduct);

router.delete('/:id',DeleteProduct);

router.delete('/',DeleteAllProduct);

module.exports = router;