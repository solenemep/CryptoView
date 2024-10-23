const mongoose = require("mongoose");

const MetadataSchema = new mongoose.Schema(
  {
    contractAddress: { type: String, required: true },
    tokenId: { type: String, required: true },
    name: { type: String },
    description: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Metadata", MetadataSchema);
