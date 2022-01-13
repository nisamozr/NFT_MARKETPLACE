import React from 'react'
import "../style/Navbar.css"
// import {} from  "../../public"
import {Link, NavLink} from "react-router-dom"

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
                    <li> <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : 'link')} activeStyle={{color:'red'}}>Home</NavLink></li>
                    <li><NavLink to="/explore" className={({ isActive }) => (isActive ? 'active' : 'link')}>Explore </NavLink></li>
                    <li><NavLink to="/mycollection" className={({ isActive }) => (isActive ? 'active' : 'link')}>My Collection </NavLink></li>
                
                </ul>
                <Link to="/mint" className="btn1">Create</Link>
              
               <button className="btn2 connect">Connect Wallet</button>
               
                
              
                {/* <button className="btn1">Create</button>
                <button className="btn2">Connect Wallet</button> */}
            </div>
            
        </div>
        </div>
    )
}

export default Navbar
