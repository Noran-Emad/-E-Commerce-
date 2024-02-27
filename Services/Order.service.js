const ordersCollection = require("../Models/order.model");
const ProductsCollection = require("../Models/Product.model");

let AddFromCartToOrder = async (user,cart) => {
  /* create order and insert cart data into it */
  let neworder = await ordersCollection.create({
    User:user._id,
    TotalPrice: cart.TotalPrice,
    Products: cart.CartProducts,
  });

  await user.Orders.push(neworder);
  await user.save();

  /* reduce the taken quantity from the product quantity */
  for (const obj of cart.CartProducts) {
    obj.Product.productQuantity -= obj.Quantity;
    await obj.Product.save();
  }
  
  await cart.save();
  return neworder;
};


let refundorder = async (user,req,res) => {
  
  /* check if the order exist amoung this user orders */
  let isOrderExist = (user.Orders).some(orders => (orders._id).toString() === req.params.id);
  if(!isOrderExist) return res.status(404).send('you have no order with this id');

  let order = await ordersCollection.findOne({_id:req.params.id}).exec();
  
  /* if the order is done or cancelld */
  if(order.OrderStatus !== 'pending')
   return res.status(400).send(`the order status is already ${order.OrderStatus}`)

  /* change the order status to cancelled */
  let UpdatedOrder = await ordersCollection.findOneAndUpdate(
  {_id:req.params.id},{OrderStatus:'canceled'},{ new: true });


  /* return back the taken order products quantity to the product quantity */
  for (let orderitem of UpdatedOrder.Products) {
    /* increase the stock with the cancelld order products quantity */
    await ProductsCollection.findOneAndUpdate(
      { _id: orderitem.Product }, 
      { $inc: { productQuantity: orderitem.Quantity } }
  );
  }

  await user.save();  
  return res.send(UpdatedOrder);
}



let refundorderTimeOut = async (user,orderid) => {
  
  let order = await ordersCollection.findOne({_id:orderid}).exec();
  
  if(order.OrderStatus !== 'pending') return;

  /* change the order status to cancelled */
  let UpdatedOrder = await ordersCollection.findOneAndUpdate(
  {_id:orderid},{OrderStatus:'canceled'},{ new: true });

  /* return back the taken order products quantity to the product quantity */
  for (let orderitem of UpdatedOrder.Products) {
    /* increase the stock with the cancelld order products quantity */
    await ProductsCollection.findOneAndUpdate(
      { _id: orderitem.Product }, 
      { $inc: { productQuantity: orderitem.Quantity } }
  );
  }

  await user.save();  
}



module.exports = {
  refundorder,
  AddFromCartToOrder,
  refundorderTimeOut
}