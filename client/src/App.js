import './style/App.css'
import React from 'react'
import { BrowserRouter ,Route } from 'react-router-dom'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Navbar from './components/Navbar'


function App() {

  return (
   
    <div className="App">
      <Navbar />
      <BrowserRouter>
     
        <Route component={Home} exact path="/">
          {/* <Home /> */}
        </Route>
        <Route path="/explore" component={Explore}>
          <Explore />
        </Route>
    
        </BrowserRouter>
    </div>

  )
}

export default App
