const express = require("express");

const { getMetadata } = require("../controllers/metadataController");

const router = express.Router();

// GET metadata
router.get("/:tokenAddress/:tokenId", getMetadata);

module.exports = router;
