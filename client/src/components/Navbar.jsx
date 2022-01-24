import React, {useState} from 'react'
import "../style/Navbar.css"
// import {} from  "../../public"
import {Link, NavLink} from "react-router-dom"
// import {} from "re"

function Navbar({connet,account}) {
    const [click, setclick] = useState(false)
    function handleClick(){
        setclick(!click)
    }

    return (
        <div className="bo">
        
        <div className="nav">
            
            
        <div className="Navbar">
            <div className="log">
                <img src="./NFT_Icon.png" alt="" />
            </div>
            <div className="" className={click ? "active navbarDetails" : "navbarDetails "}>
                {/* <div className="serch">
                    <div className="inputSertch">
                        <input type="text" name="" placeholder="Search" id="" />
                    </div>
                    <div className="serchButton">
                    <i className="fas fa-search"></i>
                    </div>
                </div> */}
                <ul className="link">
                    <li> <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : 'link')} activeStyle={{color:'red'}}>Home</NavLink></li>
                    <li><NavLink to="/explore" className={({ isActive }) => (isActive ? 'active' : 'link')}>Explore </NavLink></li>
                    <li><NavLink to="/mycollection" className={({ isActive }) => (isActive ? 'active' : 'link')}>My Collection </NavLink></li>
                
                </ul>
                <Link to="/create" className="btn1">Create</Link>
              
               <button className="btn2 connect" onClick={connet}>{ account? account:"Connect Wallet"}</button>
               
                
              
                {/* <button className="btn1">Create</button>
                <button className="btn2">Connect Wallet</button> */}
            </div>
            <div className="menu">
           
            <button className="btn2 connect ss">Connect Wallet</button>
            <i onClick={handleClick} class={click ? "fas fa-times" : "fas fa-bars"}></i>
            </div>
            
        </div>
        </div>
        <div className={click ? "side active" : "hide"}>
            <div className="menuside">
            <ul className="linkside">
                    <li onClick={handleClick}> <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : 'link')} activeStyle={{color:'red'}}>Home</NavLink></li>
                    <li onClick={handleClick}><NavLink to="/explore" className={({ isActive }) => (isActive ? 'active' : 'link')}>Explore </NavLink></li>
                    <li onClick={handleClick}><NavLink to="/mycollection" className={({ isActive }) => (isActive ? 'active' : 'link')}>My Collection </NavLink></li>
                    <li onClick={handleClick}> <Link to="/mint" className="btn1">Create</Link></li>
                    {/* <li onClick={handleClick}> <button className="btn2 connect">Connect Wallet</button></li> */}
                
                </ul>
                
                
              
              
            </div>

        </div>


        </div>
    )
}

export default Navbar
