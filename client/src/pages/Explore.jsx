import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
// import Navbar from '../components/Navbar'
import "../style/Card.css"

function Explore() {
    return (
        <div className="news">
         
            <div className="collotion">
                <div className="container">
                    <h3>NFT's</h3>
                <div className="row">
                    
                  <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>

                </div>
                </div>
                
            </div>
            
        </div>
    )
}

export default Explore
