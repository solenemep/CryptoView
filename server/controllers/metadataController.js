const MetadataSchema = require("../models/metadataModel.js");

const { Web3 } = require("web3");

const web3 = new Web3(
  `https://eth-mainnet.g.alchemy.com/v2/zFxefaPbFSf4Abv4MBYEJXcChxMpqKDg`
);

const erc721Abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const getMetadata = async (req, res) => {
  const { tokenAddress, tokenId } = req.params;

  if (!tokenAddress || !tokenId) {
    return res
      .status(400)
      .json({ error: "Token address and token id  are required" });
  }

  try {
    const contract = new web3.eth.Contract(erc721Abi, tokenAddress);
    const metadataUri = await contract.methods.tokenURI(tokenId).call();

    const response = await fetch(metadataUri);
    const { name, description, image } = await response.json();

    const metadataData = new MetadataSchema({
      tokenAddress,
      tokenId,
      name,
      description,
      imageUrl: image,
    });
    await metadataData.save();

    return res.json({ name, description, imageUrl: image });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching NFT metadata." });
  }
};

module.exports = { getMetadata };
