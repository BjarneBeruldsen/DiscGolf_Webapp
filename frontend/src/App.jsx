import React, { useState, useEffect } from 'react';
import LagKlubb from './KlubbHåndtering/LagKlubb';
import VelgKlubb from './KlubbHåndtering/VelgKlubb';
import LagKlubbSide from './KlubbHåndtering/LagKlubbSide';
import Klubbsider from './KlubbHåndtering/Klubbsider';
import './output.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import Bilde from "./_components/Bilde";
import Hjem from './_components/Hjem';
import Innlogging from './BrukerHåndtering/Innlogging'; 
import Registrering from './BrukerHåndtering/Registrering';
import Klubbside from './KlubbHåndtering/Klubbside';
import Medlemskap from './BrukerHåndtering/Medlemskap';
import Nyheter from './KlubbHåndtering/Nyheter';
import Baner from './KlubbHåndtering/Baner';
import loggUtBruker from "./BrukerHåndtering/Utlogging";
import ScoreBoard from './KlubbHåndtering/ScoreBoard';

function App() {
  const [loggetInnBruker, setLoggetInnBruker] = useState(null);

  useEffect(() => {
      const lagretBruker = localStorage.getItem("bruker");
      if (lagretBruker) {
          setLoggetInnBruker(JSON.parse(lagretBruker));
      }

      const sjekkSession = async () => {
          try {
              const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/sjekk-session`, {
                  method: "GET",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
              });

              const data = await respons.json();
              if (respons.ok && data.bruker) {
                  setLoggetInnBruker(data.bruker);
                  localStorage.setItem("bruker", JSON.stringify(data.bruker));
              } else {
                  setLoggetInnBruker(null);
                  localStorage.removeItem("bruker");
              }
          } catch (error) {
              console.error("Feil ved henting av session:", error);
              setLoggetInnBruker(null);
              localStorage.removeItem("bruker");
          }
      };

      sjekkSession();
  }, []);

  return (
      <Router>
        <div className="App">
        <Header loggetInnBruker={loggetInnBruker} setLoggetInnBruker={setLoggetInnBruker} />
          <div className="innhold">
              <Switch>
              <Route exact path="/"><Bilde/> <Hjem />
              </Route>
                <Route exact path="/Hjem"><Bilde/> <Hjem />
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
                  <Baner/>
                </Route>
                <Route exact path="/nyheter">
                  <Nyheter />
                </Route>
                <Route exact path="/medlemskap">
                {loggetInnBruker ? (
                  <Medlemskap loggetInnBruker={loggetInnBruker} />
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
                      setLoggUtBruker={loggUtBruker} 
                    />
                  )}
                </Route>
                <Route exact path="/Registrering">
                  <Registrering />
                </Route>
                <Route exact path="/">
                  <Hjem />
                </Route>
                <Route exact path="/scoreboard">
                  <ScoreBoard />
                </Route>
              </Switch>
              
              <Footer />
          </div>
         
        </div>
      </Router>
  );
}

export default App;