import React from 'react'
import "../style/nft.css"

function Nft() {
    return (
        <div className="new">
            <div className="container">
                <div className="row">
                    <div className="col-md-7">
                        <div className="nftbox">
                        <img src="/Asset/12.jpg" alt="" />

                        </div>
                       

                    </div>
                    <div className="col-md-5">
                        <div className="nftDes">
                            <div className="cont">
                            <h2>Pit Stop</h2>
                            <p>Please let me know when I have gone too far. I can make it with a little TLC.

This piece was conceived and sketched in the waiting room of Les Scwab Tire Center in Portland, OR.</p>
                            
                            </div>
                            <div className="owner">
                                <h4>Owned by</h4>
                                <p>dajfwdsfrgygfydi43543</p>
                            </div>
                            <div className="buy">
                               <h4>10 ETH</h4>
                               <button className="btn2 connect">Buy Now</button>
                            </div>
                            
                        </div>

                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Nft
