import React, { useRef, useState, useEffect, useContext } from 'react'
import { useNavigate } from "react-router-dom"
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from "ipfs-http-client"
import { web3Provider } from '../context/web3'
import { Buffer } from 'buffer';
import '../style/Create.css'
import { projectId, projectSecret } from "../config"

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const client = ipfsHttpClient(
  {
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth
    }
  }
)

function Create() {
  const route = useNavigate();
  const { connection, signer, nftMarketplaceContract, nftContract } = useContext(web3Provider)
  const fileRef = useRef(null)
  const [image, setImage] = useState()
  const [selecfile, setselecfile] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)
  const [sell, setSell] = useState(null)

 
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
        const added = await client.add(filed
        )
        console.log(added)
        const url = `https://ipfs.io/ipfs/${added.path}`
        setFileUrl(url)
      } catch (error) {
        console.log('Error uploading file: ', error)
      }
    }
  }

  const createMarketitem = async () => {
    const { name, description, price } = formInput

    if (!name || !description || !price || !fileUrl) return

    const data = JSON.stringify({
      name, description, image: fileUrl
    })

    try {
      const added = await client.add(data)
      console.log(added)
      const url = `https://ipfs.io/ipfs/${added.path}`
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  async function createSale(url) {
    let contract = nftContract
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    contract = nftMarketplaceContract;
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketplace(nftContract.address, tokenId, price, sell, { value: listingPrice })
    await transaction.wait()
    route('/explore')
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


            <div className="typeButton">
              <div className="col-6">
                <button className={sell ? 'l': ' l activeFocus'} onClick={() => {
                  setSell(false)
                
                }}>Fixed price</button>
              </div>
              <div className="col-6">
                <button className={sell ? 'r activeFocus':'r'} onClick={() => {
                 setSell(true)
                }}> Time Auction</button>
              </div>
            </div>
          {/* </div> */}

          <div>
            <input type="number" placeholder={sell ? "Staring Price" :"Price"} name="" id="" onChange={e => updateFormInput({ ...formInput, price: e.target.value })} />
          </div>
        </div>
        <div>
          <button className="mintbuttun" onClick={createMarketitem}>Create</button>
        </div>
      </div>
    </div>
    </div >
  )
}

export default Create
