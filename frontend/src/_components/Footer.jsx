import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-700 mt-auto">
      

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-8 py-6">
        <div>
          <h1 className="text-xl font-bold">DiscGolf</h1>
          <p className="mt-2">
            Disc golf er en spennende utendørs sport der målet er å kaste en frisbee i en kurv på færrest mulig kast.
            Med over 18,000 baner verden over, er sporten i vekst og passer for spillere i alle aldre og ferdighetsnivåer.
          </p>
        </div>

        <div className="text-center">
          <ul className="inline-block space-x-6 text-lg font-medium">
            <li className="inline"><Link to="/Hjem" className="hover:text-gray-800">Hjem</Link></li>
            <li className="inline"><Link to="/OmOss" className="hover:text-gray-800">Om oss</Link></li>
            <li className="inline"><Link to="/Personvern" className="hover:text-gray-800">Personvern</Link></li>
            <li className="inline"><Link to="/Sikkerhet" className="hover:text-gray-800">Sikkerhet</Link></li>
            <li className="inline"><Link to="/Informasjonskapsler" className="hover:text-gray-800">Informasjonskapsler</Link></li>
            <li className="inline"><Link to="/KontaktOss" className="hover:text-gray-800">Kontakt Oss</Link></li>
          </ul>
        </div>
        
        <div className="text-center justify-items-center">
          <p className="font-semibold">Kontakt oss</p>
          <p>Email: DiscgolfBø@gmail.com</p>
          <p>Bø, Norge</p>
        </div>
      </div>

      <div className="text-center py-2 bg-gray-200 text-black text-sm">
        <p>© 2025 DiscGolf. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;