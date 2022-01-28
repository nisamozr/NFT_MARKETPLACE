import React, { useState, useContext } from 'react'
import "../style/Navbar.css"
import { Link, NavLink } from "react-router-dom"
import { web3Provider } from '../context/web3'

function Navbar({ connet, account }) {

    const {
        connection,
        Balance
    } = useContext(web3Provider)


    const [click, setclick] = useState(false)
    const [clickdropdown, setclickdropdawn] = useState(false)
    function handleClick() {
        setclick(!click)
    }
    const dropdown = () => {
        connet()
        setclickdropdawn(!clickdropdown)

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
                            <li> <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : 'link')} activeStyle={{ color: 'red' }}>Home</NavLink></li>
                            <li><NavLink to="/explore" className={({ isActive }) => (isActive ? 'active' : 'link')}>Explore </NavLink></li>
                            <li><NavLink to="/mycollection" className={({ isActive }) => (isActive ? 'active' : 'link')}>My Collection </NavLink></li>

                        </ul>
                        <Link to="/create" className="btn1">Create</Link>


                        <div class="dropdown">
                            {/* <button onclick="myFunction()" class="dropbtn">Dropdown</button> */}
                            <button className="btn2 connect" onClick={(connection == null) ? connet : dropdown} >{account ? account : "Connect Wallet"}</button>
                            <div id="myDropdown" class={clickdropdown ? "dropdown-content show" : "dropdown-content "}>
                                <p>ETH : {Balance}</p>
                                {/* <button>Disconnect</button> */}

                            </div>
                        </div>
                    </div>
                    <div className="menu">

                        <button className="btn2 connect ss" onClick={connet}>{account ? account : "Connect Wallet"}>Connect Wallet</button>
                        <i onClick={handleClick} class={click ? "fas fa-times" : "fas fa-bars"}></i>
                    </div>

                </div>
            </div>
            <div className={click ? "side active" : "hide"}>
                <div className="menuside">
                    <ul className="linkside">
                        <li onClick={handleClick}> <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : 'link')} activeStyle={{ color: 'red' }}>Home</NavLink></li>
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
