import React from 'react'
import "../style/Card.css"

function Card() {
    return (
        <div className=" col-md-12 col-lg-4  ">
            <div className="card">
            <div className="card-innerbox">
                <img src="/Asset/12.jpg" alt="" />
                <h3>Cryto pung #425</h3>
                <div className="pro">
                    <div className="c">
                    <input type="number" className="sell" name="" id="" />
                    </div>
                    
                    <button className="btn1 fg">Sell</button>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Card
