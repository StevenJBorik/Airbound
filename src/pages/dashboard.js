import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { Row, Col, Card, Button } from "react-bootstrap"

import {
  marketplaceAddress
} from '../../config'

import NFTMarketplace from '../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    const data = await contract.fetchItemsListed()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
      }
      return item
    }))

    setNfts(items)
    setLoadingState('loaded') 
  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="">No NFTs listed</h1>)
  
  return (
    <div className="flex justify-center">
      <h2>Items Listed</h2>
        <Row xs={1} md={2} className="g-4">
          {
            nfts.map((nft, i) => (
              <Col>
                <Card
                key={i}
                className="mb-2"
                >
                  <Card.Body>
                    <Card.Img variant="top" src={nft.image} />
                    {/* {/* <Card.Title>{nft.name}</Card.Title> */}
                    {/* <Card.Text>{nft.description}</Card.Text>  */}
                    <Card.Footer>Price - {nft.price} Eth</Card.Footer>
                  </Card.Body>
                </Card>
            </Col>
          ))  
        }
      </Row>
    </div>
  )
}