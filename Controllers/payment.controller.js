const express = require('express');
const { getUserfromJWT } = require('../Services/validator.service');
const { isidValid } = require('../Services/validator.service');
const {refundorderpayment} = require('../Services/Order.service');
const OrdersCollection = require("../Models/order.model");
const PaymentCollection = require("../Models/payment.model");
const { default: Stripe } = require('stripe');
const ProductModel = require('../Models/Product.model');
const app = express();
app.use(express.json());
const stripe = require('stripe')('sk_test_51OoqmoFEukyPARz9iHniLJZCKXAZ4bOaDGDAEsS0VcPdiULDZJLYy38PrtpXL7b7O9rAOeKEX0Jq30rUk1Zu71j000Bp7JydvH');



const successpayment = async (req, res) => {

      let payment = await PaymentCollection.findOne({Order:req.params.id}).exec();
      if(!payment) return res.status(404).send("there is no payment exist with that id");
      if(payment.status !== 'pending')
      return res.status(400).send(`the payment status is already ${payment.status}`)
      let order = await OrdersCollection.findById(payment.Order).exec();
      if (!order)
      return res.status(404).send("there is no order exist with that id");

      /* if the order is done or cancelld */
      if(order.OrderStatus !== 'pending')
      return res.status(400).send(`the order status is already ${order.OrderStatus}`)
      order.OrderStatus = 'done';
      payment.status = 'success';
      order.save();
      payment.save();
      res.redirect('http://localhost:4200/');
    }



const failedpayment = async (req, res) => {
  let payment = await PaymentCollection.findOne({Order:req.params.id}).exec();
  if(!payment) return res.status(404).send("there is no payment exist with that id");

  if(payment.status !== 'pending')
  return res.status(400).send(`the payment status is already ${payment.status}`)

  
  let order = await OrdersCollection.findById(payment.Order).exec();
  if (!order)
  return res.status(404).send("there is no order exist with that id");

  /* if the order is done or cancelld */
  if(order.OrderStatus !== 'pending')
  return res.status(400).send(`the order status is already ${order.OrderStatus}`)

  await refundorderpayment(order);
  payment.status = 'failed';
  order.save();
  payment.save();
  res.redirect('http://localhost:4200/orders');
}


const payment = async (req, res) => {

      // /* get the user from jwt header and check it's validation */
      let user = await getUserfromJWT(req.headers.jwt, res);
      if (!user) return;
      
      /* if user enter invalid order id in the request */
      if (!isidValid(req.params.id))
      return res.status(400).send("order id is invalid");

      let order = await OrdersCollection.findById(req.params.id).populate({path:'Products',populate:{path:'Product',model:ProductModel}}).exec();
      if (!order)
      return res.status(404).send("there is no order exist with that id");
    
      /* If the order isn't an order from this user */
      if(!(user.Orders.includes(order._id)))
      return res.status(404).send("there is no order exist in your orders");

      /* if the order is done or cancelld */
      if(order.OrderStatus !== 'pending')
      return res.status(400).send(`the order status is already ${order.OrderStatus}`)

      /* creating a payment session transaction */
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: order.Products.map(item => {
          return {
            price_data: {
              currency: 'egp',
              product_data: {
                name: item.Product.ProductName,
                images: [item.Product.productImage],
              },
              unit_amount: item.Product.productPrice * 100,
            },
            quantity: item.Quantity,
          };
        }),
        mode: 'payment',
        success_url: `http://localhost:3000/api/payment/success/${order._id}`,
        cancel_url: `http://localhost:3000/api/payment/failed/${order._id}`,
        client_reference_id: order._id
      });
      
      let payment = await PaymentCollection.create({_id:session.id,User:user._id,Order:order._id});
      
      res.send({
       'paymentlink': session.url,
       'payment':payment
      })
  }

  /* check payment result by order id */
  const PaymentStatus = async (req,res) =>{
    let payment = await PaymentCollection.findOne({Order:req.params.id}).exec();
    if(!payment) return res.status(404).send("there is no payment exist with that id");

    return res.send(`the payment status is ${payment.status}`)
  }

module.exports={payment,successpayment,failedpayment,PaymentStatus}