import React from 'react'
import {Link} from 'react-router-dom'
import "../style/Card.css"

function Card({price,image,tokenId,name}) {
   
    return (
        <div className=" col-md-12 col-lg-4  ">
            
            <div className="card">
            <Link to="/view" > 
            <div className="card-innerbox">
                <img src={image} alt="" />
                <h3>{name} #{tokenId}</h3>
                <div className="pro">
                    <div className="c">
                    <p>{price} ETH</p>
                    </div>
                    
                    <button className="btn1 fg">Buy</button>
                </div>
            </div>
            </Link>
            </div>
           
        </div>
    )
}

export default Card
