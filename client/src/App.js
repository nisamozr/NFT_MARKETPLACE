import './style/App.css'
import React, { useEffect, useState } from 'react'
// import axios from "axios"

// import Web3Modal from "web3modal"
import {nftaddress, nftmarketplaceAddress } from './config'
import NFT from "./contracts/NFT.json"
import NFTmarketplace from "./contracts/NFTmarketplace.json"
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Navbar from './components/Navbar'
import Create from './pages/Create'
import Collection from './pages/Collection'
import Nft from './pages/Nft'
import Error from './pages/Error'
import {ethers} from 'ethers'
import {web3Provider} from './context/web3'
import Sell from './pages/Sell'
import Creater from './pages/creater'

function App() {

  const [errorMessage, setErrorMessage] = useState(null)
    const [defaltAccount, setdefaltAccount] = useState(null)
    const [Balance, setBalance] = useState(null)
  
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [nftContract, setNftContracr] = useState(null)
    const [nftMarketContract, setNftMarkContract] = useState(null)
    
 
  const walletConnectionHandel = ()=>{
   
    
    if(window.ethereum && window.ethereum.isMetaMask){
      window.ethereum.request({method: 'eth_requestAccounts'}).then((result)=>{
        accountChangeHandler(result[0])
        console.log("hghgg")

      }).catch(error => {
        setErrorMessage(error.message)
      })

    }else{
      console.log("install metamask");
      setErrorMessage("Please install metamask")
    }
  }
  const accountChangeHandler = (newAccount)=>{
    setdefaltAccount(newAccount)
    console.log(defaltAccount);
    getBalance(newAccount.toString())
    updateEteres()

  }
  const getBalance = (address)=>{
    window.ethereum.request({method: 'eth_getBalance', params: [address, 'latest']}).then((balance)=>{
      setBalance(ethers.utils.formatEther(balance))
    })
  

  }
  
  const updateEteres = ()=>{
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    let tempSigner = tempProvider.getSigner()
    let tempNFTmarketContract = new ethers.Contract(nftmarketplaceAddress,NFTmarketplace.abi,tempSigner)
    let tempNFTContract = new ethers.Contract(nftaddress,NFT.abi,tempSigner)
 
    setProvider(tempProvider)
    setSigner(tempSigner)
    setNftMarkContract(tempNFTmarketContract)
    setNftContracr(tempNFTContract)


    console.log(provider);
    console.log(nftContract);
    console.log(nftMarketContract);
   }
 
  
 



  return (
    <Router>
      <div className="App" >
        <web3Provider.Provider value={{connection: provider,signer:signer,Balance: Balance, nftContract:nftContract, nftMarketplaceContract:nftMarketContract}}>
        <Navbar connet = {walletConnectionHandel} account={defaltAccount} />
        <Routes>
          <Route exact path="/" element={<Home/>}>
     
          </Route>
          <Route path="/explore" element={<Explore/>}>
        
          </Route>
          <Route path="/create" element={<Create/>}>
         
          </Route>
          <Route path="/mycollection" element={<Collection/>}>
         
         </Route>

         <Route path="/view/:view/:id" element={<Nft/>}>
         </Route>
         <Route path="/sell/:id" element={<Sell/>}/>
         {/* <Route path="/creater" element={<Creater/>}/> */}
        
         
         <Route path="*" element={<Error/>}/>
        </Routes>
        </web3Provider.Provider>
        
      </div>
    </Router>
  )
}

export default App
