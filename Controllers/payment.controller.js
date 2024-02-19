const express = require('express');
const app = express();
app.use(express.json());
const stripe = require('stripe')('sk_test_51OksNNIDtHJ4MMbwBeJEMFil0umzkVZWvXKp6nxRwjt46rrrz8s7SbFCO4fxPify8YmIN4VJ9G1VTE1l9bpX2h6F00GMYI71Jp');
const {findUserEmailById} = require('../Services/user.service');
const payment=async (req, res) => {
    try{
    const session = await stripe.checkout.sessions.create({
      line_items: req.body.order?.map((item) => (
        {
        price_data: {
          currency: 'egp',
          unit_amount:Math.round(item.price*100), 
          product_data: {
            name: item.name,
            description: item.description,
          },
        },
        quantity: item.amount,}

      )
      ),
      mode: 'payment',
       success_url: `http://localhost:3000/orders?success=true`,
       cancel_url: `http://localhost:3000/cart?canceled=true`,
       customer_email: await findUserEmailById(req.body.user),
    }) 
    res.status(200).json({ status: 'success', session })}
    catch (error) {
    console.error('Error processing payment:', error.message);
    res.status(500).json({ error: 'An error occurred while processing the payment.' });
}
}
module.exports={payment}
