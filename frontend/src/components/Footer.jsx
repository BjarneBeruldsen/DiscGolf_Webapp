import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-200 text-gray-900">
  
      <div className="bg-white text-center py-6 font-bold">
        <h1 className="text-2xl">Over 5,000 Baner</h1>
        <p className="text-lg">Registrer resultater og forbedre din spillopplevelse</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 w-full p-6 items-start">
      
        <div className="justify-self-start text-left max-w-xl whitespace-normal break-words self-start">
          <h1 className="text-xl font-bold">DiscGolf</h1>
          <p className="mt-2">
            Disc golf er en spennende utendørs sport der målet er å kaste en frisbee i en kurv 
            på færrest mulig kast. Med over 18,000 baner verden over, er sporten i vekst og 
            passer for spillere i alle aldre og ferdighetsnivåer.
          </p>
        </div>
        
        <div className="justify-self-center text-center flex flex-col lg:flex-row gap-4 self-start">
          <Link to="/Hjem" className="hover:text-gray-700">Hjem</Link>
          <Link to="/OmOss" className="hover:text-gray-700">Om oss</Link>
          <Link to="/Personvern" className="hover:text-gray-700">Personvern</Link>
          <Link to="/Sikkerhet" className="hover:text-gray-700">Sikkerhet</Link>
        </div>
        
        <div className="justify-self-end text-right self-start">
          <p className="font-semibold">Kontakt oss</p>
          <p>Telefon: 1256789</p>
          <p>Email: DiscgolfBø@gmail.com</p>
          <p>Bø, Norway</p>
        </div>
      </div>

      <div className="w-full text-center py-2 bg-gray-300 text-black text-sm">
        <p>© 2025 DiscGolf. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;