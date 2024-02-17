const expree = require("express")
const { GetAllProducts, DeleteProduct, AddProduct, EditProduct } = require("../Controllers/product.controller")
const { GetAllCategory, DeleteCategory, AddCategory, EditCategory } = require("../Controllers/Category.controller")
const { GetAllUsers } = require("../controllers/Admin.controller")
const { GetAllOrders } = require("../Controllers/Orders.controller")
const router = expree.Router()

/// get 
router.get('/users', GetAllUsers)
router.get('/orders', GetAllOrders)
router.get('/products', GetAllProducts)
router.get('/categories', GetAllCategory)

///add
router.post('/products/', AddProduct);
router.post('/categories/', AddCategory);

///edit
router.patch('products/:id',EditProduct);
router.patch('categories/:id',EditCategory);

///delete
router.delete('/categories/:id', DeleteCategory);
// router.delete('/categories/', DeleteAllCategories);

router.delete('/products/:id', DeleteProduct);
// router.delete('/products/',DeleteAllProduct);

module.exports = router;

