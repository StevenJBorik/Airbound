import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { Row, Col, Card, Button, Form } from "react-bootstrap"

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
    marketplaceAddress
  } from '../../config'

import NFTMarketplace from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
    const router = useRouter()

    async function onChange(e) {
        const file = e.target.files[0]
        try {
            const fileAdded = await client.add(
            file,
            {
                progress: (prog) => console.log(`received: ${prog}`)
            }
            )
            const url = `https://ipfs.infura.io/ipfs/${fileAdded.path}`
            setFileUrl(url)
        } 
        catch (error) {
            console.log('Error uploading file: ', error)
        }  
    }
    async function uploadToIPFS() {
        const { name, description, price } = formInput
        if (!name || !description || !price || !fileUrl) return
        /* first, upload to IPFS */
        const data = JSON.stringify({
          name, description, image: fileUrl
        })
        try {
          const fileAdded = await client.add(data)
          const url = `https://ipfs.infura.io/ipfs/${fileAdded.path}`
          /* after file is uploaded to IPFS, return the URL to use it in the transaction */
          return url
        } catch (error) {
          console.log('Error uploading file: ', error)
        }  
    }
    async function listNFTForSale() {
        const url = await uploadToIPFS()
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        console.log(formInput)
        /* next, create the item */
        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()
        let transaction = await contract.createToken(url, price, { value: listingPrice })
        await transaction.wait()
       
        router.push('/')
    }

    return (
        <div className="flex justify-center">
            <Form>
                <Form.Group className="mb-3" controlId="" onChange={e => updateFormInput({ ...formInput, name: e.target.value })}>
                    <Form.Label>Airbit Name</Form.Label>
                    <Form.Control type="" placeholder="" />
                    <Form.Text className="text-muted">
                        Give it a cool name!
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="" onChange={e => updateFormInput({ ...formInput, description: e.target.value })}>
                    <Form.Label>Airbit Description</Form.Label>
                    <Form.Control type="" placeholder="" />
                    <Form.Text className="text-muted">
                        What's happening in this Airbit?
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="" onChange={e => updateFormInput({ ...formInput, price: e.target.value })}>
                    <Form.Label>Airbit Price</Form.Label>
                    <Form.Control type="" placeholder="" />
                    <Form.Text className="text-muted">
                        Be staunch!
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3" onChange={onChange}>
                    <Form.Label>Default file input example</Form.Label>
                    <Form.Control type="file" />
                </Form.Group>
                <Button onClick={listNFTForSale}>Sell</Button>
            </Form>
        </div>
    )
}