import React from 'react'
import {Link} from 'react-router-dom'
import "../style/error.css"

function Error() {
    return (
        <div className="">
            <div className="error">
                <img src="/404.svg" alt="" srcset="" />
             <Link to="/">   <button className="btn1">Go to Home </button> </Link>
            </div>
            
        </div>
    )
}

export default Error
