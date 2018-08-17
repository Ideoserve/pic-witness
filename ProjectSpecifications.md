●  	A project README.md that explains your project
○  	What does your project do?
○  	How to set it up
■  	Run a local development server
 
●  	Your project should be a truffle project
○  	All of your contracts should be in a contracts directory
■  	Truffle compile should successfully compile contracts
○  	Migration contract and migration scripts should work
■  	Truffle migrate should successfully migrate contracts to a locally running ganache-cli test blockchain on port 8545
○  	All tests should be in a tests directory
■  	Running truffle test should migrate contracts and run your tests
 
●  	Smart Contract code should be commented according to the specs in the documentation
 
●  	Create at least 5 tests for each smart contract
○  	Write a sentence or two explaining what the tests are covering, and explain why you wrote those tests
 
●  	A development server to serve the front end interface of the application
○  	It can be something as simple as the lite-server used in the truffle pet shop tutorial
 
●  	A document called design_pattern_desicions.md that explains why you chose to use the design patterns that you did.
●  	A document called avoiding_common_attacks.md that explains what measures you took to ensure that your contracts are not susceptible to common attacks. (Module 9 Lesson 3)
 
●  	Implement a library or an EthPM package in your project
○  	If your project does not require a library or an EthPM package, demonstrate how you would do that in a contract called LibraryDemo.sol
 
Requirements
●  	User Interface Requirements:
○  	Run the app on a dev server locally for testing/grading
○  	You should be able to visit a URL and interact with the application
■  	App recognizes current account
■  	Sign transactions using MetaMask / uPort
■  	Contract state is updated
■  	Update reflected in UI
 
●  	Test Requirements:
○  	Write 5 tests for each contract you wrote
■  	Solidity or JavaScript
○  	Explain why you wrote those tests
○  	Tests run with truffle test
 
●  	Design Pattern Requirements:
○  	Implement emergency stop
○  	What other design patterns have you used / not used?
■  	Why did you choose the patterns that you did?
■  	Why not others?
 
●  	Security Tools / Common Attacks:
○  	Explain what measures you’ve taken to ensure that your contracts are not susceptible to common attacks
 
●  	Use a library
○  	Via EthPM or write your own

  
●  	Stretch requirements (for bonus points, not required):
○  	Deploy your application onto the Rinkeby test network. Include a document called deployed_addresses.txt that describes where your contracts live on the test net.
○  	Integrate with an additional service, maybe even one we did not cover in this class

For example:
■      IPFS
■      uPort
■      Ethereum Name Service
■      Oracle


Description: This application allows users to prove existence of some information by showing a time stamped picture/video.
 
Data could be stored in a database, but to make it truly decentralized consider storing pictures using something like IPFS. The hash of the data and any additional information is stored in a smart contract that can be referenced at a later date to verify the authenticity.
 
User Stories:
A user logs into the web app. The user can upload some data (pictures/video) to the app, as well as add a list of tags indicating the contents of the data.
 
The app reads the user’s address and shows all of the data that they have previously uploaded.
 
Users can retrieve necessary reference data about their uploaded items to allow other people to verify the data authenticity.
 
Here are some suggestions for additional components that your project could include:
●  	Make your app mobile friendly, so that people can interact with it using a web3 enabled mobile browser such as Toshi or Cipher.
○  	Allow people to take photos with their mobile device and upload them from there
●  	Deploy your dApp to a testnet
○  	Include the deployed contract address so people can interact with it
○  	Serve the UI from IPFS or a traditional web server
