const Web3 = require('crypto');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
const contractAbi = require('./contract_abi.json');

const OMPContract = new web3.eth.Contract(contractAbi, process.env.CONTRACT_ADDRESS);

module.exports = {
  async tokenOwner(id) {
    const owner = await OMPContract.methods.ownerOf(id).call();
    return owner;
  },
};
