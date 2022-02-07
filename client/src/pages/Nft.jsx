import React, { useState, useEffect, useContext } from 'react'
import "../style/nft.css"
import { useParams, Link } from "react-router-dom"
import { web3Provider } from "../context/web3"
import axios from "axios"
import { ethers } from "ethers"
import { useNavigate } from "react-router-dom"
import { nftaddress } from '../config'
import Swal from "sweetalert2"

function Nft() {
  const route = useNavigate();
  const {
    nftMarketplaceContract,
    nftContract,
    account
  } = useContext(web3Provider)
  let { id, view } = useParams()
  const [nft, setNft] = useState({})
  const [endTime, setEndtime] = useState(null)
  const [staringPrice, setStaringPrice] = useState(null)
  const [visibleTime, setvisibleTime] = useState(null)
  const [AutionEnd, setAutionEnd] = useState(null)









  useEffect(() => {
    loadNFT()
    // auctioin()
    // widroval()
  }, [])

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
            auctioin(item.tokenId)
            return item
          }
        }),
      )




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
    } else if (view == "creater") {
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
  async function auctioin(tokenId) {
    if (view == "buy") {
      const auctionData = await nftMarketplaceContract.auctions(tokenId)
      console.log(auctionData)


      const rstart = auctionData.duration.toNumber()
      const startingPrice = auctionData.staringPrice
      const Sprice = ethers.utils.formatUnits(startingPrice.toString(), 'ether')
      let saleEnd = new Date(rstart * 1000).toLocaleString();
      setEndtime(saleEnd)
      setStaringPrice(Sprice)
      const currentTime = Date.now();
      let presentTime = new Date(currentTime).toLocaleString();
      console.log("bhdh", saleEnd, presentTime)

      // const BI = await nftMarketplaceContract.bidders(tokenId)
      //     console.log(BI)
      console.log("bbb", auctionData)
      console.log(account)
      if (presentTime >= saleEnd) {
        setvisibleTime(true)
        console.log(auctionData.seller.toLowerCase())
        let auctionseller = auctionData.seller
        setAutionEnd(false)
        if (auctionseller.toLowerCase() === account) {
          // widroval(tokenId)
          setAutionEnd(true)
          console.log("wedroval")

        }



      }
    }
  }

  const buyNFT = async () => {
    const buy = await nftMarketplaceContract.creatMarketSales(nftaddress, nft.itemId, { value: nft.priceInbign })
    await buy.wait()
    route('/explore')
  }
  const [prices, setPrice] = useState(null);
  const [sellPrice, setSells] = useState(null)

  const BidAlert = async () => {
    const { value: price } = await Swal.fire({
      title: 'Place Bid',
      input: 'number',
      inputLabel: 'Price must more than Starting price',
      inputPlaceholder: 'Enter your Bidding Price',
      showCancelButton: true,
    })

    if (price) {
      // Swal.fire(`Entered email: ${price}`)
      bid(price)
    }


  }

  const bid = async (bidPrice) => {
    // let listingPrice = await nftMarketplaceContract.getListingPrice()
    //   listingPrice = listingPrice.toString()
    const price = ethers.utils.parseUnits(bidPrice.toString(), 'ether')
    // let price = ethers.utils.formatUnits(prices.toString(), 'ether')
    console.log(price, "hbjd")
    const buy = await nftMarketplaceContract.bid(nft.tokenId, { value: price })
    await buy.wait()
    Swal.fire(`Your bid placed at : ${bidPrice} ETH`)


  }
  const withdraw = async () => {
    console.log(nft.tokenId)
    withdrawAcrion(nft.tokenId)
  }
  const withdrawAcrion = async (tokenId) => {


    console.log(tokenId, "withdraw")
    const buy = await nftMarketplaceContract.finish(nftaddress, tokenId)
    await buy.wait()
    route('/explore')


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
                <p className='ownerAdd'> {nft.owner}</p>
              </div>
              {
                (view == "buy") ?
                  nft.auction ?
                    visibleTime ?
                      AutionEnd ?
                        <div className="bidbody">
                          <div className="lll">

                            <button className="bt " onClick={withdraw} >Transfer Nft to the bidder</button>

                          </div>

                        </div>
                        :
                        " "



                      :
                      <div className="bidbody">
                        <div className="time">
                          <i class="far fa-clock"></i>
                          Sale ends  {endTime}
                        </div>

                        <div className="pr">
                          <img src="https://ipfs.io/ipfs/QmVkyAQYxwJWz1441BeZeiNTFgEcmpk2wMaaiCxbybkfpc" alt="" />
                          {staringPrice}
                        </div>
                        <div className="lll">
                          {/* <input type="number" onChange={e => setPrice(e.target.value)} /> */}
                          <button className="bt " onClick={BidAlert} >Place bid</button>

                        </div>

                      </div>


                    : "" : ""}
              {
                (view == "buy") ?
                  nft.auction ? "" :
                    <div className="buy">

                      <h4>{nft.price}ETH</h4>
                      <button className="btn2 connect" onClick={buyNFT}>Buy Now</button>
                    </div>
                  :
                  <div className="buy">

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
