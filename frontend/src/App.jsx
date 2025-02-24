import React, { useState, useEffect } from 'react';
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
import ScoreBoard from './KlubbHandtering/ScoreBoard';

function App() {
  const [loggetInnBruker, setLoggetInnBruker] = useState(null);
  const [laster, setLaster] = useState(true);

  const sjekkSession = async () => {
    try {
      const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/sjekk-session`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (respons.status === 401) {
        console.log("Brukeren er ikke logget inn (401 Unauthorized)");
        setLoggetInnBruker(null);
        localStorage.removeItem("bruker");
      } else {
        const data = await respons.json();
        if (data.bruker) {
          console.log("Bruker er logget inn:", data.bruker);
          setLoggetInnBruker(data.bruker);
          localStorage.setItem("bruker", JSON.stringify(data.bruker));
        } else {
          console.log("Ingen bruker funnet i session");
          setLoggetInnBruker(null);
          localStorage.removeItem("bruker");
        }
      }
    } catch (error) {
      console.error("Feil ved henting av session:", error);
      setLoggetInnBruker(null);
      localStorage.removeItem("bruker");
    } finally {
      setLaster(false);
    }
  };

  useEffect(() => {
    console.log("Sjekker localStorage...");
    const lagretBruker = localStorage.getItem("bruker");

    if (lagretBruker) {
      console.log("Bruker funnet i localStorage:", JSON.parse(lagretBruker));
      setLoggetInnBruker(JSON.parse(lagretBruker));
    }

    sjekkSession(); 
  }, []);

  if (laster) {
    return <p className="text-center text-gray-700 mt-10">Laster inn.</p>;
  }

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