import LagKlubbSide from './LagKlubbSide';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
      <Router>
        <div className="App">
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
