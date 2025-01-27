import LagKlubb from './LagKlubb';
import VelgKlubb from './VelgKlubb';
import LagKlubbSide from './LagKlubSide';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
      <Router>
        <div className="App">
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
              </Switch>
          </div>
        </div>
      </Router>
  );
}

export default App;
