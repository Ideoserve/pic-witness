import React, { Component } from 'react'
import FileWitnessContract from '../build/contracts/FileWitness.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './IPFS';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ipfsHash:null,
      buffer:'',
      ethAddress:'',
      blockNumber:'',
      transactionHash:'',
      gasUsed:'',
      txReceipt: '',
      web3: null
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
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    //const simpleStorage = contract(SimpleStorageContract)
    //simpleStorage.setProvider(this.state.web3.currentProvider)

    const fileWitness = contract(FileWitnessContract)
    fileWitness.setProvider(this.state.web3.currentProvider)

    var fileWitnessInstance

    this.state.web3.eth.getAccounts((error, accounts) => {
      fileWitness.deployed().then((instance) => {
        fileWitnessInstance = instance
      })
    })

    // Declaring this for later so we can chain functions on SimpleStorage.
    //var simpleStorageInstance

    // Get accounts.
    /*
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(5, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })
    })
    */
  }

  captureFile =(event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)    
  };

  convertToBuffer = async(reader) => {
    //file is converted to a buffer for upload to IPFS
      const buffer = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
      this.setState({buffer});
  };

  onClick = async () => {
    try{
            this.setState({blockNumber:"waiting.."});
            this.setState({gasUsed:"waiting..."});
    //get Transaction Receipt in console on click
    //See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
    await this.state.web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt)=>{
              console.log(err,txReceipt);
              this.setState({txReceipt});
            }); //await for getTransactionReceipt
    await this.setState({blockNumber: this.state.txReceipt.blockNumber});
            await this.setState({gasUsed: this.state.txReceipt.gasUsed});    
          } //try
        catch(error){
            console.log(error);
          } //catch
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.state.web3.eth.getAccounts((error, accounts) => {
      fileWitness.deployed().then((instance) => {
        fileWitnessInstance = instance

        console.log('Sending from Metamask account: ' + accounts[0]);
        //obtain contract address from storehash.js
        const ethAddress= await fileWitnessInstance.options.address;
        this.setState({ethAddress});
        //save document to IPFS,return its hash#, and set hash# to state
        //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
        await ipfs.add(this.state.buffer, (err, ipfsHash) => {
          console.log(err,ipfsHash);
          //setState by setting ipfsHash to ipfsHash[0].hash 
          this.setState({ ipfsHash:ipfsHash[0].hash });
          // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract 
          //return the transaction hash from the ethereum contract
          //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
          
          fileWitnessInstance.methods.sendHash(this.state.ipfsHash).send({
            from: accounts[0] 
          }, (error, transactionHash) => {
            console.log(transactionHash);
            this.setState({transactionHash});
          });
        })
      })
    })
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1> Ethereum and IPFS with Create React App</h1>
        </header>
        
        <hr />
<Grid>
        <h3> Choose file to send to IPFS </h3>
        <Form onSubmit={this.onSubmit}>
          <input 
            type = "file"
            onChange = {this.captureFile}
          />
           <Button 
           bsStyle="primary" 
           type="submit"> 
           Send it 
           </Button>
        </Form>
<hr/>
<Button onClick = {this.onClick}> Get Transaction Receipt </Button>
<Table bordered responsive>
              <thead>
                <tr>
                  <th>Tx Receipt Category</th>
                  <th>Values</th>
                </tr>
              </thead>
             
              <tbody>
                <tr>
                  <td>IPFS Hash # stored on Eth Contract</td>
                  <td>{this.state.ipfsHash}</td>
                </tr>
                <tr>
                  <td>Ethereum Contract Address</td>
                  <td>{this.state.ethAddress}</td>
                </tr>
                <tr>
                  <td>Tx Hash # </td>
                  <td>{this.state.transactionHash}</td>
                </tr>
                <tr>
                  <td>Block Number # </td>
                  <td>{this.state.blockNumber}</td>
                </tr>
                <tr>
                  <td>Gas Used</td>
                  <td>{this.state.gasUsed}</td>
                </tr>
              
              </tbody>
          </Table>
      </Grid>
   </div>
    );
  }
}

export default App
