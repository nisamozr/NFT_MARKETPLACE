import React ,{useState, useEffect,useContext} from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
// import Navbar from '../components/Navbar'
import "../style/Card.css"
import { web3Provider } from '../context/web3'

function Explore() {

    const [nfts, setNfts] = useState([])
    const [loading, setLoding] = useState("")
  
    const {connection, signer,nftMarketplaceContract,nftContract} = useContext(web3Provider)
  
    useEffect(() => {
      
      console.log(connection, signer,nftContract,nftMarketplaceContract)
    });
    async function loadNFT(){
      const data = await nftMarketplaceContract.fetchMarketItems()
    }
    
    return (
        <div className="news">
         
            <div className="collotion">
                <div className="container">
                    <h3>NFT's</h3>
                <div className="row">
                    
                  <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>

                </div>
                </div>
                
            </div>
            
        </div>
    )
}

export default Explore
