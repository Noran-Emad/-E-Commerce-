const mongoose = require('mongoose');

// Define the Payment schema
const paymentSchema = new mongoose.Schema({
    _id: { 
        type: String, 
        required: true,
    },
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
    status:{
        type:String,
        enum:['success','failed','pending'],
        default:'pending'
    },
    // TotalPrice:{
    //     type:Number,
    //     required:true
    // }
})

// Export the Payment model
module.exports = mongoose.model('Payment', paymentSchema);
