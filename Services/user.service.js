const User = require("../Models/user.model");

const createUserService = async (user) => {
  try {
    return await User.create(user);
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

module.exports = {
  createUserService,
  findUserService,
};
