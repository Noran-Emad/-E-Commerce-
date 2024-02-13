const expree = require("express")
const { GetAllProducts, DeleteProduct, AddProduct } = require("../Controllers/product.controller")
const { GetAllCategory, DeleteCategory, AddCategory } = require("../Controllers/Category.controller")
const { GetAllUsers } = require("../controllers/Admin.controller")
const { GetAllOrders } = require("../controllers/order.controller")
const router = expree.Router()

/// get 
router.get('/users', GetAllUsers)
router.get('/orders', GetAllOrders)
router.get('/products', GetAllProducts)
router.get('/categories', GetAllCategory)

///add
router.post('/products/', AddProduct);
router.post('/categories/', AddCategory);

///delete
router.delete('/categories/:id', DeleteCategory);
router.delete('/products/:id', DeleteProduct);

module.exports = router;

