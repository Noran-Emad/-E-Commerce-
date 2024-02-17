const express = require("express");
let jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());

const { default: mongoose } = require("mongoose");
const UsersCollection = require("../Models/user.model");

/* check weither if id user enters is a valid id */
let isidValid = (id) => mongoose.Types.ObjectId.isValid(id);

/* get the user from jwt header token */
let getUserfromJWT = async (token, res) => {
  try {
    let { email } = jwt.verify(token, process.env.jwtkey);
    if (!email) return res.status(400).send("invalid token");

    let user = await UsersCollection.findOne({email:email}).exec();

    if (!user) res.status(404).send("There is no user exist with that id");

    return user;
  } catch (err) {
    res.status(400).send("invalid token");
  }
  return false;
};

module.exports = {
  isidValid,
  getUserfromJWT,
};
