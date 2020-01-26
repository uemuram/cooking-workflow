import React from 'react';
import './App.css';
import './Workflow.css';
import Workflow from './Workflow';

class App2 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      aaa: "xxx",
      recipe: {}
    }
    // fetch(process.env.REACT_APP_BACKEND_URL + "/api/courses")
    //   .then(response => response.json())
    //   .then(json =>  this.setState( {aaa : json[0].name}));

    fetch(process.env.REACT_APP_BACKEND_URL + "/api/recipies/beefBowl")
      .then(response => response.json())
      .then(json => this.setState({ recipe: json }));


  }

  renderWorkflow() {
    return <Workflow recipe={this.state.recipe} />
  }

  render() {
    return (
      <div>
        <div>
          {this.renderWorkflow()}
        </div>
        <p>
          __test6 : {this.state.recipe.title}
        </p>
        <p>
          __test7 : {this.state.recipe.description}
        </p>
        <p>
          __test8 : {JSON.stringify(this.state.recipe.test)}
        </p>
        <p>
          __test9 : {//this.state.recipe.test.test2
          }
        </p>
        <p>
          __test10 : {this.state.recipe.test ? this.state.recipe.test.test2 : ""}
        </p>

      </div>
    )
  }
}

export default App2;
