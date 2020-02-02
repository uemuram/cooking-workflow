import React from 'react';
import './App.css';
import './Workflow.css';
import Material from './Material';
import Action from './Action';
import Util from './Util';
// ユーティリティ
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

  // アクションを表示用に整備し、コンポーネント化する
  renderAction() {
    let action = this.props.compiledRecipe.action;
    let components = [];

    let x = 10;

    // 各アクションをコンポーネント化する
    for (let currentActionName in action) {
      let currentAction = action[currentActionName];
      components.push(
        <Action left={50 + x} top={40 + x} key={currentActionName} 
         action={currentAction} updateState={this.updateState.bind(this)} />
      );
      x += 30;
    }
    
    return components;
  }

  // アクションをつなぐコネクタを描画する
  renderActionConnector(){
    return <svg><circle cx="100" cy="10" r="20" fill="red" /></svg>
  }


  renderMaterial() {
    return [
      <Material left={300} top={5} key={"aaa"} updateState={this.updateState.bind(this)} />,
      <Material left={310} top={10} key={"bbb"} updateState={this.updateState.bind(this)} />
    ]
  }


  render() {
    return (
      <div className="Workflow">
        {this.props.compiledRecipe.title}
        <br />
        {this.props.compiledRecipe.description}

        {this.renderAction()}
        {this.renderActionConnector()}
        {/* this.renderMaterial() */}



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
