const { network } = require("hardhat");
const { developmentChains } = requir("../helper-hardhat-config");
const { verify } = require("../utils.verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = getNamedAccounts;
  log("-----------------------------------");
  const args = [];
  const basicNft = await deploy("BasicNft", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(basicNft.address, args);
  }
};
