import React from 'react';
import './css/Workflow.css';

// ルート 
import {
  BrowserRouter,
  Route,
  Link
} from "react-router-dom";

import MakeRecipe from "./MakeRecipe";
import Cooking from "./Cooking";
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
                <li><Link to="/cooking">調理する</Link></li>
                <li><Link to="/page/2">ページ2</Link></li>
                <li>ページ3</li>
              </ul>
            </nav>
          </header>

          <div className="Body">
            <Route path="/makeRecipe" component={MakeRecipe} />
            <Route path="/cooking" component={Cooking} />
            <Route path="/page/2" component={Page2} />
          </div>

        </BrowserRouter>
      </div>
    )
  }
}

export default App;