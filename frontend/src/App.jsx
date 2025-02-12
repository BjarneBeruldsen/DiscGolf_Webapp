import React, { useState, useEffect } from 'react';
import LagKlubb from './LagKlubb';
import VelgKlubb from './VelgKlubb';
import LagKlubbSide from './LagKlubbSide';
import Klubbsider from './Klubbsider';
import './output.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hjem from './sider/Hjem';
import Innlogging from './sider/Innlogging'; 
import Registrering from './sider/Registrering';
import Klubbside from './Klubbside';
import Medlemskap from './sider/Medlemskap';
import Nyheter from './sider/Nyheter';
import Baner from './sider/Baner';
import loggUtBruker from "./sider/Utlogging";


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
                <Route exact path="/Hjem">
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
                  <Baner/>
                </Route>
                <Route exact path="/nyheter">
                  <Nyheter />
                </Route>
                <Route exact path="/medlemskap">
                  <Medlemskap />
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
              </Switch>
          </div>
          <Footer />
        </div>
      </Router>
  );
}

export default App;