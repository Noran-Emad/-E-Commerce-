const express = require("express");
const {
  createNewUser,
  login,
  getUserProfile,
  updateUserProfile
} = require("../Controllers/user.controller");
const {auth} = require("../Middleware/auth");
const router = express.Router();



// POST requst for create new user
router.post("/register", createNewUser);

// POST requst for making user's login
router.post("/login", login);

// GET request for fetching user profile
router.get("/profile", auth, getUserProfile);

// POST request for updating user profile
router.patch("/profile", auth, updateUserProfile);

module.exports = router;
