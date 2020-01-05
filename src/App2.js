import React from 'react';
import './App.css';
import './Workflow.css';
import Workflow from './Workflow';

class App2 extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      aaa: "abcdeffg",
    }
    fetch(process.env.REACT_APP_BACKEND_URL + "/api/courses")
      .then(response => response.json())
      .then(json =>  this.setState( {aaa : json[0].name}));
  }

  renderWorkflow(){
    return <Workflow />
  }

  render() {
    return (
      <div>
        <p>
          test4 : {this.state.aaa}
        </p>
        <div>
          {this.renderWorkflow()}
        </div>
      </div>
    )
  }
}

export default App2;
