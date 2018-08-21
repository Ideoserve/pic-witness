pragma solidity ^0.4.24;

contract FileWitness {
    mapping (address => string) ipfsHashes;
    mapping (address => uint) timestamp;

    event FileHashSet(
        string _message
    );

    function setFileHash(string ipfsHash) public {
        ipfsHashes[msg.sender] = ipfsHash;
        timestamp[msg.sender] = now;
        emit FileHashSet("Data stored successfully!");
    }
 
    function getFileHash(address account) public view returns(string, uint) {
        return (ipfsHashes[account], timestamp[account]);
    }
}