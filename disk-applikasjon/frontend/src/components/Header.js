import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div>
    <header class="header"> 
      <span class="title">DiscGolf</span>
      <img 
        class="logo"
        src="https://cdn.discordapp.com/attachments/934547779773153340/1333095097125961840/G2KuNAhXAAAAABJRU5ErkJggg.png?ex=6797a50e&is=6796538e&hm=4268bfd85ba6c78c4b5c540071b84950c59720990a1e0653cabe71a1fc10bb29&" 
        alt="logo"
      />
      <nav class="nav">
        <ul>
          <li><a href="#">Hjem</a></li>
          <li><Link to="/VelgKlubb">Ny klubbside</Link></li>
          <li><a href="#">Baner</a></li>
          <li><a href="#">Regler/Tips</a></li>
          <li><Link to="/Klubbsider">Klubber</Link></li>
          <li><a href="#">Nyheter</a></li>
          <li><a href="#">Logg inn</a></li>

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
