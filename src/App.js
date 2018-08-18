import React, { Component } from 'react'
import { setJSON, getJSON } from './utils/IPFS.js'
import { Col, Form, Button, FormControl } from 'react-bootstrap';
import Loader from "./Loader"
import { setContractHash, getContractHash } from './services/FileWitnessService';
import FileWitnessContract from '../build/contracts/FileWitness.json'
import getWeb3 from './utils/getWeb3.js';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
        myData: "",
        ipfsData: "",
        timestamp: "",
        loading: false,
        address: "",
        web3: null
    }
}

componentDidMount = async () => {
  getWeb3.then(results => {
    /*After getting web3, we save the informations of the web3 user by
    editing the state variables of the component */
    results.web3.eth.getAccounts( (error,acc) => {
      //this.setState is used to edit the state variables
      this.setState({
        address: acc[0],
        web3: results.web3
      })
      console.log('Web3 initalized.')
      this.instantiateContract()
    });
  }).catch( () => {
    //If no web3 provider was found, log it in the console
    console.log('Error finding web3.')
  })
}

instantiateContract() {
  const contract = require('truffle-contract')
  const fileWitness = contract(FileWitnessContract)
  fileWitness.setProvider(this.state.web3.currentProvider)

  // Declaring this for later so we can chain functions on SimpleStorage.
  var fileWitnessInstance

  // Get accounts.
  this.state.web3.eth.getAccounts((error, accounts) => {
    fileWitness.deployed().then((instance) => {
      fileWitnessInstance = instance
      this.fetchData()
    })
  })
}

handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    const hash = await setJSON({ myData: this.state.myData });
    try {
        await setContractHash(this.state.web3, hash);
    } catch (error) {
        this.setState({ loading: false });
        alert("There was an error with the transaction.");
        return;
    }
    this.fetchData();
}
fetchData = async () => {
    //first get hash from smart contract
    console.log('State Web3: ' + this.state.web3)
    const contractDetails = await getContractHash(this.state.web3);
    //then get data off IPFS
    const ipfsHash = contractDetails[0];
    if (!ipfsHash) { return }
    const timestamp = contractDetails[1].c[0];
    const details = await getJSON(ipfsHash);
    this.setState({ ipfsData: details, loading: false, timestamp })
}
handleMyData = (e) => {
    this.setState({ myData: e.target.value });
}

render() {
    return (
        <div>
            <Col sm={5} >
                {this.state.timestamp ?
                    <p>Data loaded from Ethereum / IPFS: <br />Time saved to block: {new Date(Number(this.state.timestamp + "000")).toUTCString()}</p>
                    :
                    <div><h4>No record found for this account.</h4><p>Please enter and submit data on the right</p></div>
                }
                <div className="blockchain-display">
                    {this.state.ipfsData.myData}
                </div>

            </Col>
            <Col sm={4} smOffset={2}>
                <Form horizontal onSubmit={this.handleSubmit}>
                    <h4>Enter Details:</h4>
                    <p>My super tamper proof data:</p>

                    <FormControl componentClass="textarea" type="text" rows="3" placeholder="enter data"
                        value={this.state.myData}
                        onChange={this.handleMyData} />
                    <br />
                    <Button type="submit">Update Details</Button>
                </Form>
            </Col>
            {this.state.loading &&
                <Loader />
            }
        </div>
    )
  }
}

export default App
