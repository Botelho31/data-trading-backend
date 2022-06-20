import Web3 from 'web3'
// import { TransactionReceipt } from 'web3-core'
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

export async function getTrade (idTrade: string, contractAddress: string) {
  const DTCContract = new web3.eth.Contract(contractAbi as AbiItem[], contractAddress)
  const response = await DTCContract.methods.getTrade(idTrade).call()
  return response
}

export async function hasBeenUploaded (idTrade: string, contractAddress: string) : Promise<Boolean> {
  try {
    const DTCContract = new web3.eth.Contract(contractAbi as AbiItem[], contractAddress)
    const gasPrice = await web3.eth.getGasPrice()
    const gas = await DTCContract.methods.hasBeenUploaded(idTrade)
      .estimateGas({
        from: process.env.ADMIN_PUBLIC_ADDRESS
      })

    const encoded = DTCContract.methods.hasBeenUploaded(
      idTrade)
      .encodeABI()

    const tx = {
      to: contractAddress,
      from: process.env.ADMIN_PUBLIC_ADDRESS,
      data: encoded,
      gas,
      gasPrice
    }
    const signed = await web3.eth.accounts.signTransaction(tx, process.env.ADMIN_PRIVATE_KEY as string)
    await web3.eth.sendSignedTransaction(signed.rawTransaction || '')
      .on('receipt', console.log)
      .on('error', console.log)
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
