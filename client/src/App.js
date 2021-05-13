import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Admin } from "./pages/admin";
import { Authentication } from "./pages/authentication";
import { Homepage } from "./pages/homepage";
import "./App.css";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, []);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/home">
            {/*For customer only*/}
            <Homepage />
          </Route>
          <Route path="/admin">
            {/*For admin only*/}
            <Admin />
          </Route>
          <Route path="/">
            {/*Authentication for customer*/}
            <Authentication />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
