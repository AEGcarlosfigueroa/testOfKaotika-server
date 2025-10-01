const express = require('express');
const router = express.Router();

const kaotikaController = require('../controllers/kaotikaController')
const { verifyFirebaseToken } = require("../middlewares/verifyData"); // Firebase Auth

router.get("/email/:playerEmail", verifyFirebaseToken, kaotikaController.getLegendByEmail);

module.exports = router;
