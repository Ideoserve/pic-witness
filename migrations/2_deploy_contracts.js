var PicWitness = artifacts.require("./PicWitness.sol");

module.exports = function(deployer) {
  deployer.deploy(PicWitness);
};
