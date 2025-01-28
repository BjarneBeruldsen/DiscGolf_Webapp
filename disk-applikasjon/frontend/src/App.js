import LagKlubbSide from './LagKlubbSide';
import VelgKlubb from './VelgKlubb';
import LagKlubSide from './LagKlubSide';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";


function App() {
  return (
      <Router>
        <div className="App">
          <Header />
          <Footer />
          <div className="innhold">
              <Switch>
                <Route exact path="/LagKlubb">
                  <LagKlubbSide />
                </Route>
                <Route exact path="/VelgKlubb">
                  <VelgKlubb />
                </Route>
                <Route exact path="/LagKlubSide/:id">
                  <LagKlubSide />
                </Route>
              </Switch>
          </div>
        </div>
      </Router>
  );
}

export default App;
