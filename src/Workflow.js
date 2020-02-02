import React from 'react';
import './App.css';
import './Workflow.css';
import Material from './Material';
import Action from './Action';
import Util from './Util';
const util = new Util();

class Workflow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  updateState(width, height) {
    //alert("updatestate " + width + ":" + height);
    this.setState({ width: width });
    this.setState({ height: height });
  }

  renderAction() {
     return [
       <Action left={150} top={60} key={"aaa"} updateState={this.updateState.bind(this)} />,
       <Action left={160} top={60} key={"bbb"} updateState={this.updateState.bind(this)} />
     ]
  }

  renderMaterial() {
    return [
      <Material left={300} top={5} key={"aaa"} updateState={this.updateState.bind(this)} />,
      <Material left={310} top={10} key={"bbb"}  updateState={this.updateState.bind(this)} />
    ]
  }

  render() {
    return (
      <div className="Workflow">
        {this.props.compiledRecipe.title}
        {this.props.compiledRecipe.description}

        {this.renderAction()}
        {this.renderMaterial()}

        {/*<Material left={30} top={20} updateState={this.updateState.bind(this)} />*/}
        {/*this.state.width*/}
        {/*this.state.height*/}
        {/*<Material left={300} top={40} updateState={this.updateState.bind(this)} />*/}
        {/*this.state.width*/}
        {/*this.state.height*/}
        {/* 
        <Material left={5} top={5} updateState={this.updateState.bind(this)} />
        <Material left={5} top={10} updateState={this.updateState.bind(this)} />
        <Action left={500} top={60} updateState={this.updateState.bind(this)} />
        <Action left={510} top={80} updateState={this.updateState.bind(this)} />
        */}
        {/*this.props.recipe.material ? this.props.recipe.material.rice.name : ""*/}

        {util.test3()}
      </div>
    );
  }
}

export default Workflow;
