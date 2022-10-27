const { assert } = require("chai");
const { network, deployment, ethers, deployments } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config.js");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Basic NFT Unit Tests", function () {
      let basicNft, deployer;

      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["basicNft"]);
        basicNft = await ethers.getContract("BasicNft");
      });

      describe("Constructor", () => {
        it("Initializes the NFT correctly.", async () => {
          const name = await basicNft.name();
          const symbol = await basicNft.symbol();
          const tokenCounter = await basicNft.getTokenCounter();
          assert.equal(name, "Athena");
          assert.equal(symbol, "OE1");
          assert.equal(tokenCounter.toString(), "0");
        });
      });

      describe("Mint NFT", () => {
        beforeEach(async () => {
          const txResponse = await basicNft.mintNft();
          await txResponse.wait(1);
        });
        it("Allows users to mint an NFT, and updates correctly", async function () {
          const tokenURI = await basicNft.tokenURI(0);
          const tokenCounter = await basicNft.getTokenCounter();

          assert.equal(tokenCounter.toString(), "1");
          assert.equal(tokenURI, await basicNft.TOKEN_URI());
        });
        it("Shows the correct balance and owner of an NFT", async function () {
          const deployerAddress = deployer.address;
          const deployerBalance = await basicNft.balanceOf(deployerAddress);
          const owner = await basicNft.ownerOf("1");
          assert.equal(deployerBalance.toString(), "1");
          assert.equal(owner, deployerAddress);
        });
      });
    });
