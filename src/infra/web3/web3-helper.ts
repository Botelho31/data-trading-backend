import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import contractAbi from './contract_abi.json'

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))

export async function hasRequestedEntry (address: string, contractAddress: string) {
  const DTCContract = new web3.eth.Contract(contractAbi as AbiItem[], contractAddress)
  const response = await DTCContract.methods.hasRequestedEntry(address).call()
  return response
}

export async function isTraderPresent (address: string, contractAddress: string) {
  const DTCContract = new web3.eth.Contract(contractAbi as AbiItem[], contractAddress)
  const response = await DTCContract.methods.isTraderPresent(address).call()
  return response
}
