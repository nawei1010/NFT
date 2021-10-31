var myNft = artifacts.require("../contracts/myNft.sol");

module.exports = function(deployer) {
  deployer.deploy(myNft);
};
