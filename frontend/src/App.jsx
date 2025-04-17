//Authors: Bjarne Beruldsen, Abdinasir Ali, Laurent Zogaj & Severin Waller Sørensen

import React, { useState, useEffect } from 'react';
import './i18n';
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
import Innlogging from './BrukerHandtering/Innlogging'; 
import Registrering from './BrukerHandtering/Registrering';
import Klubbside from './KlubbHandtering/Klubbside';
import Medlemskap from './BrukerHandtering/Medlemskap';
import Nyheter from './KlubbHandtering/Nyheter';
import Baner from './KlubbHandtering/Baner';
import loggUtBruker from "./BrukerHandtering/Utlogging";
//import GlemtPassord from "./BrukerHandtering/GlemtPassord";
//import TilbakestillPassord from './BrukerHandtering/TilbakestillPassord';
import ScoreBoard from './KlubbHandtering/ScoreBoard';
import Personvern from './_components/Personvern';
import Sikkerhet from './_components/Sikkerhet';
import Informasjonskapsler from './_components/Informasjonskapsler';
import KontaktOss from './_components/KontaktOss';
import OmOss from './_components/OmOss';
import PoengTavler from './KlubbHandtering/Poengtavler';
import HentBruker from "./BrukerHandtering/HentBruker";
import AdminRoute from "./Admin/AdminRoute";
import AdminDashboard from './Admin/AdminDashboard';
import TurneringsAdministrasjon from './Admin/TurneringsAdministrasjon';
import Systeminnstillinger from './Admin/Systeminnstillinger';
import BrukerListe from "./Admin/BrukerListe";
import RedigerBane from './KlubbHandtering/RedigerBane';
import Varsling from './_components/Varsling';
import socket from './socket';

function App() {
  const { bruker, venter } = HentBruker();
  const [loggetInnBruker, setLoggetInnBruker] = useState(null);
  const [sessionLastet, setSessionLastet] = useState(false); 
  const [visVarsling, setVisVarsling] = useState(false); 

  // Setter loggetInnBruker til bruker og angir sessionLastet til true når brukeren er lastet og venter er false
  useEffect(() => {
    if (!venter) {
      setLoggetInnBruker(bruker);  // Oppdaterer loggetInnBruker med bruker
      setSessionLastet(true);  // Setter sessionLastet til true fordi brukeren er lastet
    }
  }, [bruker, venter]); // Kjører når bruker eller venter endres

  // Flytt useEffect utenfor betingelsen
  useEffect(() => {
    // Lytt til meldinger fra serveren
    socket.on('receiveMessage', (data) => {
      console.log('Melding fra server:', data);
    });

    // Rydd opp når komponenten demonteres
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  if (!sessionLastet) {
    return <p className="text-center text-gray-700 mt-10">Laster inn...</p>;
  }

  const sendMessage = (melding) => {
    socket.emit('sendMessage', { text: 'Hei fra frontend!' });
  };

  const toggleVarsling = () => {
    setVisVarsling(!visVarsling); 
  };

  const refreshVarsling = () => {
    setVisVarsling(false); 
    setTimeout(() => {
      setVisVarsling(true); 
    }, 100); 
  }

  //Hovedkomponent som håndterer routing og visning av forskjellige sider i applikasjonen
  return (
    <Router>
      <div className="App">
        <Header 
          loggetInnBruker={loggetInnBruker} 
          setLoggetInnBruker={setLoggetInnBruker} 
          toggleVarsling={toggleVarsling}
          refreshVarsling={refreshVarsling}
        />
        {visVarsling && (
          <div>
            <Varsling 
              toggleVarsling={toggleVarsling}
            />
          </div>
        )}
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
              {loggetInnBruker ? (
                <Medlemskap loggetInnBruker={loggetInnBruker} />
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
            <Route exact path="/turneringsadministrasjon">
              {loggetInnBruker?.rolle === "klubbleder" ? (
                <TurneringsAdministrasjon />
            ) : (
                <Redirect to="/Innlogging" />
             )}
            </Route>
            <Route exact path="/Innlogging">
              {loggetInnBruker ? (
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
              
            {/* 
            <Route exact path="/TilbakestillPassord/:token">
              <TilbakestillPassord />
            </Route>
            <Route exact path="/GlemtPassord">
              <GlemtPassord />
            </Route>
            */}
            
            <Route exact path="/RedigerBane/:klubbId/:baneId">
              <RedigerBane />
            </Route>
            <Route exact path="/Personvern" component={Personvern} />
            <Route exact path="/Sikkerhet" component={Sikkerhet} />
            <Route exact path="/Informasjonskapsler" component={Informasjonskapsler} />
            <Route exact path="/KontaktOss" component={KontaktOss} /> 
          </Switch>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;