const {
    createUserService,
    findUserService,
  } = require("../Services/user.service");
  
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const { validateNewUser } = require("../Validators/user.validator");
  
  // Function to create new user
  const createNewUser = async (req, res) => {
    try {
      const {name, email, password } = req.body;
      const { error } = validateNewUser(req.body);
  
      if (error) {
        return res.status(400).send({ message: error.message.replace(/"/g, "") });
      }
  
      const user = await findUserService(email);
      if (user) {
        return res.send({
          message:
            "Email already exists. Please use a different email or login to your account.",
        });
      }
  
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await createUserService({name, email, passwordHash });
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
  
  // Function to get user profile with email provided in header
  const getUserProfile = async (req, res) => {
    try {
      const emailFromHeader = req.headers["email"];
      const {name, email } = await findUserService(emailFromHeader);
      res.send({name: name, email: email });
    } catch (e) {
      res.status(500).send(e.message);
    }
  };
  
  // Function to update user profile
  const updateUserProfile = async (req, res) => {
    const email = req.headers["email"];
  
    const user = await findUserService(email);
    if (!user) {
      return res.status(404).send("Email not found");
    }
  
    user.name = req.body.name;
    user.email = req.body.email;
    if (req.body.password) {
      const newPass = await bcrypt.hash(req.body.password, 10);
      user.passwordHash = newPass;
    }
  
    res.send({ message: "Profile updated successfully", updated_user: user });
  };
  
  module.exports = {
    createNewUser,
    login,
    getUserProfile,
    updateUserProfile,
  };
  