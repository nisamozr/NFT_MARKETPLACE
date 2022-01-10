import React from 'react'
import "../style/Navbar.css"
// import {} from  "../../public"

function Navbar() {
    return (
        <div className="nav">
        <div className="Navbar">
            <div className="log">
                <img src="./NFT_Icon.png" alt="" />
            </div>
            <div className="navbarDetails">
                <div className="serch">
                    <div className="inputSertch">
                        <input type="text" name="" placeholder="Search" id="" />
                    </div>
                    <div className="serchButton">
                    <i class="fas fa-search"></i>
                    </div>
                </div>
                <ul className="link">
                    <li>Home</li>
                    <li>Explore</li>

                </ul>
                <button className="btn1">Create</button>
                <button className="btn2">Connect Wallet</button>
            </div>
            
        </div>
        </div>
    )
}

export default Navbar
