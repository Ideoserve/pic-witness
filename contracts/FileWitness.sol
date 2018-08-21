pragma solidity ^0.4.24;

contract FileWitness {
    mapping (address => string) ipfsHashes;

    event FileHashSet(
        string _message
    );

    function setFileHash(string ipfsHash) public {
        ipfsHashes[msg.sender] = ipfsHash;
        emit FileHashSet("Data stored successfully!");
    }
 
    function getFileHash(address account) public view returns(string) {
        return (ipfsHashes[account]);
    }
}