# Avoiding Common Attacks

The following risk mitigations were considered and applied when creating the PicWitness smart contract:

## Gas Limits

To avoid the high gas cost of array iteration within a smart contract, PicWitness requires the implementer to iterate by first getting the total number of elements in the array, then getting each individual element in a separate call.

## Integer Arithmetic Overflow

The serious risks of integer arithmetic overflow were consdering during the smart contract development. However, no arithmetic is performed in this contract.

## Logic Bugs

Numerous testing has been performed with random inputs using both the unit tests and the JavaScript view to ensure the validity of the smart contract logic.

## Malicious Creator

In order to maintain the trustlessness of the contract, very little power is granted to the contract owner. The owner has the ability to pause and unpause the contract in the unlikely event that emergency bugfixes are necessary.

## Tx.Origin Problem

To prevent malicious intermediaries from making transactions that impersonate other users, the use of "tx.origin" to identify the transaction sender has been avoided. Instead, "msg.sender" is used.