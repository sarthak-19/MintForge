const NftMarketpalce = artifacts.require("NftMarketplace");

module.exports = function(deployer) {
  deployer.deploy(NftMarketpalce);
}