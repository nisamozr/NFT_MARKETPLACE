import React from 'react'
import {Link} from 'react-router-dom'
import "../style/Card.css"

function Card({data}) {
    return (
        <div className=" col-md-12 col-lg-4  ">
            
            <div className="card">
            <Link to="/view"> 
            <div className="card-innerbox">
                <img src="/Asset/12.jpg" alt="" />
                <h3>Cryto pung #425</h3>
                <div className="pro">
                    <div className="c">
                    <p>{data} ETH</p>
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
