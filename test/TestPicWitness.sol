pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PicWitness.sol";

contract TestPicWitness {

    PicWitness picWitness = PicWitness(DeployedAddresses.PicWitness());

    function testUserCanAddPicture() public {
        PicWitness instance = new PicWitness();

        string memory expected = "testPictureHash";

        instance.addPicture(expected);

        Assert.equal(instance.getPictureHash(0), expected,
        "User should be able to add picture.");
    }

    function testUserCanAddPictureDescription() public {
        PicWitness instance = new PicWitness();

        string memory pictureHash = "testPictureHash";

        instance.addPicture(pictureHash);

        string memory expected = "testPictureDescription";

        instance.addPictureDescription(pictureHash, expected);

        (string memory description, ) = instance.getPictureDetails(pictureHash);

        Assert.equal(description, expected,
        "User should be able to add picture description.");
    }

    function testUserCanGetPictureCount() public {
        PicWitness instance = new PicWitness();

        string memory pictureHash = "testPictureHash";

        instance.addPicture(pictureHash);

        Assert.equal(instance.getUserPictureCount(), 1,
        "User should be able to get their total number of pictures.");
    }

    function testUserCanGetPictureDescription() public {
        PicWitness instance = new PicWitness();

        string memory pictureHash = "testPictureHash";

        instance.addPicture(pictureHash);
        
        string memory expected = "testPictureDescription";

        instance.addPictureDescription(pictureHash, expected);

        (string memory description, ) = instance.getPictureDetails(pictureHash);

        Assert.equal(description, expected,
        "User should be able to get the picture description.");
    }

    function testUserCanGetPictureHash() public {
        PicWitness instance = new PicWitness();

        string memory pictureHash = "testPictureHash";

        instance.addPicture(pictureHash);

        Assert.equal(instance.getPictureHash(0), pictureHash,
        "User should be able to get the picture hash.");
    }

}
