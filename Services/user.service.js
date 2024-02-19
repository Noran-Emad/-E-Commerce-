const User = require("../Models/user.model");
const {CreateCart} = require("../Services/Cart.service");

const createUserService = async (user) => {
  try {
    let createdUser = await User.create(user);
    await CreateCart(createdUser)
    return createdUser;
  } catch (e) {
    console.log(e);
  }
};

const findUserService = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (e) {
    console.log(e);
  }
};
const findUserEmailById = async (userId) => {
  const user = await User.findById(userId)
  if (!user) {
    console.log('User not found')
    return
  }
  return user.email
}

module.exports = {
  createUserService,
  findUserService,
  findUserEmailById
};
