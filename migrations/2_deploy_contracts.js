var FileWitness = artifacts.require("./FileWitness.sol");

module.exports = function(deployer) {
  deployer.deploy(FileWitness);
};
