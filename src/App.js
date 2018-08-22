import React, { Component } from 'react'
import FileWitnessContract from '../build/contracts/FileWitness.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './utils/IPFS.js'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      fileWitnessInstance: null,
      account: null,
      fileCount: 0,
      files: [],
      buffer: null
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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

    this.state.web3.eth.getAccounts((error, accounts) => {
      fileWitness.deployed().then((instance) => {
        this.setState({ fileWitnessInstance: instance })
        console.log('Contract deployed to ' + this.state.fileWitnessInstance.address)
        this.setState({ account: accounts[0] })
        console.log('Using account ' + this.state.account)
      }).then(() => {
        this.getFileCount()
      })
    })
  }

  getFileCount() {
    this.state.fileWitnessInstance.userFileCount.call().then((result) => {
      var currentCount = this.state.fileCount
      var newCount = parseInt(result, 10)
      this.setState({ fileCount: newCount })
      if (currentCount !== newCount) {
        this.getFiles()
      }
    })
  }

  getFiles() {
    if (this.state.fileCount > 0) {
      for (var i = 0; i < this.state.fileCount; i++) {
        console.log("Getting file at index " + i)
        this.state.fileWitnessInstance.userFileAtIndex.call(i.toString())
        .then((result) => {
          console.log("Got file: " + result)
          this.setState({
            files: this.state.files.concat({
              hash: result
            })
          })
        })
      }
    }
  }

  captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  onSubmit(event) {
    event.preventDefault()
    console.log('Submitting...')

    // TODO Figure out a way to eliminate these extra variables (can't access this.state from within file add)
    const buffer = this.state.buffer
    const instance = this.state.fileWitnessInstance
    const account = this.state.account
    const hash = ''

    ipfs.files.add(buffer, function (error, files) {
      if(error) {
        console.log(error)
        return
      }

      const hash = files[0].hash

      console.log('File sent to IPFS. Hash: ' + hash)
      
      instance.addFile(hash, { from: account }).then((r) => {
        console.log('ifpsHash', hash)
      })
    })

    this.setState({ fileHash: hash })
    
    this.getFileCount()
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">File Witness</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h2>Upload Image</h2>
              <form onSubmit={this.onSubmit} >
                <input type='file' onChange={this.captureFile} />
                <input type='submit' />
              </form>
              <h2>Your files: {this.state.fileCount}</h2>
              {this.state.files.map((file, index) => (
                <p key={index}>{file.hash}</p>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
