pragma solidity ^0.4.24;

contract FileWitness {
    string ipfsHash;
 
    function sendHash(string x) public {
        ipfsHash = x;
    }

    function getHash() public view returns (string x) {
        return ipfsHash;
    }
}