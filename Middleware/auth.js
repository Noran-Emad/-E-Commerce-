const User = require("../Models/user.model");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.headers["jwt"];
    if (!token) {
      return res.status(401).send({ message: "Unauthorized user" });
    }

    const payload = jwt.verify(token, "myjwtsecret");
    const { email } = payload;
  
 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Unauthorized user" });
    }

    next();
  } catch (e) {
    return res.status(401).send({ message: "Unauthorized user" });
  }
};

module.exports = { auth };
