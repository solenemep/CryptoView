const process = require("process");
const { ethers } = require("ethers");
const { Web3 } = require("web3");

const web3 = new Web3(
  `https://eth-mainnet.g.alchemy.com/v2/zFxefaPbFSf4Abv4MBYEJXcChxMpqKDg`
);

const erc20Abi = [
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

const getBalance = async (req, res) => {
  const { tokenAddress, walletAddress } = req.params;

  if (!tokenAddress || !walletAddress) {
    return res
      .status(400)
      .json({ error: "Token address and wallet address are required" });
  }

  try {
    const contract = new web3.eth.Contract(erc20Abi, tokenAddress);
    const balance = await contract.methods.balanceOf(walletAddress).call();
    const decimals = await contract.methods.decimals().call();
    const formattedBalance = ethers.formatUnits(balance, decimals);

    res.json({ balance: formattedBalance });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the balance" });
  }
};

module.exports = { getBalance };
