pragma solidity ^0.4.24;

import "./Pausable.sol";

/// @title PicWitness
contract PicWitness is Pausable {

    // Contains details about a single picture.
    struct Picture {
        address owner;
        string description;
        uint timestamp;    
    }

    // Contains a list of picture hashes.
    struct User {
        string[] pictureHashes;
    }

    // Stores a 'Picture' struct for each picture hash.
    mapping (string => Picture) pictures;

    // Stores a 'User' struct for each known address.
    mapping (address => User) users;

    modifier notEmptyString(string input) {
        require(
            bytes(input).length > 0,
            "String cannot be empty."
        );
        _;
    }

    modifier onlyPictureOwner(string pictureHash) {
        require(
            pictures[pictureHash].owner == msg.sender,
            "Only the picture owner can call this."
        );
        _;
    }

    /// Add a picture hash to the current user's picture hash array.
    /// Add picture details by setting the owner and timestamp.
    function addPicture(string pictureHash) 
        public
        notEmptyString(pictureHash)
        whenNotPaused
    {
        users[msg.sender].pictureHashes.push(pictureHash);
        pictures[pictureHash].owner = msg.sender;
        pictures[pictureHash].timestamp = now;
    }
    
    /// Add a description to a picture. 
    function addPictureDescription(string pictureHash, string description) 
        public
        notEmptyString(pictureHash)
        notEmptyString(description)
        whenNotPaused
        onlyPictureOwner(pictureHash)
    {
        pictures[pictureHash].description = description;
    }

    /// Get the total number of pictures owned by the current user.
    function getUserPictureCount() 
        public 
        view 
        returns(uint count) 
    {
        return users[msg.sender].pictureHashes.length;
    }

    /// Get the details for a picture.
    function getPictureDetails(string pictureHash) 
        public
        view
        notEmptyString(pictureHash)
        onlyPictureOwner(pictureHash)
        returns(string description, uint timestamp) 
    {
        return (pictures[pictureHash].description, pictures[pictureHash].timestamp);
    }

    /// Get a picture hash by its array index.
    function getPictureHash(uint index) 
        public 
        view 
        returns(string pictureHash) 
    {
        require(
            users[msg.sender].pictureHashes.length > index, 
            "Invalid picture index provided."
        );
        return users[msg.sender].pictureHashes[index];
    }

    /// Verify user ownership of a picture.
    function verifyPictureOwner(address owner, string pictureHash) 
        public 
        view
        notEmptyString(pictureHash)
        returns(bool) 
    {
        return (pictures[pictureHash].owner == owner);
    }
}