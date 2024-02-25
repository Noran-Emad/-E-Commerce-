const express = require('express');
const { getUserfromJWT } = require('../Services/validator.service');
const { isidValid } = require('../Services/validator.service');
const { PaymentValidation } = require('../Validators/payment.validator');
const OrdersCollection = require("../models/Order.model");
const PaymentCollection = require("../Models/payment.model");
const app = express();
app.use(express.json());

const payment = async (req, res) => {
  let { error, value } = await PaymentValidation(req.body);
  if (error) return await res.status(400).send(error.details[0].message);

    try {
      /* get the user from jwt header and check it's validation */
      let user = await getUserfromJWT(req.headers.jwt, res);
      if (!user) return;
      
      /* if user enter invalid order id in the request */
      if (!isidValid(req.params.id))
      return res.status(400).send("order id is invalid");

      let order = await OrdersCollection.findById(req.params.id).exec();
      if (!order)
      return res.status(404).send("there is no order exist with that id");

      /* If the order isn't an order from this user */
      if(!(user.Orders.includes(order._id)))
      return res.status(404).send("there is no order exist in your orders");

      /* if the order is done or cancelld */
      if(order.OrderStatus !== 'pending')
      return res.status(400).send(`the order status is already ${order.OrderStatus}`)

      /* Update the Order Statues to be done */
      order.OrderStatus = 'done';
      await order.save();
      /* creating a payment transaction */
    let createdtransaction = await PaymentCollection.create({
      VisaCardNumber:req.body.VisaCardNumber,
      NameOnVisa:req.body.NameOnVisa,
      Cvv:req.body.Cvv,
      Order:order._id,
      User:user._id,
    });
     await res.send(createdtransaction);
    } catch (err) {
      res.status(400).send("sorry something went wrong");
    }
  }

module.exports={payment}