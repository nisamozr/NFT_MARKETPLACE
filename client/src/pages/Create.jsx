import React, { useRef, useState, useEffect, useContext } from 'react'
import {useRoutes} from "react-router-dom"
import { ethers } from 'ethers'
import {create as ipfsHttpClient} from "ipfs-http-client"
import { web3Provider } from '../context/web3'
import NFT from "../contracts/NFT.json"
import Market from "../contracts/NFTmarketplace.json"



import '../style/Create.css'

const client = ipfsHttpClient('https://ipfs.infura.io:5001')

function Create() {
  const router = useRoutes()
  const {connection, signer ,nftMarketplaceContract,nftContract} = useContext(web3Provider)
  const fileRef = useRef(null)
  const [image, setImage] = useState()
  const [selecfile, setselecfile] = useState(null)
  // uploding
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })

  const ButtonClic = () => {
    fileRef.current.click()
  }

  const handleChange = async (e) => {
    const { files } = e.target
    if (e.target.files[0]) {
      setselecfile(e.target.files[0])
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImage(reader.result)
      })
      reader.readAsDataURL(e.target.files[0])

      const filed = e.target.files[0]
    try {
      const added = await client.add(
        filed,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  

    }
  }

const createMarketitem = async ()=>{
  const { name, description, price } = formInput

    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
  
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log("yrr",url)
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
}

async function createSale(url) {
  // const web3Modal = new Web3Modal()
  // const connection = await web3Modal.connect()
  const provider = connection   
  // const signers = signer

  /* next, create the item */
  let contract = connection.Contract(nftContract, NFT.abi, signer)
  let transaction = await contract.createToken(url)
  let tx = await transaction.wait()
  let event = tx.events[0]
  let value = event.args[2]
  let tokenId = value.toNumber()
  const price = ethers.utils.parseUnits(formInput.price, 'ether')

  /* then list the item for sale on the marketplace */
  contract = new ethers.Contract(nftMarketplaceContract, Market.abi, signer)
  let listingPrice = await contract.getListingPrice()
  listingPrice = listingPrice.toString()

  transaction = await contract.createMarketItem(nftContract, tokenId, price, { value: listingPrice })
  await transaction.wait()
  // router.push('/')
}

  return (
    <div className="new">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2>Create NFT</h2>
          </div>
        </div>
        <hr />
        <div className="containers">
          <div>
            <h4>Upload Artwork</h4>
            <div className="artbox">
              {image ? (
                <img src={image} alt="" />
              ) : (
                <button onClick={ButtonClic}>Add Artwork</button>
              )}

              <input
                ref={fileRef}
                onChange={handleChange}
                multiple={false}
                hidden
                type="file"
                name=""
                id=""
              />
            </div>
          </div>
          <div className="disc">
            <h4>Artwork Details</h4>
            <div>
              <input type="text" placeholder="Artwork Name" name="" id="" onChange={e => updateFormInput({ ...formInput, name: e.target.value })} />
            </div>
            <div>
              <textarea
                name=""
                id=""
                placeholder="Artwork Description"
                cols=""
                onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                rows="4"
              ></textarea>
            </div>
            <div>
              <input type="number" placeholder="Price" name="" id="" onChange={e => updateFormInput({ ...formInput, price: e.target.value })} />
            </div>
          </div>
          <div>
            <button className="mintbuttun" onClick={createMarketitem}>Mint</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Create
