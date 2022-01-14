import React, { useRef, useState, useEffect } from 'react'
import '../style/Create.css'

function Create() {
  const fileRef = useRef(null)
  const [image, setImage] = useState()
  const [selecfile, setselecfile] = useState(null)

  const ButtonClic = () => {
    fileRef.current.click()
  }

  const handleChange = (e) => {
    const { files } = e.target
    if (e.target.files[0]) {
      console.log('picture: ', e.target.files)
      setselecfile(e.target.files[0])
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImage(reader.result)
      })
      reader.readAsDataURL(e.target.files[0])
    }
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
              <input type="text" placeholder="Artwork Name" name="" id="" />
            </div>
            <div>
              <textarea
                name=""
                id=""
                placeholder="Artwork Description"
                cols=""
                rows="4"
              ></textarea>
            </div>
          </div>
          <div>
            <button className="mintbuttun">Mint</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Create
