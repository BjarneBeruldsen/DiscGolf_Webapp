import React, { useState } from "react";
import { Link } from "react-router-dom";
import loggUtBruker from "../sider/Utlogging";

const storBokstav = (str) => {
  if (!str) return "";                                            //https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const Header = ({ loggetInnBruker, setLoggetInnBruker }) => {
  const [menyÅpen, setMenyÅpen] = useState(false);

  const loggUt = async () => {
    const utloggingVellykket = await loggUtBruker();
    if (utloggingVellykket) {
      setLoggetInnBruker(null);
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
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-300">
        <div className="flex items-center space-x-3">
          <img className="w-10 h-10 rounded-full" src="/DiscgolfLogo.png" alt="DiscGolf logo" />
          <Link to="/Hjem" className="text-xl font-bold">DiscGolf</Link>
        </div>

        <nav className="hidden-lg">
          <ul className="flex space-x-6">
            <li><Link to="/Hjem" className="text-black font-bold hover:text-gray-600">Hjem</Link></li>
            <li><Link to="/VelgKlubb" className="text-black font-bold hover:text-gray-600">Rediger klubbside</Link></li>
            <li><Link to="/Baner" className="text-black font-bold hover:text-gray-600">Baner</Link></li>
            <li><Link to="/Klubbsider" className="text-black font-bold hover:text-gray-600">Klubber</Link></li>
            <li><Link to="/nyheter" className="text-black font-bold hover:text-gray-600">Nyheter</Link></li>
            <li><Link to="/ScoreBoard" className="text-black font-bold hover:text-gray-600">ScoreBoard</Link></li>

            {loggetInnBruker ? (
              <>
                <li className="text-black font-bold hover:text-gray-600">
                  <Link to="/medlemskap">{storBokstav(loggetInnBruker.bruker)}</Link>
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
        <nav className="lg:hidden bg-white border-t border-gray-300">
          <ul className="flex flex-col space-y-4 p-4">
            <li><Link to="/Hjem" className="text-black font-bold hover:text-gray-600" onClick={lukkMeny}>Hjem</Link></li>
            <li><Link to="/VelgKlubb" className="text-black font-bold hover:text-gray-600" onClick={lukkMeny}>Rediger klubbside</Link></li>
            <li><Link to="/Baner" className="text-black font-bold hover:text-gray-600" onClick={lukkMeny}>Baner</Link></li>
            <li><Link to="/Klubbsider" className="text-black font-bold hover:text-gray-600" onClick={lukkMeny}>Klubber</Link></li>
            <li><Link to="/nyheter" className="text-black font-bold hover:text-gray-600" onClick={lukkMeny}>Nyheter</Link></li>
            <li><Link to="/ScoreBoard" className="text-black font-bold hover:text-gray-600" onClick={lukkMeny}>ScoreBoard</Link></li>

        {loggetInnBruker ? (
                <>
                  <li className="text-black font-bold hover:text-gray-600">
                    <Link to="/medlemskap" onClick={lukkMeny}>
                      {storBokstav(loggetInnBruker.bruker)}
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <button onClick={loggUt} className="text-black font-bold hover:text-gray-600 px-4 py-2 border border-gray-300 rounded-lg">
                      Logg ut
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/Innlogging" onClick={lukkMeny} className="text-black font-bold hover:text-gray-600">
                      Logg inn
                    </Link>
                  </li>
                  <li>
                    <Link to="/Registrering" onClick={lukkMeny} className="text-black font-bold hover:text-gray-600">
                      Bli medlem!
                    </Link>
                  </li>
                </>
              )}
          </ul>
        </nav>
      )}

      <div className="w-full max-h-[600px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1616840388998-a514fe2175b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="bilde"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Header;