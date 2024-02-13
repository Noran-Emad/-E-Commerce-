require('./Database')
const express = require('express');
const app = express();
app.use(express.json());

const ProductRouter = require('./Routes/Product.router');
const CategoryRouter = require('./Routes/Category.router');
const AdminRouter = require('./Routes/Admin.router')

app.use('/API/Products',ProductRouter);
app.use('/API/Category',CategoryRouter);
app.use('/API/admin',AdminRouter);


app.listen(3000);