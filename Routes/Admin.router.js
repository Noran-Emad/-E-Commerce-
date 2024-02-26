const expree = require("express")
const { GetAllProducts, DeleteProduct, AddProduct, EditProduct } = require("../Controllers/product.controller")
const { GetAllCategory, DeleteCategory, AddCategory, EditCategory } = require("../Controllers/Category.controller")
const { GetAllUsers } = require("../controllers/Admin.controller")
const { GetAllOrders } = require("../Controllers/Orders.controller")
const router = expree.Router()

/// GET 
router.get('/users', GetAllUsers)
router.get('/orders', GetAllOrders)
router.get('/products', GetAllProducts)
router.get('/categories', GetAllCategory)

///ADD - POST
router.post('/products/', AddProduct);
router.post('/categories/', AddCategory);

///EDIT - PATCH
router.patch('products/:id',EditProduct);
router.patch('categories/:id',EditCategory);

///DELETE
router.delete('/categories/:id', DeleteCategory);
router.delete('/products/:id', DeleteProduct);

module.exports = router;

