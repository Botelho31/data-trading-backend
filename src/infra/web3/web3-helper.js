const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
const contractAbi = require('./contract_abi.json');

module.exports = {
  async hasRequestedEntry(address, contractAddress) {
    const DTCContract = new web3.eth.Contract(contractAbi, contractAddress);
    const response = await DTCContract.methods.hasRequestedEntry(address).call();
    return response;
  },
};
