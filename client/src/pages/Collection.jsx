import React, { useState, useEffect, useContext } from 'react'
import Card from '../components/CardSales'
import axios from 'axios'
import { ethers } from 'ethers'
import { web3Provider } from '../context/web3'
import {nftaddress } from '../config'
import {useNavigate} from "react-router-dom"


function Collection() {
    const route = useNavigate();
    const [sellPrice, setSells] = useState(null) 
    const [nfts, setNfts] = useState([])
    const {
        connection,
        signer,
        nftMarketplaceContract,
        nftContract,
      } = useContext(web3Provider)
    
      useEffect(() => {
        loadNFT()
      }, [nfts])
    
      async function loadNFT() {
        const data = await nftMarketplaceContract.fetchMyNFTs()
        const items = await Promise.all(
          data.map(async (i) => {
            let tockenid = i.tokenId
            let id = tockenid.toNumber()
            const tokenUri = await nftContract.tokenURI(id)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
              price,
              marketId: i.itemId.toNumber(),
              tokenId: i.tokenId.toNumber(),
              seller: i.seller,
              owner: i.owner,
              image: meta.data.image,
              name: meta.data.name,
              description: meta.data.description,
            }
            return item
          }),
        )
        setNfts(items)
        // setLoding('loaded')
      }

      const sells =async ()=>{
         
         
        let listingPrice = await nftMarketplaceContract.getListingPrice()
        listingPrice = listingPrice.toString() 
 
        const price = ethers.utils.parseUnits(sellPrice.price, 'ether')
    const l = sellPrice.id

        console.log("ffffffffff",  l,"ygyg", price)
        const buy = await nftMarketplaceContract.sellMarketplace(nftaddress,sellPrice.id,price, { value: listingPrice })
        await buy.wait()
        route('/explore')
      }
    return (
        <div className="news">
             <div className="collotion">
                <div className="container">
                    <h3>My NFT Collection</h3>
                <div className="row">

                    {nfts.map((nfts, i) => (
              <Card
                key={i}
                price={nfts.price}
                name={nfts.name}
                tokenId={nfts.tokenId}
                image={nfts.image}
                sell = {sells}
                setSells = {setSells}
                marketId = {nfts.marketId}

              />
            ))}
                    
                 
                    

                </div>
                </div>
                
            </div>
            
        </div>
    )
}

export default Collection
