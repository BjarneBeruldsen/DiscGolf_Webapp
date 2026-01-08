//Authors: Bjarne Beruldsen, Abdinasir Ali, Laurent Zogaj & Severin Waller Sørensen

/* Denne filen er hovedkomponenten i applikasjonen.
 * Den håndterer routing, autentisering og visning av forskjellige sider.
 * De viktigste funksjonalitetene er
 * - Dynamisk routing (via React Router)
 * - Rollebasert tilgang (basert på brukerens rolle)
 * - Tilkobling til backend via API-kall og socket
 */

import React, { useState, useEffect, useRef } from 'react';
import './i18n';
import { getCsrfToken } from './utils/api';
import LagKlubb from './KlubbHandtering/LagKlubb';
import VelgKlubb from './KlubbHandtering/VelgKlubb';
import LagKlubbSide from './KlubbHandtering/LagKlubbSide';
import Klubbsider from './KlubbHandtering/Klubbsider';
import './output.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import Bilde from "./_components/Bilde";
import Hjem from './_components/Hjem';
import Kjeks from "./_components/Kjeks";
import Innlogging from './BrukerHandtering/Innlogging'; 
import Registrering from './BrukerHandtering/Registrering';
import Klubbside from './KlubbHandtering/Klubbside';
import Medlemskap from './BrukerHandtering/Medlemskap';
import Nyheter from './KlubbHandtering/Nyheter';
import Baner from './KlubbHandtering/Baner';
import loggUtBruker from "./BrukerHandtering/Utlogging";
import GlemtPassord from "./BrukerHandtering/GlemtPassord";
import TilbakestillPassord from './BrukerHandtering/TilbakestillPassord';
import ScoreBoard from './KlubbHandtering/ScoreBoard';
import Personvern from './_components/Personvern';
import Sikkerhet from './_components/Sikkerhet';
import Informasjonskapsler from './_components/Informasjonskapsler';
import KontaktOss from './_components/KontaktOss';
import OmOss from './_components/OmOss';
import PoengTavler from './KlubbHandtering/Poengtavler';
import HentBruker from "./BrukerHandtering/HentBruker";
import AdminDashboard from './Admin/AdminDashboard';
import Systeminnstillinger from './Admin/Systeminnstillinger';
import BrukerListe from "./Admin/BrukerListe";
import SystemLogg from "./Admin/LoggSystem";
import RedigerBane from './KlubbHandtering/RedigerBane';
import Varsling from './_components/Varsling';
import socket from './socket';
import AbonnementInfo from './_components/Abonnenter';
import DiscGolfInfo from './_components/DiscGolf';
import { useTranslation } from 'react-i18next';

function App() {
  const { bruker, venter } = HentBruker();
  const [loggetInnBruker, setLoggetInnBruker] = useState(null);
  const [visVarsling, setVisVarsling] = useState(false);
  const setAntallVarslingerRef = useRef(null);
  const { t } = useTranslation();

  // Hent CSRF token når appen starter
  useEffect(() => {
    getCsrfToken().catch(error => {
      console.error('Feil ved henting av CSRF token:', error);
    });
  }, []);

  // Oppdater loggetInnBruker når bruker endres
  useEffect(() => {
    if (!venter) {
      setLoggetInnBruker(bruker);
    }
  }, [bruker, venter]);

  // Lytt til socket-meldinger
  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      console.log('Melding fra server:', data);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  // Vis laster-melding mens session lastes
  if (venter) {
    return <p className="text-center text-gray-700 mt-10">{t("Laster inn...")}</p>;
  }

  //Hovedkomponent som håndterer routing og visning av forskjellige sider i applikasjonen
  return (
    <Router>
      <div className="App">
        <Header 
          loggetInnBruker={loggetInnBruker} 
          setLoggetInnBruker={setLoggetInnBruker} 
          toggleVarsling={() => setVisVarsling(!visVarsling)}
          refreshVarsling={() => {
            setVisVarsling(false);
            setTimeout(() => setVisVarsling(true), 100);
          }}
          setAntallVarslingerRef={setAntallVarslingerRef}
        />
        {visVarsling && (
          <Varsling
            toggleVarsling={() => setVisVarsling(false)}
            setAntallVarslingerRef={setAntallVarslingerRef}
          />
        )}
        <Kjeks />
        <div className="innhold">
          <Switch>
            <Route exact path="/">
              <Bilde />
              <Hjem />
            </Route>
            <Route exact path="/Hjem">
              <Bilde />
              <Hjem />
            </Route>
            <Route exact path="/LagKlubb">
              <LagKlubb />
            </Route>
            <Route exact path="/VelgKlubb">
              <VelgKlubb />
            </Route>
            <Route exact path="/LagKlubbSide/:id">
              <LagKlubbSide />
            </Route>
            <Route exact path="/Klubbsider">
              <Klubbsider />
            </Route>
            <Route exact path="/Klubbside/:id">
              <Klubbside />
            </Route>
            <Route exact path="/Baner">
              <Baner />
            </Route>
            <Route exact path="/nyheter">
              <Nyheter />
            </Route>
            <Route exact path="/OmOss">
              <OmOss />
            </Route>
            <Route exact path="/medlemskap">
              {venter ? (
                <p className="text-center text-gray-700 mt-10">{t("Laster inn...")}</p>
              ) : bruker ? (
                <Medlemskap loggetInnBruker={bruker} />
              ) : (
                <Redirect to="/Innlogging" />
              )}
            </Route>
            <Route exact path="/Medlemskap">
              {venter ? (
                <p className="text-center text-gray-700 mt-10">{t("Laster inn...")}</p>
              ) : bruker ? (
                <Medlemskap loggetInnBruker={bruker} />
              ) : (
                <Redirect to="/Innlogging" />
              )}
            </Route>
            <Route exact path="/systeminnstillinger">
              {loggetInnBruker?.rolle === "hoved-admin" ? (
                <Systeminnstillinger />
              ) : (
                <Redirect to="/Innlogging" />
              )}
            </Route>
            <Route exact path="/brukeradministrasjon">
              {loggetInnBruker?.rolle === "hoved-admin" ? (
                <BrukerListe />
              ) : (
                <Redirect to="/Innlogging" />
              )}
            </Route>
            <Route exact path="/systemlogg">
              {loggetInnBruker?.rolle === "hoved-admin" ? (
                <SystemLogg />
              ) : (
                <Redirect to="/Innlogging" />
              )}
            </Route>
            <Route exact path="/admindashboard">
             {loggetInnBruker?.rolle === "hoved-admin" || 
              loggetInnBruker?.rolle === "admin" ? (
               <AdminDashboard />
             ) : (
               <Redirect to="/Innlogging" />
             )}
            </Route>
            <Route exact path="/Innlogging">
              {venter ? (
                <p className="text-center text-gray-700 mt-10">{t("Laster inn...")}</p>
              ) : bruker ? (
                <Redirect to="/Hjem" />
              ) : (
                <Innlogging 
                  setLoggetInnBruker={setLoggetInnBruker}
                  loggUtBruker={loggUtBruker}
                />
              )}
            </Route>
            <Route exact path="/Registrering">
              {loggetInnBruker ? <Redirect to="/Hjem" /> : <Registrering />}
            </Route>
            <Route exact path="/ScoreBoard/:baneId">
              <ScoreBoard />
            </Route>
            <Route exact path="/ScoreBoard/:baneId/:rundeId">
              <ScoreBoard />
            </Route>
            <Route exact path="/MinePoengtavler">
              <PoengTavler />
            </Route>
            <Route exact path="/TilbakestillPassord/:token">
              <TilbakestillPassord />
            </Route>
            <Route exact path="/GlemtPassord">
              <GlemtPassord />
            </Route>
            <Route exact path="/RedigerBane/:klubbId/:baneId">
              <RedigerBane />
            </Route>
            <Route exact path="/Personvern" component={Personvern} />
            <Route exact path="/Sikkerhet" component={Sikkerhet} />
            <Route exact path="/Informasjonskapsler" component={Informasjonskapsler} />
            <Route exact path="/KontaktOss" component={KontaktOss} /> 
            <Route exact path="/Abonnenter" component={AbonnementInfo} />
            <Route exact path="/DiscGolf" component={DiscGolfInfo} />
          </Switch>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;