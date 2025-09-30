const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

const middleware = require("../middlewares/verifyData")

router.get("/", userController.getAllUsers);

// router.post("/", middleware.verify, userController)

module.exports = router;