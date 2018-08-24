pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PicWitness.sol";

/// These unit tests ensure that picture-related operations
/// in the PicWitness smart contract function correctly.
/// The tests cover all general picture operations.
contract TestPicWitness {

    PicWitness instance;
    string pictureHash;

    function beforeEach() public {
        instance = new PicWitness();

        pictureHash = "testPictureHash";

        instance.addPicture(pictureHash);
    }

    function testUserCanAddPicture() public {
        Assert.equal(instance.getPictureHash(0), pictureHash,
        "User should be able to add picture.");
    }

    function testUserCanAddPictureDescription() public {
        string memory expected = "testPictureDescription";

        instance.addPictureDescription(pictureHash, expected);

        (string memory description, ) = instance.getPictureDetails(pictureHash);

        Assert.equal(description, expected,
        "User should be able to add picture description.");
    }

    function testUserCanGetPictureCount() public {
        Assert.equal(instance.getUserPictureCount(), 1,
        "User should be able to get their total number of pictures.");
    }

    function testUserCanGetPictureDescription() public {
        string memory expected = "testPictureDescription";

        instance.addPictureDescription(pictureHash, expected);

        (string memory description, ) = instance.getPictureDetails(pictureHash);

        Assert.equal(description, expected,
        "User should be able to get the picture description.");
    }

    function testUserCanGetPictureHash() public {
        Assert.equal(instance.getPictureHash(0), pictureHash,
        "User should be able to get the picture hash.");
    }

}
