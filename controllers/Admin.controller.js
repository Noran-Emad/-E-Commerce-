const expree = require("express")
const User = require("../models/user.model")

const GetAllUsers = async (req, res) => {
    const users = await User.find();
    res.send(users);
}

module.exports = {
    GetAllUsers,
}