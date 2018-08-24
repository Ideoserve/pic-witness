# Design Patterns

The following design pattern decisions and best practices have been implemented to increase the security of the PicWitness contract:

## Circuit Breaker

The PicWitness contract uses `Pausable.sol` to allow the owner to pause / resume contract functionality.

## Fail early and fail loud

The PicWitness contract functions use modifers and require statements to throw function exceptions as soon as possible.

## Restrict Access

The `Pausable.sol` contract uses `Ownable.sol` to provide the contract owner these basic authorization functions:

- Set a new contract owner
- Optionally require functions to be called by the current contract owner
- Renounce contract ownership