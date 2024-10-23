const express = require("express");

const { transferTokens } = require("../controllers/transferController");

const router = express.Router();

// POST transfer
router.post("/", transferTokens);

module.exports = router;
