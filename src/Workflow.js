import React from 'react';
import './App.css';
import './Workflow.css';
import Material from './Material';
import Action from './Action';
var Util = require('./Util');

class Workflow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }

    this.state.flow = {
      aaa: "123",
      bbb: "234"
    };

  }

  updateState(width, height){
    //alert("updatestate " + width + ":" + height);
    this.setState({width: width});
    this.setState({height: height});
  }

  render() {
    return (
      <div className="Workflow">
        あいうえお
        {this.state.flow.bbb}

        <Material left={30} top={20} updateState={this.updateState.bind(this)} />
        {this.state.width}
        {this.state.height}

        <Material left={300} top={40} updateState={this.updateState.bind(this)} />
        {this.state.width}
        {this.state.height}

        <Action left={150} top={60} updateState={this.updateState.bind(this)} />


        かきくけこ<br/>
        {this.props.recipe.title}
        さしすせそ<br/>
        {this.props.recipe.description}
        たちつてと<br/>
        {this.props.recipe.material ? this.props.recipe.material.rice.name : ""}


        {Util.test3()}
      </div>
    );
  }
}

export default Workflow;
