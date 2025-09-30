const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { verifyFirebaseToken } = require("../middlewares/verifyData"); // Firebase Auth

// Public route — anyone can access
router.get("/", verifyFirebaseToken, userController.getAllUsers);

// Protected route — only users with valid ID token and verified email
router.post("/", verifyFirebaseToken, userController.getAllUsers);

module.exports = router;
