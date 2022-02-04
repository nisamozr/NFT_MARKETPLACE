import React, { useState, useEffect, useContext } from 'react'
import "../style/nft.css"
import { useParams, Link } from "react-router-dom"
import { web3Provider } from "../context/web3"
import axios from "axios"
import { ethers } from "ethers"
import { useNavigate } from "react-router-dom"
import { nftaddress } from '../config'

function Nft() {
  const route = useNavigate();
  const {
    nftMarketplaceContract,
    nftContract,
  } = useContext(web3Provider)
  let { id, view } = useParams()
  const [nft, setNft] = useState({})
  const [endTime, setEndtime] = useState(null)

  useEffect(() => {
    loadNFT()
    widroval()
  },[])

  async function loadNFT() {
    if (view === "buy") {
      const data = await nftMarketplaceContract.fetchMarketItems()
      await Promise.all(
        data.map(async (i) => {
          let tockenid = i.tokenId
          
          if (tockenid.toString() === id) {
            console.log(i)
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
              auction: i.auction,
              auctionId: i.auctionId


            }
           
            setNft(item)
            return item
          }
        }),
      )

      const auctionData = await nftMarketplaceContract.auctions(nft.tokenId)
      console.log("bbb", auctionData)
      const  rstart= auctionData.duration.toNumber()
      let saleEnd = new Date(rstart*1000).toLocaleString();
      setEndtime(saleEnd)
console.log("bhdh",saleEnd)
      
     
    }
    else if (view === "my") {
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
              auction: i.auction,
              auctionId: i.auctionId
            }
            setNft(item)
            return item
          }
        }),
      )
    }else if(view  == "creater"){
      const data = await nftMarketplaceContract.fetchItemsCreated()
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
              auction: i.auction,
              auctionId: i.auctionId
            }
            setNft(item)
            return item
          }
        }),
      )

    }
  }

  const buyNFT = async () => {
    const buy = await nftMarketplaceContract.creatMarketSales(nftaddress, nft.itemId, { value: nft.priceInbign })
    await buy.wait()
    route('/explore')
  }
  const [prices, setPrice] = useState(null);
  const [sellPrice, setSells] = useState(null)

  // const setSellerAndsell = () => {
  //   console.log(nft)
  //   setSells({ price: nft.price, id: nft.itemId })
  //   sell()

  // }

  // const sell = async () => {
  //   await nftContract.approv()
  //   let listingPrice = await nftMarketplaceContract.getListingPrice()
  //   listingPrice = listingPrice.toString()
  //   const price = ethers.utils.parseUnits(prices, 'ether')
  //   const buy = await nftMarketplaceContract.sellMarketplace(nftaddress, sellPrice.id, price, { value: listingPrice })
  //   await buy.wait()
  //   route('/explore')
  // }
  const bid =async ()=>{
    // let listingPrice = await nftMarketplaceContract.getListingPrice()
    //   listingPrice = listingPrice.toString()
      const price = ethers.utils.parseUnits(prices.toString(), 'ether')
      // let price = ethers.utils.formatUnits(prices.toString(), 'ether')
      console.log(price)
      const buy = await nftMarketplaceContract.bid( nft.tokenId, { value: price })
      await buy.wait()


  }
  const widroval =async ()=>{
    // let listingPrice = await nftMarketplaceContract.getListingPrice()
    //   listingPrice = listingPrice.toString()
      
      // let price = ethers.utils.formatUnits(prices.toString(), 'ether')
     
      const buy = await nftMarketplaceContract.finish(nftaddress,nft.tokenId)
      await buy.wait()


  }

  return (
    <div className="new">
      <div className="container">
        <div className="row">
          <div className="col-md-7">
            <div className="nftbox">
              <img src={nft.image} alt="" />
            </div>
          </div>
          <div className="col-md-5">
            <div className="nftDes">
              <div className="cont">
                <h2>{nft.name} # {id}</h2>
                <p>{nft.description}</p>
              </div>
              <div className="owner">
                <h4>Owned by</h4>
                <p className='ownerAdd'> { nft.owner}</p>
              </div>
              {
                nft.auction ?
                <div className="bidbody">
                  <div className="time">
                  <i class="far fa-clock"></i>
                    Sale ends  {endTime}
                  </div>

                    <div className="pr">
                      <img src="https://ipfs.io/ipfs/QmVkyAQYxwJWz1441BeZeiNTFgEcmpk2wMaaiCxbybkfpc" alt="" />
                      0.003 
                    </div>
                    <div className="lll">
                    <input type="number" onChange={e => setPrice(e.target.value)} />
                  <button className="bt " onClick={bid}  >Place bid</button>

                    </div>


                    

                  </div>
                 
                
                
                
                :
                (view == "buy") ? <div className="buy">

                  <h4>{nft.price}ETH</h4>
                  <button className="btn2 connect" onClick={buyNFT}>Buy Now</button>
                </div> : <div className="buy">

                  <Link to={`/sell/${id}`}> <button className="btn2 connect" >Sell Now</button> </Link>


                 
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Nft
