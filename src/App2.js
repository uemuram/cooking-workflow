import React from 'react';
import './App.css';
import './Workflow.css';
import Workflow from './Workflow';

class App2 extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      aaa: "xxx",
      recipe : {}
    }
    // fetch(process.env.REACT_APP_BACKEND_URL + "/api/courses")
    //   .then(response => response.json())
    //   .then(json =>  this.setState( {aaa : json[0].name}));

    fetch(process.env.REACT_APP_BACKEND_URL + "/api/recipies/beefBowl")
      .then(response => response.json())
      .then(json =>  this.setState( {recipe : json}));
  }

  renderWorkflow(){
    return <Workflow recipe={this.state.recipe}/>
  }

  render() {
    return (
      <div>
        <p>
          __test6 : {this.state.recipe.title}
        </p>
        <div>
          {this.renderWorkflow()}
        </div>
      </div>
    )
  }
}

export default App2;
