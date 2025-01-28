import LagKlubb from './LagKlubb';
import VelgKlubb from './VelgKlubb';
import LagKlubbSide from './LagKlubbSide';
import Klubbsider from './Klubbsider';
import './output.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hjem from './sider/Hjem';
import Logginn from './sider/Logginn'; 
import Registrer from './sider/Registrer';


function App() {
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
                <Route exact path="/Logginn">
                  <Logginn />
                </Route>
                <Route exact path="/Registrer">
                  <Registrer />
                </Route>
                <Route path="/">
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
