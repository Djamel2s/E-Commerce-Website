import { NavLink, Outlet } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <>
      <div className="App">
        <div className="nav">
          <h1 className="logo">E-Commerce</h1>
          <ul className="nav-links">
            <li><NavLink to="/home">Home</NavLink></li>
            <li><NavLink to="/cart">Cart</NavLink></li>
          </ul>
        </div>
        <Outlet />
      </div>
      <div className="footer">
        <p>&copy; 2024 E-Commerce - Djamel Nafisse. All rights reserved.</p>
      </div>
    </>
  )
}

export default App
