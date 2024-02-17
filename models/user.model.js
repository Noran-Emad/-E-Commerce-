const { mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 255,
  },
  passwordHash: {
    type: String,
    required: true,
    unique: true,
    minLength: 8,
    maxLength: 1024,
  },
  Cart: {
    type: mongoose.Types.ObjectId,
    ref: "Cart",
    default: { _id: new mongoose.Types.ObjectId().toHexString() },
  },
  Orders: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Order",
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
