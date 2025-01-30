import React, { useEffect } from 'react';
import LagKlubb from './LagKlubb';
import VelgKlubb from './VelgKlubb';
import LagKlubbSide from './LagKlubbSide';
import Klubbsider from './Klubbsider';
import './output.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hjem from './sider/Hjem';
import Innlogging from './sider/Innlogging'; 
import Registrering from './sider/Registrering';
import logo from './bilder/DiscGolfLogo.png';

function App() {
  useEffect(() => {
    const favicon = document.getElementById('favicon');
    if (favicon) {
      favicon.href = logo;
    }
  }, []);

  return (
      <Router>
        <div className="App">
          <Header />
          <div className="innhold">
              <Switch>
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
                <Route exact path="/Innlogging">
                  <Innlogging />
                </Route>
                <Route exact path="/Registrering" component={Registrering} /> 
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