const TransferSchema = require("../models/transferModel.js");
const process = require("process");
const { Web3 } = require("web3");

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://sepolia.infura.io/v3/fb1e23cb69864f36a872c26186db94e5`
  )
);

const erc20Abi = [
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
const tokenAddress = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
const contract = new web3.eth.Contract(erc20Abi, tokenAddress);

const transferTokens = async (req, res) => {
  const { to, amount } = req.body;

  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  const from = account.address;

  const gasEstimate = await contract.methods
    .transfer(to, web3.utils.toWei(amount, "ether"))
    .estimateGas({ from: from });

  const tx = {
    from: from,
    to: tokenAddress,
    gas: gasEstimate,
    gasPrice: await web3.eth.getGasPrice(),
    data: contract.methods
      .transfer(to, web3.utils.toWei(amount, "ether"))
      .encodeABI(),
  };

  try {
    const signedTx = await web3.eth.accounts.signTransaction(
      tx,
      process.env.PRIVATE_KEY
    );
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    const transfer = new TransferSchema({
      from: from,
      to: to,
      amount: amount,
      transactionHash: receipt.transactionHash,
    });
    await transfer.save();

    res
      .status(200)
      .json({ message: "Transfer successful", transfer: transfer });
  } catch (error) {
    res.status(500).json({ message: "Transfer failed", error: error.message });
  }
};

module.exports = { transferTokens };
