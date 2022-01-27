import React, { useState, useEffect, useContext } from 'react'
import "../style/nft.css"
import {useParams} from "react-router-dom"
import {web3Provider} from "../context/web3"
import axios from "axios"
import {ethers} from "ethers"
import {useNavigate} from "react-router-dom"
import {nftaddress } from '../config'

function Nft() {
  const route = useNavigate();
    const {
      
        nftMarketplaceContract,
        nftContract,
      } = useContext(web3Provider)
    let {id}= useParams()
    const [nft, setNft] = useState({})
    useEffect(() => {
        loadNFT()
      },[])

      async function loadNFT(){
        const data = await nftMarketplaceContract.fetchMarketItems()
       await Promise.all(
          data.map(async (i) => {
            let tockenid = i.tokenId
            // console.log(tockenid.toString(), id)
              if(tockenid.toString() === id){
                
                let id = tockenid.toNumber()
                const tokenUri = await nftContract.tokenURI(id)
                const meta = await axios.get(tokenUri)
                let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
                let item = {
                    itemId: i.itemId.toNumber(),
                  price,
                  priceInbign:i.price,
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

      const buyNFT = async ()=>{

           const buy = await nftMarketplaceContract.creatMarketSales(nftaddress,nft.itemId,{ value: nft.priceInbign })
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
                            <h2>{nft.name} {id}</h2>
                            <p>{nft.description}</p>
                            
                            </div>
                            <div className="owner">
                                <h4>Owned by</h4>
                                <p>{nft.owner}</p>
                            </div>
                            <div className="buy">
                               <h4>{nft.price}ETH</h4>
                               <button className="btn2 connect" onClick={buyNFT}>Buy Now</button>
                            </div>
                            
                        </div>

                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Nft
