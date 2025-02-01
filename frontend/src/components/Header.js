import React from "react";
import { Link } from "react-router-dom";

const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const Header = ({ loggetInnBruker, setLoggetInnBruker }) => {
  const handleLogout = async () => {
    try {
      const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Utlogging`, {
        method: "POST",
        credentials: "include",
      });

      if (respons.ok) {
        localStorage.removeItem("bruker");
        setLoggetInnBruker(null);
      } else {
        console.error("Feil ved utlogging");
      }
    } catch (error) {
      console.error("Feil ved utlogging:", error);
    }
  };

  return (
     <div>
     
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-300">
        
       
        <div className="flex items-center space-x-3">
          <img
            className="w-10 h-10 rounded-full"
            src="/DiscgolfLogo.png"
            alt="DiscGolf logo"
          />
          <span className="text-xl font-bold">DiscGolf</span>
        </div>

        
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/Hjem" className="text-black font-bold hover:text-gray-600">Hjem</Link></li>
            <li><Link to="/VelgKlubb" className="text-black font-bold hover:text-gray-600">Ny klubbside</Link></li>
            <li><Link to="/Baner" className="text-black font-bold hover:text-gray-600">Baner</Link></li>
            <li><Link to="#" className="text-black font-bold hover:text-gray-600">Regler/Tips</Link></li>
            <li><Link to="/Klubbsider" className="text-black font-bold hover:text-gray-600">Klubber</Link></li>
            <li><Link to="/nyheter" className="text-black font-bold hover:text-gray-600">Nyheter</Link></li>

            {loggetInnBruker ? (
              <>
                <li className="text-black font-bold hover:text-gray-600">
                <Link to="/medlemskap">{capitalize(loggetInnBruker.bruker)}</Link>
                </li>
                <li className="flex items-center">
                  <button 
                    onClick={handleLogout} 
                    className="text-black font-bold hover:text-gray-600 px-4 py-2 border border-gray-300 rounded-lg"
                  >
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
      </header>

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
