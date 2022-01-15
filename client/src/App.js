import './style/App.css'
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Navbar from './components/Navbar'
import Create from './pages/Create'
import Collection from './pages/Collection'
import Nft from './pages/Nft'
import Error from './pages/Error'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home/>}>
     
          </Route>
          <Route path="/explore" element={<Explore/>}>
         
          </Route>
          <Route path="/mint" element={<Create/>}>
         
          </Route>
          <Route path="/mycollection" element={<Collection/>}>
         
         </Route>
         <Route path="/view" element={<Nft/>}>
         
         </Route>
         <Route path="*" element={<Error/>}/>
        </Routes>
        
      </div>
    </Router>
  )
}

export default App
