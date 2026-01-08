const express = require("express");
const userRouter = express.Router();

const userData = require("../controllers/userController");
const userAuth = require("../middleware/userAuth");

// Protected: returns profile for current user
userRouter.get("/user-data", userAuth, userData);

module.exports = userRouter;