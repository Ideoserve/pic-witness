# File Witness
Proove ownership and existence of a file by uploading it to a decentralized storage network (IPFS) and storing the file hash in the Ethereum blockchain.

## Why should I use this?
File storage services like Dropbox and Google Drive require you to trust a corporate entity with ownership of your data. File Witness is a decentralized alternative that is distributed using InterPlanetary File System (IPFS), a peer-to-peer network, and notarized using the Ethereum public blockchain. This provides the following benefits:

- Censorship resistance
- Proovable ownership

## Getting Started
Install prerequisites. This application requires Node, Truffle and Ganache-CLI.

```
npm install -g truffle
npm install -g ganache-cli
```

Clone this repository.

```
git clone https://github.com/myutzy/file-witness.git
```

Compile the smart contracts.

```
truffle compile
```

Migrate the smart contracts.

```
truffle migrate
```

Switch to a different terminal and start an Ethereum development blockchain using Ganache-CLI.

```
ganache-cli
```