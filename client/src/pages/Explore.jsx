import React, { useState, useEffect, useContext } from 'react'
import Card from '../components/Card'
import axios from 'axios'
import { ethers } from 'ethers'
import '../style/Card.css'
import { web3Provider } from '../context/web3'

function Explore() {
  const [nfts, setNfts] = useState([])
  const [loading, setLoding] = useState('')
  const {
    connection,
    signer,
    nftMarketplaceContract,
    nftContract,
  } = useContext(web3Provider)

  const [connect, setcontect] = useState(null)
  useEffect(() => {

    loadNFT()
  })
  
  async function loadNFT() {
    const data = await nftMarketplaceContract.fetchMarketItems()
    const items = await Promise.all(
      data.map(async (i) => {
        let tockenid = i.tokenId
        let id = tockenid.toNumber()
        const tokenUri = await nftContract.tokenURI(id)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        const auctionData = await nftMarketplaceContract.auctions(i.tokenId)
        const startingPrice = ethers.utils.formatUnits(auctionData.staringPrice.toString(), 'ether') 
        console.log(startingPrice)
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          startingPrice:startingPrice
        }

        return item
      }),
    )
    setNfts(items)
    setLoding("loaded")
  }

  if (loading === "loaded" && !nfts.length) return (<h1> noitem in market</h1>)

  return (
    <div className="news">
      <div className="collotion">
        <div className="container">
          <h3>NFT's</h3>
          <div className="row">
            {
              (connection == null) ? <div className='connectWalletWarring'>Please connect with wallet</div> : nfts.map((nfts, i) => (

                <Card
                  key={i}
                  price={(nfts.price == 0)?nfts.startingPrice: nfts.price}
                  name={nfts.name}
                  tokenId={nfts.tokenId}
                  image={nfts.image}
                />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Explore
