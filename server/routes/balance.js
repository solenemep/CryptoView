const express = require("express");

const { getBalance } = require("../controllers/balanceController.js");

const router = express.Router();

// GET balance
router.get("/:tokenAddress/:walletAddress", getBalance);

module.exports = router;
