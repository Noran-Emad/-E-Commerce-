const expree = require("express")
const { GetAllProducts, DeleteProduct, AddProduct, EditProduct } = require("../Controllers/product.controller")
const { GetAllCategory, DeleteCategory, AddCategory, EditCategory } = require("../Controllers/Category.controller")
const { GetAllUsers } = require("../controllers/Admin.controller")
const { GetAllOrders } = require("../Controllers/Orders.controller")
const { isAdmin } = require("../Middleware/admin")
const router = expree.Router()

/// GET 
router.get('/users', isAdmin, GetAllUsers)
router.get('/orders', isAdmin, GetAllOrders)
router.get('/products', isAdmin, GetAllProducts)
router.get('/categories', isAdmin, GetAllCategory)

///ADD - POST
router.post('/products/', isAdmin, AddProduct);
router.post('/categories/', isAdmin, AddCategory);

///EDIT - PATCH
router.patch('/products/:id', isAdmin,EditProduct);
router.patch('/categories/:id', isAdmin,EditCategory);

///DELETE
router.delete('/products/:id', isAdmin, DeleteProduct);
router.delete('/categories/:id', isAdmin, DeleteCategory);

module.exports = router;

