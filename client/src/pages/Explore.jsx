import React, {useState, useEffect,useContext} from 'react'
// import { Link } from 'react-router-dom'
import Card from '../components/Card'
import axios from 'axios'
import {ethers} from 'ethers'
// import Navbar from '../components/Navbar'
import "../style/Card.css"
import { web3Provider } from '../context/web3'
import { nftmarketplaceAddress } from '../config'

function Explore() {

    const [nfts, setNfts] = useState([])
    const [loading, setLoding] = useState("")
  
    const {connection, signer,nftMarketplaceContract,nftContract} = useContext(web3Provider)
  
    useEffect(() => {
    loadNFT()
      
      console.log(connection, signer,nftContract,nftMarketplaceContract)
    });
    async function loadNFT(){
   
      const data = await nftMarketplaceContract.fetchMarketItems()
  
      const items = await Promise.all(data.map(async i => {
        // const tokenUri = await nftContract.tokenURI(i.tokenId)
        // const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        console.log(price)
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          // image: meta.data.image,
          // name: meta.data.name,
          // description: meta.data.description,
        }
        return item
      } )
      )
      setNfts(items)
      setLoding('loaded') 
    }
    console.log(nfts);
    
    return (
        <div className="news">
         
            <div className="collotion">
                <div className="container">
                    <h3>NFT's</h3>
                <div className="row">
                  {
                    nfts.map((nfts,i)=>(
                      <Card key={i} data={nfts.price}/>
                    ))
                  }
                    
                  

                </div>
                </div>
                
            </div>
            
        </div>
    )
}

export default Explore
