const express = require("express");
const Order = require("../models/order.model")

const app = express();
app.use(express.json());

const GetAllOrders = async (req, res) => {
    const orders = await Order.find();
    res.send(orders);
}


module.exports = {
    GetAllOrders,
}