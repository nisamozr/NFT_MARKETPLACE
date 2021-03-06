import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../style/Home.css'


function Home() {

  return (
    <div className="container">
     
        <div className="">
        <div className="row feeld">
          <div className="col-md-6 co-sm-12">
            <div className="feeld-left">
              <div className="black">
                <div className="blankPhoto">
                  <img src="./w.jpg" alt="" />
                </div>
              </div>
            </div>
          </div>
          <dic className="col-md-6">
            <div className="feeld-right">
              <div className="f">
                <div className="dis">Mint your own NFT's on one click </div>
                <div className="but">
                  <Link to="/create">
                    {' '}
                    <button className="btn1 e">Create</button>{' '}
                  </Link>
                  <Link to="/explore">
                    {' '}
                    <button className="btn2 e">Explore</button>
                  </Link>
                </div>
              </div>
            </div>
          </dic>
        </div>
      </div>
    </div>
  )
}

export default Home
