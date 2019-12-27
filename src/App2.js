import React from 'react';
import './App.css';


class Workflow extends React.Component{

  constructor(props){
    super(props);
    this.state = {
    }

    this.state.flow = {
      aaa : "123",
      bbb : "234"
    };

    this.state.flow2 = {
      title : "牛丼",
      material : {
        sugar : {
          name : "砂糖",
          quantity : [
            {
              amount : 9,
              unit : "g"
            }
          ]
        },
        SoySauce : {
          name : "醤油",
          quantity : [
            {
              amount : 45,
              unit : "ml"
            }
          ]
        }
      },
      action : [
        {
          type : "move",
          source : "sugar",
          target : "bawl",
          comment : "砂糖をボールへ"
        },
        {
          type : "move",
          source : "SoySauce",
          target : "bawl",
          comment : "醤油をボールへ"
        }
      ]
    };



  }

  render() {
    return (<div>{this.state.flow.bbb}</div>);
  }
}

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
          {this.renderWorkflow()}
        </div>
      </div>
    )
  }
}

export default App2;
