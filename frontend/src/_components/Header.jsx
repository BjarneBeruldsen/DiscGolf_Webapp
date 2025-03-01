//Authors: Bjarne Beruldsen, Abdinasir Ali & Laurent Zogaj

import React, { useState } from "react";
import { Link } from "react-router-dom";
import loggUtBruker from "../BrukerHandtering/Utlogging";

const Header = ({ loggetInnBruker, setLoggetInnBruker }) => {
  const [menyÅpen, setMenyÅpen] = useState(false);

  const loggUt = async () => {
    const utloggingVellykket = await loggUtBruker();
    if (utloggingVellykket) {
      setLoggetInnBruker(null);
      lukkMeny();
    }
  };

  const toggleMeny = () => {
    setMenyÅpen(!menyÅpen);
  };

  const lukkMeny = () => {
    setMenyÅpen(false);
  };

  return (
    <div>
      <header className="flex items-center justify-between p-4 bg-[#ffffff] shadow-[#8a8358] text-white">
        <div className="flex items-center space-x-3">
          <img className="w-10 h-10 rounded-full" src="/DiscgolfLogo.png" alt="DiscGolf logo" />
          <Link to="/Hjem" className="text-l font-bold text-black">DiscGolf</Link>
        </div>

        <nav className="hidden-lg">
          <ul className="flex space-x-6">
            <li><Link to="/Hjem" className="text-black font-bold hover:text-gray-600">Hjem</Link></li>
            <li><Link to="/VelgKlubb" className="text-black font-bold hover:text-gray-600">Rediger klubbside</Link></li>
            <li><Link to="/Baner" className="text-black font-bold hover:text-gray-600">Baner</Link></li>
            <li><Link to="/Klubbsider" className="text-black font-bold hover:text-gray-600">Klubbsider</Link></li>
            <li><Link to="/nyheter" className="text-black font-bold hover:text-gray-600">Nyheter</Link></li>
            <li><Link to="/ScoreBoard" className="text-black font-bold hover:text-gray-600">ScoreBoard</Link></li>

            {loggetInnBruker ? (
              <>
                <li className="text-black font-bold hover:text-gray-600">
                  <Link to="/Medlemskap" onClick={lukkMeny}>Mitt Medlemskap</Link>
                </li>
                <li className="flex items-center">
                  <button onClick={loggUt} className="text-black font-bold hover:text-gray-600 px-4 py-2 border border-gray-300 rounded-lg">
                    Logg ut
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/Innlogging" className="text-black font-bold hover:text-gray-600">Logg inn</Link></li>
                <li><Link to="/Registrering" className="text-black font-bold hover:text-gray-600">Bli medlem!</Link></li>
              </>
            )}
          </ul>
        </nav>

        <div className="block-sm-md">
          <button onClick={toggleMeny} className="text-black font-bold hover:bg-gray-200 border rounded-lg shadow p-2">
            Meny
          </button>
        </div>
      </header>

      {menyÅpen && (
        <nav className="lg:hidden bg-white border-t border-gray-300 border-b">
          <ul className="flex flex-col space-y-4 p-4">
            <li><Link to="/Hjem" className="text-black font-bold hover:text-gray-600" onClick={lukkMeny}>Hjem</Link></li>
            <li><Link to="/VelgKlubb" className="text-black font-bold hover:text-gray-600" onClick={lukkMeny}>Rediger klubbside</Link></li>
            <li><Link to="/Baner" className="text-black font-bold hover:text-gray-600" onClick={lukkMeny}>Baner</Link></li>
            <li><Link to="/Klubbsider" className="text-black font-bold hover:text-gray-600" onClick={lukkMeny}>Klubbsider</Link></li>
            <li><Link to="/nyheter" className="text-black font-bold hover:text-gray-600" onClick={lukkMeny}>Nyheter</Link></li>
            <li><Link to="/ScoreBoard" className="text-black font-bold hover:text-gray-600" onClick={lukkMeny}>ScoreBoard</Link></li>

            {loggetInnBruker ? (
              <>
                <li className="text-black font-bold hover:text-gray-600">
                  <Link to="/Medlemskap" onClick={lukkMeny}>Mitt Medlemskap</Link>
                </li>
                <li className="flex items-center">
                  <button onClick={loggUt} className="text-black font-bold hover:text-gray-600 px-4 py-2 border border-gray-300 rounded-lg">
                    Logg ut
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/Innlogging" onClick={lukkMeny} className="text-black font-bold hover:text-gray-600">Logg inn</Link></li>
                <li><Link to="/Registrering" onClick={lukkMeny} className="text-black font-bold hover:text-gray-600">Bli medlem!</Link></li>
              </>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Header;