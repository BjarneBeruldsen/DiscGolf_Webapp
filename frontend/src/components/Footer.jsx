import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-700 mt-auto">
      <div className="bg-white text-grey-200 py-6 text-center font-bold">
        <h1 className="text-2xl">Over 5,000 Baner</h1>
        <p className="text-lg">Registrer resultater og forbedre din spillopplevelse</p>
      </div>

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
            <li className="inline"><Link to="#" className="hover:text-gray-800">Kontakt oss</Link></li>
            <li className="inline"><Link to="#" className="hover:text-gray-800">Om oss</Link></li>
            <li className="inline"><Link to="#" className="hover:text-gray-800">Personvern og informasjonskapsler</Link></li>
            <li className="inline"><Link to="#" className="hover:text-gray-800">Sikkerhet</Link></li>

          </ul>
        </div>

        <div className="text-center">
          <p className="font-semibold">Kontakt oss</p>
          <p>Telefon: 1256789</p>
          <p>Email: DiscgolfBø@gmail.com</p>
          <p>BØ, Norway</p>
        </div>
      </div>

      <div className="text-center py-2 bg-grey-200 text-black text-sm">
        <p>© 2024 DiscGolf. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;