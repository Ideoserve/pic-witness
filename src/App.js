import React, { Component } from 'react'
import FileWitnessContract from '../build/contracts/FileWitness.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      fileHash: '',
      fileTimestamp: 0
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const fileWitness = contract(FileWitnessContract)
    fileWitness.setProvider(this.state.web3.currentProvider)

    var fileWitnessInstance

    this.state.web3.eth.getAccounts((error, accounts) => {
      fileWitness.deployed().then((instance) => {
        fileWitnessInstance = instance
        return fileWitnessInstance.setFileHash('test', {from: accounts[0]})
      }).then((result) => {
        return fileWitnessInstance.getFileHash.call(accounts[0])
      }).then((result) => {
        return this.setState({ fileHash: result[0], fileTimestamp: result[1] })
      })
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <hr/>
              <p>Stored file hash: {this.state.fileHash}</p>
              <p>Stored file timestamp: {this.state.fileTimestamp}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
