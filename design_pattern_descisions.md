# Design Patterns

The following design pattern decisions and best practices have been implemented to increase the security of the PicWitness contract.

## Circuit Breaker

The PicWitness contract uses `Pausable.sol` to allow the owner to pause / resume contract functionality.

## Fail early and fail loud

The PicWitness contract functions use modifers and require statements to throw function exceptions as soon as possible.

## Restrict Access

The `Pausable.sol` contract uses `Ownable.sol` to provide the contract owner these basic authorization functions:

- Set a new contract owner
- Optionally require functions to be called by the current contract owner
- Renounce contract ownership

## Other design patterns

Since the scope of this application is limited to adding, editing and verifying picture data, the use of several design patterns was not relavant. These patterns include:

- Auto Deprecation: This isn't necessary since the contract will persist indefinitely once deployed to the mainnet.
- Mortal: The immutability of the picture storage would be compromised if users knew their pictures could vanish when the contract is destroyed.
- Pull over Push Payments: This isn't relavant since this contract doesn't provide payment functionality.
- State Machine: Since the overall state of this application doesn't progress to different stages, the State Machine pattern is not necessary.
- Speed Bump: This isn't necessary during testing and soft-launch, but could be useful to implement to prevent users from flooding the picture upload functionality with requests.