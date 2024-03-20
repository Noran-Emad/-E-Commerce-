const express = require('express');
const cors = require('cors');
require('./Database')
const app = express();
app.use(cors());
app.use(express.json());

const CartRouter = require('./Routes/Cart.router');
const userRouter = require('./Routes/users.routes');
const OrderRouter = require('./Routes/Order.router');
const AdminRouter = require('./Routes/Admin.router');
const ReviewRouter = require('./Routes/Review.router');
const ProductRouter = require('./Routes/Product.router');
const CategoryRouter = require('./Routes/Category.router');
const PaymentRouter = require('./Routes/payment.routes');
const { SearchForProducts } = require('./Controllers/product.controller');
const { auth } = require('./Middleware/auth');

    
app.use('/api/category',CategoryRouter);
app.use('/api/products',ProductRouter);
app.use('/api/payment',PaymentRouter);
app.use('/api/search',SearchForProducts)
app.use('/api/Review',ReviewRouter);
app.use('/api/admin',AdminRouter);
app.use('/api/order',OrderRouter);
app.use('/api/cart',CartRouter);
app.use('/api/user',userRouter);
app.listen(process.env.PORT);