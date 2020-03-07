import React from 'react';
import './css/Workflow.css';

// ルート 
import {
  BrowserRouter,
  Route,
  Link
} from "react-router-dom";

import MakeRecipe from "./MakeRecipe";
import Page1 from "./Page1";
import Page2 from "./Page2";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <BrowserRouter>

          <header className="Header">
            <nav>
              <ul className="Navigation">
                <li><Link to="/makeRecipe">レシピを作る</Link></li>
                <li><Link to="/page/1">Page1</Link></li>
                <li><Link to="/page/2">Page2</Link></li>
                <li>Page4</li>
              </ul>
            </nav>
          </header>

          <div className="Body">
            <Route path="/page/1" component={Page1} />
            <Route path="/page/2" component={Page2} />
            <Route path="/makeRecipe" component={MakeRecipe} />
          </div>

        </BrowserRouter>

      </div>
    )
  }
}

export default App;