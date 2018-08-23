pragma solidity ^0.4.24;

contract PicWitness {
    
    struct Picture {
        address owner;
        string description;
        uint timestamp;    
    }

    struct User {
        string[] pictureHashes;
    }

    mapping (string => Picture) pictures;
    mapping (address => User) users;

    modifier onlyPictureOwner(string pictureHash) {
        require(
            pictures[pictureHash].owner == msg.sender,
            "Only the picture owner can call this."
        );
        _;
    }

    function addPicture(string pictureHash) public {
        // TODO Prevent user from adding blank pictureHash
        // TODO Prevent user from adding duplicate pictureHash
        users[msg.sender].pictureHashes.push(pictureHash);
        pictures[pictureHash].owner = msg.sender;
        // TODO Get timestamp a better way
        pictures[pictureHash].timestamp = now;
    }

    function addPictureDescription(string pictureHash, string description) 
        public
        onlyPictureOwner(pictureHash)
    {
        pictures[pictureHash].description = description;
    }

    function getUserPictureCount() 
        public 
        view 
        returns(uint count) 
    {
        return users[msg.sender].pictureHashes.length;
    }

    function getPictureDetails(string pictureHash) 
        public 
        view 
        onlyPictureOwner(pictureHash)
        returns(string description, uint timestamp) 
    {
        return (pictures[pictureHash].description, pictures[pictureHash].timestamp);
    }

    function getPictureHash(uint index) 
        public 
        view 
        returns(string pictureHash) 
    {
        // TODO Gracefully handle invalid index
        return users[msg.sender].pictureHashes[index];
    }

    function verifyPictureOwner(address owner, string pictureHash) 
        public 
        view
        returns(bool) 
    {
        if (pictures[pictureHash].owner == owner) {
            return true;
        }
        
        return false;
    }
}