import React, { useState, useEffect, useContext } from 'react'
// import { Link } from 'react-router-dom'
import Card from '../components/Card'
import axios from 'axios'
import { ethers } from 'ethers'
import '../style/Card.css'
import { web3Provider } from '../context/web3'

function Explore() {
  const [nfts, setNfts] = useState([])
  // const [loading, setLoding] = useState('')
  const {
    connection,
    signer,
    nftMarketplaceContract,
    nftContract,
  } = useContext(web3Provider)

  useEffect(() => {
    loadNFT()
  }, [])

  async function loadNFT() {
    let count =  await nftMarketplaceContract.marketItemCont()
    console.log(count.toNumber(),"ggggggggggggggggggdddd")
   let fg =async()=>{
    for(let j=1; j<=count ; j++){
      const i = await nftMarketplaceContract.idMarketItem(j)
      console.log(i,"gggggggggggggggggg")
       let tockenid = i.tokenId
        let id = tockenid.toNumber()
        const tokenUri = await nftContract.tokenURI(id)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        }
        return item
    console.log(item)
    }

   }
   
    setNfts(fg)
    console("gfs", nfts)
   

    const data = await nftMarketplaceContract.fetchMarketItems()
    // const items = await Promise.all(
    //   data.map(async (i) => {
    //     let tockenid = i.tokenId
    //     let id = tockenid.toNumber()
    //     const tokenUri = await nftContract.tokenURI(id)
    //     const meta = await axios.get(tokenUri)
    //     let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
    //     let item = {
    //       price,
    //       tokenId: i.tokenId.toNumber(),
    //       seller: i.seller,
    //       owner: i.owner,
    //       image: meta.data.image,
    //       name: meta.data.name,
    //       description: meta.data.description,
    //     }
    //     return item
    //   }),
    // )
    
  }

  return (
    <div className="news">
      <div className="collotion">
        <div className="container">
          <h3>NFT's</h3>
          <div className="row">
            {/* {nfts.map((nfts, i) => (
              <Card
                key={i}
                price={nfts.price}
                name={nfts.name}
                tokenId={nfts.tokenId}
                image={nfts.image}
              />
            ))} */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Explore
