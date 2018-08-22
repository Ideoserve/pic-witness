pragma solidity ^0.4.24;

contract FileWitness {

    struct User {
        string[] files;
    }

    mapping (address => User) users;

    function userFileCount() public view returns(uint count) {
        return users[msg.sender].files.length;
    }

    function userFileAtIndex(uint index) public view 
        returns(string file) {
        // TODO Gracefully handle invalid index
        return users[msg.sender].files[index];
    }

    function addFile(string file) public {
        // TODO Prevent user from adding blank files
        users[msg.sender].files.push(file);
    }
}