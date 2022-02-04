import React ,{useState} from 'react'
import {Link} from "react-router-dom"
import "../style/Card.css"

function Card({image,tokenId,name,view}) {
    
  
    return (
        <div className=" col-md-12 col-lg-4  ">
            <div className="card">
            <Link to={`/view/my/${tokenId}` }> 
            <div className="card-innerbox">
                <img src={image} alt="" />
                <h3>{name} #{tokenId}</h3>
            </div>
            </Link>
            </div>
        </div>
    )
}

export default Card
