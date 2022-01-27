import React ,{useState} from 'react'
import "../style/Card.css"

function Card({price,image,tokenId,name,sell,setSells,marketId}) {
    const [prices, setPrice] = useState(null);
    const sellk = ()=>{
        // console.log(prices);

    
        setSells({price:prices, id: marketId})
       sell()

    }
    return (
        <div className=" col-md-12 col-lg-4  ">
            <div className="card">
            <div className="card-innerbox">
                <img src={image} alt="" />
                <h3>{name} #{tokenId}</h3>
                <div className="pro">
                    <div className="c">
                    <input type="number" className="sell" onChange={e => setPrice(e.target.value)} name="" id="" />
                    </div>
                    
                    <button className="btn1 fg" onClick={sellk}>Sell </button>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Card
