var Ownable = artifacts.require("./Ownable.sol");
var Pausable = artifacts.require("./Pausable.sol");
var PicWitness = artifacts.require("./PicWitness.sol");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(Pausable);
  deployer.deploy(PicWitness);
};
