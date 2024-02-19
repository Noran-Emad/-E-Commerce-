const mongoose = require('mongoose');

// Define the Payment schema
const paymentSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Order:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    }
})
// Create the Payment model
const Payment = mongoose.model('Payment', paymentSchema);

// Export the Payment model
module.exports = Payment;
