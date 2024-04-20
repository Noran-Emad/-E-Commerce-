const express = require("express");
const app = express();
app.use(express.json());

const CartCollection = require("../Models/Cart.model");
const OrdersCollection = require("../Models/order.model.js");
const { UpdateCarts } = require("../Services/Cart.service.js");
const { getUserfromJWT, isidValid } = require("../Services/validator.service.js");
const { AddFromCartToOrder, refundorderTimeOut,refundorder } = require("../Services/Order.service.js");
const orderModel = require("../Models/order.model.js");




/* get all orders */
let GetAllOrders = async (req, res) =>
  OrdersCollection.find().then((orders) => res.send(orders));

  
/* get user orders */
let GetUserOrders = async(req,res) =>{
  try{
    let user = await getUserfromJWT(req.headers.jwt, res);
    if(!user) return;
    let page = parseInt(req.query.page) || 1;
    
    let order = await OrdersCollection.find({ 'User': user._id })
    .populate('Products.Product','ProductName productImage').skip((page-1) * 3).limit(3);
    
    let total = await OrdersCollection.find({ 'User': user._id }).countDocuments();
    let totalPages = Math.ceil(total / 3);

    res.send({order,TotalPages:totalPages});

  }catch{
    res.status(400).send('sorry something went wrong')
  }
}


/* get an orders */
let GetOrder = async (req,res)=>{
  try{
    /* get the user from jwt header and check it's validation */
    if(!isidValid(req.params.id))
    return res.status(400).send('order id is invalid');

    let user = await getUserfromJWT(req.headers.jwt, res);
    if(!user) return;

    let isOrderExist = (user.Orders).some(id => id.toString() === req.params.id);
    if(!isOrderExist) return res.status(404).send('you have no order with this id');

    let order = await OrdersCollection.findOne({_id:req.params.id});
    
    res.send(order);
  } catch(err) {
    res.status(400).send('sorry something went wrong')
  }
}


/* create order */
let placeOrder = async (req, res) => {

  /* get the user from jwt header and check it's validation */
  let user = await getUserfromJWT(req.headers.jwt, res);
  if (!user) return;

  let cart = await CartCollection.findOne({ User: user._id }).populate("CartProducts.Product").exec();
  if (cart.CartProducts.length === 0)
    return res.status(400).send("your cart is empty");

  /* insert all the cart products into a new order */
  let myorder = await AddFromCartToOrder(user,cart,req.body.shippingAddress);
  /* update quantity of products in all carts if they have the products that taken */
  await UpdateCarts(cart.CartProducts);
  
  /* after making an order empty the cart and save the changes */
  cart.CartProducts = [];
  await cart.save();

  res.send(myorder);
};


/* cancel order */
let CancelOrder = async (req,res) =>{
  try{
    /* check if the order id is valid */
    if(!isidValid(req.params.id))
    return res.status(400).send('order id is invalid');
  
    /* get the user from jwt header and check it's validation */
    let user = await getUserfromJWT(req.headers.jwt, res);
    if(!user) return;
    
    refundorder(user,req,res);
  } catch(err) {
    res.status(400).send('sorry something went wrong')
  }
}

/* confirm order */
let confirmOrder = async (req,res) =>{
  try{
    /* check if the order id is valid */
    if(!isidValid(req.params.id))
    return res.status(400).send('order id is invalid');
  
    /* get the user from jwt header and check it's validation */
    let user = await getUserfromJWT(req.headers.jwt, res);
    if(!user) return;
    
    let isOrderExist = (user.Orders).some(orders => (orders._id).toString() === req.params.id);
    if(!isOrderExist) return res.status(404).send('you have no order with this id');

    let order = await ordersCollection.findOne({_id:req.params.id}).exec();

    if(order.OrderStatus !== 'pending')
    return res.status(400).send(`the order status is already ${order.OrderStatus}`)

    let UpdatedOrder = await ordersCollection.findOneAndUpdate(
      {_id:req.params.id},{OrderStatus:'done'},{ new: true });

      await user.save();  
      return res.send(UpdatedOrder);
  } catch(err) {
    res.status(400).send('sorry something went wrong')
  }
}

module.exports = {
  GetOrder,
  placeOrder,
  CancelOrder,
  GetAllOrders,
  GetUserOrders,
  confirmOrder
};