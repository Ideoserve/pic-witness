import React, { Component } from 'react'
import { NotificationStack } from 'react-notification';
import { OrderedSet } from 'immutable';
import PicWitnessContract from '../build/contracts/PicWitness.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './utils/IPFS'
import moment from './utils/moment'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './css/grids-responsive-min.css'
import './css/bootstrap.min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      picWitnessInstance: null,
      account: null,
      pictureCount: 0,
      pictures: [],
      buffer: null,
      currentPictureDescription: '',
      notifications: OrderedSet()
    }
    this.onGetPictureToAdd = this.onGetPictureToAdd.bind(this);
    this.onAddDescription = this.onAddDescription.bind(this);
    this.onAddPicture = this.onAddPicture.bind(this);
    this.onInputChanged = this.onInputChanged.bind(this);
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
      const status = 'Wallet provider was not found. Please try again.'
      console.log(status)
      this.setState({
        notifications: this.state.notifications.add({
          message: status,
          key: 'MNF',
          action: 'Dismiss',
          dismissAfter: 5000,
          onClick: (notification, deactivate) => {
            deactivate();
            this.removeNotification('MNF');
          },
        })
      });
    })
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const picWitness = contract(PicWitnessContract)
    picWitness.setProvider(this.state.web3.currentProvider)
    this.state.web3.eth.getAccounts((error, accounts) => {
      picWitness.deployed().then((instance) => {
        this.setState({ picWitnessInstance: instance })
        this.setState({ account: this.state.web3.eth.accounts[0] })
        console.log('Contract deployed to ' + this.state.picWitnessInstance.address)
        console.log('Using account ' + this.state.account)
      }).then(() => {
        this.getPictureCount()
      })
      .catch(() => {
        const status = 'Error deploying contract. Please verify selected chain in your wallet provider.'
        console.log(status)
        this.setState({
          notifications: this.state.notifications.add({
            message: status,
            key: 'EDC',
            action: 'Dismiss',
            dismissAfter: 5000,
            onClick: (notification, deactivate) => {
              deactivate();
              this.removeNotification('EDC');
            },
          })
        });
      })
    })
  }

  getPictureCount() {
    console.log('Getting picture count for account ' + this.state.account)
    this.state.picWitnessInstance.getUserPictureCount.call({from: this.state.account}).then((result) => {
      var currentCount = this.state.pictureCount
      var newCount = parseInt(result, 10)
      console.log('Picture count: ' + newCount)
      this.setState({ pictureCount: newCount })
      if (currentCount !== newCount) {
        this.getPictures()
      }
    })
  }

  getPictures() {
    if (this.state.pictureCount > 0) {
      for (var i = 0; i < this.state.pictureCount; i++) {
        console.log("Getting picture by index " + i)
        this.state.picWitnessInstance.getPictureHash.call(i.toString(), {from: this.state.account})
        .then((pictureHash) => {
          console.log("Got picture: " + pictureHash)
          this.state.picWitnessInstance.getPictureDetails.call(pictureHash, {from: this.state.account})
          .then((pictureDetails) => {
            this.setState({
              pictures: this.state.pictures.concat({
                hash: pictureHash,
                description: pictureDetails[0],
                timestamp: moment(pictureDetails[1]).format('LL')
              })
            })
          })
        })
      }
    }
  }

  onGetPictureToAdd(event) {
    event.preventDefault()
    const picture = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(picture)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  onAddPicture(event) {
    event.preventDefault()
    const status = 'Uploading picture to IPFS - please wait...'
    console.log(status)
    this.setState({
      notifications: this.state.notifications.add({
        message: status,
        key: 'UPIPFS',
        action: 'Dismiss',
        dismissAfter: 5000,
        onClick: (notification, deactivate) => {
          deactivate();
          this.removeNotification('UPIPFS');
        },
      })
    });
    const buffer = this.state.buffer
    const instance = this.state.picWitnessInstance
    const account = this.state.account
    const nofications = this.state.notifications
    var context = this;
    ipfs.files.add(buffer, function (error, files) {
      if(error) {
        console.log(error)
        return
      }
      const hash = files[0].hash
      const status = 'Saving picture hash ' + hash + ' to blockchain - please wait...'
      console.log(status)
      context.setState({
        notifications: nofications.add({
          message: status,
          key: 'SPHTB',
          action: 'Dismiss',
          dismissAfter: 5000,
          onClick: (notification, deactivate) => {
            deactivate();
            this.removeNotification('SPHTB');
          },
        })
      });
      instance.addPicture(hash, { from: account }).then((r) => {
        console.log('ifpsHash', hash)
      }).then(() => {
        context.getPictureCount()
        context.setState({
          notifications: nofications.add({
            message: 'Picture added. Refresh page after transaction is confirmed.',
            key: 'PARP',
            action: 'Dismiss',
            dismissAfter: 5000,
            onClick: (notification, deactivate) => {
              deactivate();
              this.removeNotification('PARP');
            },
          })
        });
      })
    })
  }

  onAddDescription(event) {
    event.preventDefault()
    const status = 'Saving picture description to blockchain - please wait...'
    console.log(status)
    this.setState({
      notifications: this.state.notifications.add({
        message: status,
        key: 'SPDTB',
        action: 'Dismiss',
        dismissAfter: 5000,
        onClick: (notification, deactivate) => {
          deactivate();
          this.removeNotification('SPDTB');
        },
      })
    });
    this.state.picWitnessInstance.addPictureDescription(
      event.target.id,
      this.state.currentPictureDescription,
      { from: this.state.account })
    .then(() => {
      this.getPictureCount()
      this.setState({
        notifications: this.state.notifications.add({
          message: 'Picture description added. Refresh page after transaction is confirmed.',
          key: 'PDARP',
          action: 'Dismiss',
          dismissAfter: 5000,
          onClick: (notification, deactivate) => {
            deactivate();
            this.removeNotification('PDARP');
          },
        })
      });
    })
  }

  onInputChanged(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  removeNotification (count) {
    this.setState({
      notifications: this.state.notifications.filter(n => n.key !== count)
    })
  }

  render() {
    const { buffer } = this.state;
    const isAddPictureEnabled = buffer !== null
    return (
      <div className="App">
        <NotificationStack
          notifications={this.state.notifications.toArray()}
          onDismiss={notification => this.setState({
            notifications: this.state.notifications.delete(notification)
          })}
        />
        <div className="navbar navbar-dark bg-dark box-shadow">
          <div className="container d-flex justify-content-between">
            <a href="#" className="navbar-brand d-flex mr-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="mr-2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              <strong>PicWitness</strong>
            </a>
            <span className="navbar-text text-white">
              {this.state.account}
            </span>
          </div>
        </div>

        <main className="container">
          <section className="jumbotron text-center">
            <div className="container">
              <p className="lead text-muted">
                Choose a picture to upload. Your picture will be timestampped
                and submitted to a peer-to-peer filesharing network called InterPlanetary 
                File System (IPFS). After your picture is stored using IPFS, a file hash 
                provided by IPFS will be added to the Ethereum blockchain. This blockchain 
                transaction provides cryptographically-guaranteed proof that you added
                the picture at a certain date/time.
              </p>
              <h1 className="jumbotron-heading">Add a Picture</h1>
              <form onSubmit={this.onAddPicture} >
                <input type='file' onChange={this.onGetPictureToAdd} />
                <button type='submit' className="btn btn-primary"
                  disabled={!isAddPictureEnabled}>
                  Go!
                </button>
              </form>
            </div>
          </section>

          <section>
            <div className="container">
                {this.state.pictures.map((picture, index) => (
                  <div className="pure-u-1 pure-u-lg-1-3 pure-u-xl-1-4" key={index}>
                    <div className="card pure-grid-unit-p1">
                      <a href={`https://ipfs.io/ipfs/${picture.hash}`} alt="" target="_blank">
                        <img src={`https://ipfs.io/ipfs/${picture.hash}`} alt="" className="card-img-top"/>
                      </a>
                      <div className="card-body">
                        <div className="card-text">
                          <div>
                          {picture.description.length > 0 ? (
                            <p>{picture.description}</p>
                          ) : null
                          }
                          </div>
                          
                          <form className="form-inline">
                            <div className="form-group">
                              <textarea type="text" name="currentPictureDescription" className="form-control"
                                onChange={this.onInputChanged} placeholder="Description" rows="3" />
                            </div>
                            <button onClick={this.onAddDescription} id={picture.hash}
                              className="btn btn-success btn-sm mt-2">
                              Save
                            </button>
                          </form>
                        </div>
                      </div>
                      <div className="card-footer">
                        <small className="text-muted">Added on {picture.timestamp}</small>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </main>
      </div>
    );
  }
}

export default App
