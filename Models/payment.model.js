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
    },
    NameOnVisa:{
        type:String,
        required:true,
        minLength:3
    },
    VisaCardNumber:{
        type:Number,
        required:true,
        min:1000000000000000,
        max:9999999999999999
    },
    Cvv:{
        type:Number,
        required:true,
        min:100,
        max:999
    }
})

// Export the Payment model
module.exports = mongoose.model('Payment', paymentSchema);
