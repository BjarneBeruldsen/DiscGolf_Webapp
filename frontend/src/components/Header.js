import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div>
    <header class="header"> 
      <span class="title">DiscGolf</span>
      <img className="logo" src="/DiscgolfLogo.png" alt="DiscGolf logo" />
      <nav class="nav">
        <ul>
          <li><Link to="/hjem">Hjem</Link></li>
          <li><Link to="/VelgKlubb">Ny klubbside</Link></li>
          <li><Link to="#">Baner</Link></li>
          <li><Link to="#">Regler/Tips</Link></li>
          <li><Link to="/Klubbsider">Klubber</Link></li>
          <li><Link to="/nyheter">Nyheter</Link></li>
          <li><Link to="/Innlogging">Logg inn</Link></li>

        </ul>
      </nav>



    </header>
   
    
        <div class="bilde">
            <img 
                src="https://images.unsplash.com/photo-1616840388998-a514fe2175b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="bilde"/>
        </div>
    </div>
   
  );
};

export default Header;
