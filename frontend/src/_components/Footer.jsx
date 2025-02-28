import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#D9D9D9] text-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-6">

        <div className="flex flex-col items-center space-y-6 md:flex-row md:justify-between md:items-start md:space-y-0">

          <div className="text-center md:text-left">
            <h1 className="text-xl font-bold text-gray-800">DiscGolf</h1>
            <p className="text-sm text-gray-700 mt-2 max-w-lg">
              Disc golf er en spennende utendørs sport der målet er å kaste en frisbee i en kurv på færrest mulig kast.
              Med over 18,000 baner verden over, er sporten i vekst og passer for spillere i alle aldre og ferdighetsnivåer.
            </p>
          </div>

          
          <div className="text-center">
            <ul className="flex flex-wrap justify-center space-x-4 space-y-2 md:space-x-6 md:space-y-0 text-lg font-medium">
              <li><Link to="/Hjem" className="hover:text-gray-800">Hjem</Link></li>
              <li><Link to="/OmOss" className="hover:text-gray-800">Om oss</Link></li>
              <li><Link to="/Personvern" className="hover:text-gray-800">Personvern</Link></li>
              <li><Link to="/Sikkerhet" className="hover:text-gray-800">Sikkerhet</Link></li>
              <li><Link to="/Informasjonskapsler" className="hover:text-gray-800">Informasjonskapsler</Link></li>
              <li><Link to="/KontaktOss" className="hover:text-gray-800">Kontakt oss</Link></li>
            </ul>
          </div>

          
          <div className="text-center">
            <p className="font-semibold text-gray-800">Kontakt oss</p>
            <p className="text-sm text-gray-700">Email: BoDiscGolf1@gmail.com</p>
            <p className="text-sm text-gray-700">Bø, Norge</p>
          </div>
        </div>
      </div>

      <div className="text-center py-2 bg-gray-200 text-black text-sm">
        <p>© 2025 DiscGolf. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;