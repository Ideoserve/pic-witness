require('dotenv').config();
var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = process.env["RINKEBY_PRIVATE_KEY"]

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/fpFIJiUwRlkA2YovV5al")
      },
      network_id: 3
    }
  }
};
