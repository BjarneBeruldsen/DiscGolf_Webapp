import LagKlubbSide from './LagKlubbSide';
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
                <Route exact path="/lagKlubb">
                  <LagKlubbSide />
                </Route>
              </Switch>
          </div>
        </div>
      </Router>
  );
}

export default App;
