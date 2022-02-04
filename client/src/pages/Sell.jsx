import React, { useState, useEffect, useContext } from 'react'
import "../style/nft.css"
import { useParams } from "react-router-dom"
import { web3Provider } from "../context/web3"
import axios from "axios"
import { ethers } from "ethers"
import { useNavigate } from "react-router-dom"
import { nftaddress } from '../config'
import "../style/sell.css"

function Sell() {
  const route = useNavigate();
  const {
    nftMarketplaceContract,
    nftContract,
  } = useContext(web3Provider)
  let { id, view } = useParams()
  const [nft, setNft] = useState({})
  const [fixedSell, setfixedSell] = useState(true)
  const [auctionSell, setActionSell] = useState()
  const [prices, setPrice] = useState(0);

  useEffect(() => {
    loadNFT()
  })

  async function loadNFT() {
  
    const data = await nftMarketplaceContract.fetchMyNFTs()
    await Promise.all(
      data.map(async (i) => {
        let tockenid = i.tokenId
        if (tockenid.toString() === id) {
          let id = tockenid.toNumber()
          const tokenUri = await nftContract.tokenURI(id)
          const meta = await axios.get(tokenUri)
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
          let item = {
            itemId: i.itemId.toNumber(),
            price,
            priceInbign: i.price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          }
          setNft(item)
          return item
        }
      }),
    )
  }



  const [sellPrice, setSells] = useState(null)

  const setSellerAndsell = () => {
    
    setSells({ price: nft.price, id: nft.itemId })
 
    sell( nft.itemId )

  }

  const sell = async ( itemId) => {
    await nftContract.approv()
    let listingPrice = await nftMarketplaceContract.getListingPrice()
    listingPrice = listingPrice.toString()
    const price = ethers.utils.parseUnits(prices, 'ether')
    const buy = await nftMarketplaceContract.sellMarketplace(nftaddress, itemId, price, { value: listingPrice })
    await buy.wait()
    route('/explore')
  }
  const auction = async ()=>{
    console.log("fsd")
    let listingPrice = await nftMarketplaceContract.getListingPrice()
    listingPrice = listingPrice.toString()
    const price = ethers.utils.parseUnits(prices, 'ether')
    const actions = await nftMarketplaceContract.createAuction(nftaddress, nft.itemId, price, {value: listingPrice})
    await actions.wait()
    route('/explore')
  }

  return (
    <div className="new">
      <div className="container">
        <div className="row">
          <div className="col-md-7">
            <div className="box-left">
              <h3>List item for sale</h3>
              <div className="type">
                Type
                <div className="typeButton">
                  <div className="col-6">
                    <button className='l' onClick={() => {
                      setfixedSell(true)
                      setActionSell(false)
                    }}>Fixed price</button>
                  </div>
                  <div className="col-6">
                    <button className='r' onClick={() => {
                      setActionSell(true)
                      setfixedSell(false)
                    }}> Time Auction</button>
                  </div>
                </div>
              </div>
              {/* fixed price */}
              <div className={fixedSell ? "fixedPricee" : " displaynon"} >
                <div className="price">
                  Price
                  <div className="priceBox">
                    <div className="priceboxLeft">
                      <img src="https://ipfs.io/ipfs/QmVkyAQYxwJWz1441BeZeiNTFgEcmpk2wMaaiCxbybkfpc" alt="" />
                      ETH
                    </div>
                    <div className="priceboxRight">
                      <input type="text" onChange={e => setPrice(e.target.value)} placeholder='Amount' />
                    </div>
                  </div>
                </div>
                <hr />
                <button className='sell' onClick={setSellerAndsell}>Sell</button>
              </div>

              {/* auction */}
              <div className={auctionSell ? "auction" : " displaynon"} >
                <div className="price">
                  Starting price
                  <div className="priceBox">
                    <div className="priceboxLeft">
                      <img src="https://ipfs.io/ipfs/QmVkyAQYxwJWz1441BeZeiNTFgEcmpk2wMaaiCxbybkfpc" alt="" />
                      ETH
                    </div>
                    <div className="priceboxRight">
                      <input type="text" placeholder='Amount' onChange={e => setPrice(e.target.value)} />
                    </div>
                  </div>
                </div>
                <hr />
                <button className='sell' onClick={auction} >Auction</button>
              </div>


            </div>

          </div>
          <div className="col-md-5">
            <div className="imageprive">
              Priview
              <div className="imagePreviewCard">
                <div className="image_box">
                  <img src={nft.image} alt="" />
                </div>
                <div className="img_details">
                  <div>
                    <b>{nft.name} #{id}</b>
                  </div>
                  <div>
                    Price
                    <div className="priceimg">
                      <img src="https://ipfs.io/ipfs/QmVkyAQYxwJWz1441BeZeiNTFgEcmpk2wMaaiCxbybkfpc" alt="" />
                      {prices}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sell
