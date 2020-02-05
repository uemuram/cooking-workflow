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
    this.setState({ width: width });
    this.setState({ height: height });
  }

  // アクションを描画する
  renderAction() {
    let actions = this.props.compiledRecipe.actions;
    let materials = this.props.compiledRecipe.materials;
    let components = [];

    // 各アクションをコンポーネント化する
    for (let currentActionName in actions) {
      let currentAction = actions[currentActionName];
      components.push(
        <Action key={currentActionName} 
         action={currentAction} material={materials}/>
      );
    }
    return components;
  }

  // アクションをつなぐコネクタを描画する
  renderActionConnector(){
    let connectors = this.props.compiledRecipe.connectors;
    let components = [];

    for(let i=0; i<connectors.length; i++){
      let connector = connectors[i];
      components.push(
        <line x1={connector.from.posX} y1={connector.from.posY} 
              x2={connector.to.posX} y2={connector.to.posY}
              stroke="black" strokeWidth="1" 
              key={connector.from.actionName + "_" + connector.to.actionName} />
      );
    }
    return components;
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

        <svg className="WorkflowSvg">
          {this.renderAction()}
          {this.renderActionConnector()}
          {/* this.renderMaterial() */}
        </svg>

        {util.test3()}
      </div>
    );
  }
}

export default Workflow;
