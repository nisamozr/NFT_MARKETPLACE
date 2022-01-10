import React from 'react'
import Navbar from '../components/Navbar'
import "../style/Home.css"

function Home() {
    return (
        <div>
          <Navbar/>
          <div className="feeld">
              <div className="feeld-left">
                  <div className="black">
                      <div className="blankPhoto">
                          <img src="./w.jpg" alt="" />
                      </div>
                  </div>

              </div>

              <div className="feeld-right">
                  <div className="f">
                      <div className="dis">
                      The Pretty Fantasy World of Mine

                      </div>
                      <div className="but">
                      <button className="btn1 e">Create</button>
                      <button className="btn2 e">Create</button>
                      </div>
                  </div>

              </div>
          </div>
        </div>
    )
}

export default Home
