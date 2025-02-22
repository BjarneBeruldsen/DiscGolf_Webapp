import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-700 mt-auto py-4">
      <div className="bg-white text-gray-700 py-6 text-center font-bold">
        <h1 className="text-2xl">Over 5,000 Baner</h1>
        <p className="text-lg">Registrer resultater og forbedre din spillopplevelse</p>
      </div>

      <div className="max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 py-6 text-center lg:text-left">
        <div>
          <h1 className="text-xl font-bold">DiscGolf</h1>
          <p className="mt-2">
            Disc golf er en spennende utendørs sport der målet er å kaste en frisbee i en kurv på færrest mulig kast.
            Med over 18,000 baner verden over, er sporten i vekst og passer for spillere i alle aldre og ferdighetsnivåer.
          </p>
        </div>

        <div>
          <ul className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-6 text-lg font-medium">
            <li><Link to="/Hjem" className="hover:text-gray-800">Hjem</Link></li>
            <li><Link to="#" className="hover:text-gray-800">Om oss</Link></li>
            <li><Link to="#" className="hover:text-gray-800">Personvern og informasjonskapsler</Link></li>
            <li><Link to="#" className="hover:text-gray-800">Sikkerhet</Link></li>
          </ul>
        </div>

        <div className="text-center lg:text-right">
          <p className="font-semibold">Kontakt oss</p>
          <p>Telefon: 1256789</p>
          <p>Email: DiscgolfBø@gmail.com</p>
          <p>BØ, Norway</p>
        </div>
      </div>

      <div className="w-full flex justify-center py-2 bg-gray-200 text-black text-sm">
        <p>© 2024 DiscGolf. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;