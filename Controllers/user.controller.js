const {
  createUserService,
  findUserService,
} = require("../Services/user.service");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  validateNewUser,
  validateUpdateUser,
} = require("../Validators/user.validator");
const User = require("../Models/user.model");

// Function to create new user
const createNewUser = async (req, res) => {
  try {
    const { name, email, password, address} = req.body;
    const { error } = validateNewUser(req.body);

    if (error) {
      return res.status(400).send({ message: error.message.replace(/"/g, "") });
    }

    const user = await findUserService(email);
    if (user) {
      return res.status(409).send({
        message:
          "Email already exists. Please use a different email or login to your account.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await createUserService({
      name,
      email,
      passwordHash,
      address
    });
    res.send(newUser);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

// Function to handle user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).send({ message: "Incorrect email or password." });
    }

    const user = await findUserService(email);
    if (!user) {
      return res.status(401).send({ message: "Incorrect email or password." });
    }

    const isValidatePassword = await bcrypt.compare(
      password,
      user.passwordHash
    );
    if (!isValidatePassword) {
      return res.status(401).send({ message: "Incorrect email or password" });
    }

    const token = jwt.sign({ email }, "myjwtsecret", { expiresIn: "1h" });
    res
      .header({ jwt: token })
      .send({ token: token, message: "access granted" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

// Function to get user profile
const getUserProfile = async (req, res) => {
  try {
    res.send({
      name: req.user.name,
      email: req.user.email,
      address: req.user.address,
      phoneNumber: req.user.phoneNumber
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

// Function to update user profile
const updateUserProfile = async (req, res) => {
  try {

   
    const {error,value}=validateUpdateUser(req.body);
        if(error){
            res.status(400).send({message:"Invalid form field.."})
            return;
        }

    const user = req.user;
    const email = user.email;

    if (value.password) {
      const passwordHash = await bcrypt.hash(value.password, 10);
      await User.updateOne({ email }, { passwordHash });
    }

    await User.updateOne({ email }, req.body);
    const updatedUser = await findUserService(email);

    res.send({
      message: "Profile updated successfully",
      updated_user: updatedUser,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

module.exports = {
  createNewUser,
  login,
  getUserProfile,
  updateUserProfile,
};
