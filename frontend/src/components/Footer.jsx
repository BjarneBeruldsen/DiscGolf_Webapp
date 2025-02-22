import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-700 mt-auto w-full">

      <div className="bg-white text-gray-800 py-6 text-center font-bold">
        <h1 className="text-2xl">Over 5,000 Baner</h1>
        <p className="text-lg">Registrer resultater og forbedre din spillopplevelse</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full px-4 py-4">
        
        <div className="flex justify-start">
          <div className="text-left">
            <h1 className="text-xl font-bold mb-2">DiscGolf</h1>
            <p className="text-sm lg:text-base">
              Disc golf er en spennende utendørs sport der målet er å kaste en frisbee i en kurv
              på færrest mulig kast. Med over 18,000 baner verden over, er sporten i vekst og
              passer for spillere i alle aldre og ferdighetsnivåer.
            </p>
          </div>
        </div>
        
        <div className="flex justify-center items-center">
          <ul className="flex flex-col lg:flex-row gap-4 lg:gap-6 text-base text-center">
            <li>
              <Link to="/Hjem" className="hover:text-gray-800 block">
                Hjem
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-800 block">
                Om oss
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-800 block">
                Personvern og informasjonskapsler
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-800 block">
                Sikkerhet
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="flex justify-end">
          <div className="text-right">
            <p className="font-semibold mb-2">Kontakt oss</p>
            <p>Telefon: 1256789</p>
            <p>Email: DiscgolfBø@gmail.com</p>
            <p>BØ, Norway</p>
          </div>
        </div>
      </div>

      <div className="text-center py-2 bg-gray-200 text-black text-sm">
        <p>© 2024 DiscGolf. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;