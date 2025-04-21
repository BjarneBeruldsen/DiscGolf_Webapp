//Authors: Bjarne Beruldsen, Abdinasir Ali & Laurent Zogaj

import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next'; 
import { Link } from "react-router-dom";
import loggUtBruker from "../BrukerHandtering/Utlogging";
import UseFetch from "../KlubbHandtering/UseFetch";
import socket from '../socket';
import HentBruker from "../BrukerHandtering/HentBruker";

const Header = ({ loggetInnBruker, setLoggetInnBruker, toggleVarsling, refreshVarsling }) => {
  const { t } = useTranslation();
  const [menyÅpen, setMenyÅpen] = useState(false);
  const [antallVarslinger, setAntallVarslinger] = useState(0);
  const [nyheter, setNyheter] = useState([]);
  const { bruker, venter } = HentBruker();
  const [antInvitasjoner, setAntInvitasjoner] = useState(0);
  const [erMedlem, setErMedlem] = useState(false);


  useEffect(() => {
    if(bruker) {
      console.log("Bruker:", bruker);
      setAntInvitasjoner((bruker.invitasjoner && bruker.invitasjoner.length) || 0);
    

    const hentNyheter = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/klubber`);
        const klubber = await response.json();
    
        const nyheterMedKlubb = klubber
          .filter((klubb) => {
            // Sjekk om brukeren er medlem av klubben
            return Array.isArray(klubb.medlemmer) && klubb.medlemmer.some(medlem => medlem.id === loggetInnBruker?.id);
          })
          .flatMap((klubb) =>
            klubb.nyheter.map((nyhet) => ({
              ...nyhet,
              klubbNavn: klubb.klubbnavn,
              klubbId: klubb._id,
            }))
          );
    
        setNyheter(nyheterMedKlubb);
        setAntallVarslinger(nyheterMedKlubb.length + antInvitasjoner);
      } catch (error) {
        console.error("Feil ved henting av nyheter:", error);
      }
    };
    hentNyheter(); 
    }


  }, [bruker]);

  useEffect(() => {
    // Lytt til meldinger fra serveren
    socket.on('nyhetOppdatert', (data) => {
        console.log('Nyhet lagt til fra socket:', data);
        const erMedlem = Array.isArray(data.data.medlemmer) && data.data.medlemmer.some(medlem => medlem.id === loggetInnBruker?.id);
        if (erMedlem) {
            setAntallVarslinger(prev => prev + 1); // Oppdater antall varslinger
            refreshVarsling(); // Refresh varslinger
        }
    });

    socket.on('invitasjonOppdatert', (data) => {
        console.log('Invitasjon lagt til fra socket:', data);
        console.log('mottakerid:', data.data.invitasjon.mottakerId);
        console.log('loggetinnbrukerid:', loggetInnBruker.id);
        if (data.data.invitasjon.mottakerId === loggetInnBruker.id) {
            setAntallVarslinger(antallVarslinger + 1); // Oppdater antall varslinger
            alert('Du har mottatt en varsling!');
            refreshVarsling();
        }
    }); 

    // Oppdater antall varslinger når en nyhet eller invitasjon legges til

    // Rydde opp ved avmontering av komponenten
    return () => {
        socket.off('nyhetOppdatert'); // Fjern lytteren når komponenten avmonteres
        socket.off('invitasjonOppdatert')
    };
}, )

  const loggUt = async () => {
    const utloggingVellykket = await loggUtBruker(setLoggetInnBruker);
    if (utloggingVellykket) {
      setLoggetInnBruker(null);
      lukkMeny();
    } else {
      console.error("Utlogging feilet!");
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
          <Link to="/Hjem" className="text-l font-bold text-black">
            DiscGolf
          </Link>
        </div>

        <nav className="hidden-lg">
          <ul className="flex space-x-6">
            <li>
              <Link to="/Hjem" className="text-black font-bold hover:text-gray-600">
                {t("Hjem")}
              </Link>
            </li>
              {loggetInnBruker && (loggetInnBruker.rolle === 'klubbleder' || loggetInnBruker.rolle === 'admin' || loggetInnBruker.rolle === 'hoved-admin') && (
                <li>
                <Link to="/VelgKlubb" className="text-black font-bold hover:text-gray-600">
                  {t("Rediger klubbside")}
                </Link>
                </li>
              )}
            <li>
              <Link to="/Baner" className="text-black font-bold hover:text-gray-600">
              {t("Baner")}
              </Link>
            </li>
            <li>
              <Link to="/Klubbsider" className="text-black font-bold hover:text-gray-600">
                {t("Klubbsider")}
              </Link>
            </li>
            {loggetInnBruker && (
              <li>
                <Link to="/MinePoengtavler" className="text-black font-bold hover:text-gray-600">
                  {t("Min statistikk")}
                </Link>
              </li>
            )}

            {loggetInnBruker ? (
              <>
                <li className="text-black font-bold hover:text-gray-600">
                  <Link to="/Medlemskap" onClick={lukkMeny}>
                    {t("Mitt Medlemskap")}
                  </Link>
                </li>
                <li className="relative">
                  <button onClick={toggleVarsling} className="w-8 cursor-pointer">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z"
                        stroke="#292D32"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                      ></path>
                      <path
                        d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z"
                        stroke="#292D32"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601"
                        stroke="#292D32"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                      ></path>
                    </svg>
                  </button>
                  {antallVarslinger > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {antallVarslinger}
                    </span>
                  )}
                </li>
                <li className="flex items-center">
                  <button
                    onClick={loggUt}
                    className="text-black font-bold hover:text-gray-600 px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {t("Logg ut")}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/Innlogging" className="text-black font-bold hover:text-gray-600">
                    {t("Logg inn")}
                  </Link>
                </li>
                <li>
                  <Link to="/Registrering" className="text-black font-bold hover:text-gray-600">
                    {t("Bli medlem!")}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        <div className="block-sm-md">
        <li className="inline-block absolute p-2 right-20">
                  <button onClick={toggleVarsling} className="w-8 cursor-pointer">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z"
                        stroke="#292D32"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                      ></path>
                      <path
                        d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z"
                        stroke="#292D32"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601"
                        stroke="#292D32"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                      ></path>
                    </svg>
                  </button>
                  {antallVarslinger > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {antallVarslinger}
                    </span>
                  )}
              </li>
          <button
            onClick={toggleMeny}
            className="text-black font-bold hover:bg-gray-200 border rounded-lg shadow p-2 ml-2"
          >
            {t("Meny")}
          </button>
        </div>
      </header>

      {menyÅpen && (
        <nav className="lg:hidden bg-white border-t border-gray-300 border-b">
          <ul className="flex flex-col space-y-4 p-4">
            <li>
              <Link to="/Hjem" className="text-black font-bold hover:text-gray-600" onClick={lukkMeny}>
              {t("Hjem")}
              </Link>
            </li>
              {loggetInnBruker && (loggetInnBruker.rolle === 'klubbleder' || loggetInnBruker.rolle === 'admin' || loggetInnBruker.rolle === 'hoved-admin') && (
                <li>
                <Link to="/VelgKlubb" className="text-black font-bold hover:text-gray-600" onClick={lukkMeny}>
                  {t("Rediger klubbside")}
                </Link>
                </li>
              )}
            <li>
              <Link to="/Baner" className="text-black font-bold hover:text-gray-600" onClick={lukkMeny}>
                {t("Baner")}
              </Link>
            </li>
            <li>
              <Link to="/Klubbsider" className="text-black font-bold hover:text-gray-600" onClick={lukkMeny}>
                {t("Klubbsider")}
              </Link>
            </li>
            {loggetInnBruker && (
              <li>
                <Link to="/MinePoengtavler" className="text-black font-bold hover:text-gray-600" onClick={lukkMeny}>
                  {t("Min statistikk")}
                </Link>
              </li>
            )}

            {loggetInnBruker ? (
              <>
                <li className="text-black font-bold hover:text-gray-600">
                  <Link to="/Medlemskap" onClick={lukkMeny}>
                    {t("Mitt Medlemskap")}
                  </Link>
                </li>
                <li className="flex items-center">
                  <button
                    onClick={loggUt}
                    className="text-black font-bold hover:text-gray-600 px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {t("Logg ut")}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/Innlogging" onClick={lukkMeny} className="text-black font-bold hover:text-gray-600">
                    {t("Logg inn")}
                  </Link>
                </li>
                <li>
                  <Link to="/Registrering" onClick={lukkMeny} className="text-black font-bold hover:text-gray-600">
                  {t("Bli medlem!")}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Header;