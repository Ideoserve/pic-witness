import React, { Component } from 'react'
import FileWitnessContract from '../build/contracts/FileWitness.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './utils/IPFS.js'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './css/grids-responsive-min.css'
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
    const { buffer } = this.state;
    const isSubmitEnabled = buffer !== null
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">File Witness</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <div className="pure-g">
                <div className="pure-u-1 pure-u-md-1-3">
                  <h2>Add a Picture</h2>
                  <form onSubmit={this.onSubmit} >
                    <input type='file' onChange={this.captureFile} />
                    <button type='submit' className="pure-button pure-button-primary"
                      disabled={!isSubmitEnabled}>
                      Go!
                    </button>
                  </form>
                </div>
                <div className="pure-u-1 pure-u-md-2-3">
                <h2>How this works</h2>
                  <p>Choose a picture to upload. Your picture will be timstampped
                    and submitted to a peer-to-peer filesharing network called InterPlanetary 
                    File System (IPFS). After your file is stored using IPFS, a file hash 
                    provided by IPFS will be added to the Ethereum blockchain. This blockchain 
                    transaction provides cryptographically-guaranteed proof that you added
                    the picture at a certain date/time.
                  </p>
                </div>
              </div>
              <h2>Your pictures: {this.state.fileCount}</h2>
              <div className="pure-g">
                {this.state.files.map((file, index) => (
                  <div className="pure-u-1 pure-u-lg-1-3 pure-u-xl-1-4" key={index}>
                    <div className="pure-grid-unit-p1">
                      <img src={`https://ipfs.io/ipfs/${file.hash}`} alt="" className="pure-img"/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
