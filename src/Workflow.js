import React from 'react';
import './css/App.css';
import './css/Workflow.css';
import CookObject from './CookObject';
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
    let components = [];

    // 各アクションをコンポーネント化する
    for (let currentActionName in actions) {
      let currentAction = actions[currentActionName];
      components.push(
        <Action key={currentActionName} action={currentAction} />
      );
    }
    return components;
  }

  // アクションをつなぐコネクタを描画する
  renderActionConnector() {
    let actions = this.props.compiledRecipe.actions;
    let actionConnectors = this.props.compiledRecipe.actionConnectors;
    let components = [];

    for (let i = 0; i < actionConnectors.length; i++) {
      let actionConnector = actionConnectors[i];
      let fromAction = actions[actionConnector.from.actionName];
      let toAction = actions[actionConnector.to.actionName];

      // コネクタがつなぐオブジェクトの中心座標からの距離を計算
      let fromDistanceY = 0;
      let toDistanceY = 0;
      switch (fromAction.drawing.form) {
        case "circle":
          fromDistanceY = fromAction.drawing.radius;
          break;
        case "square":
          fromDistanceY = fromAction.drawing.height / 2;
          break;
        default:
          break;
      }
      switch (toAction.drawing.form) {
        case "circle":
          toDistanceY = toAction.drawing.radius;
          break;
        case "square":
          toDistanceY = toAction.drawing.height / 2;
          break;
        default:
          break;
      }

      // コネクタを描画
      components.push(
        <line x1={fromAction.drawing.posX} y1={fromAction.drawing.posY + fromDistanceY}
          x2={toAction.drawing.posX} y2={toAction.drawing.posY - toDistanceY}
          stroke="black" strokeWidth="2"
          key={actionConnector.from.actionName + "_" + actionConnector.to.actionName} />
      );
    }
    return components;
  }


  renderCookObject() {
    let cookObjects = this.props.compiledRecipe.cookObjects;
    let components = [];

    // 各アクションをコンポーネント化する
    for (let cookObjectName in cookObjects) {
      let cookObject = cookObjects[cookObjectName];
      components.push(
        <CookObject key={cookObjectName} cookObject={cookObject} />
      );
    }

    return components;
  }

  renderCookObjectConnector() {
    let actions = this.props.compiledRecipe.actions;
    let cookObjects = this.props.compiledRecipe.cookObjects;
    let cookObjectConnectors = this.props.compiledRecipe.cookObjectConnectors;
    let components = [];

    for (let i = 0; i < cookObjectConnectors.length; i++) {
      let cookObjectConnector = cookObjectConnectors[i];
      let fromX, fromY, toX, toY, cpX, cpY;

      if (cookObjectConnector.type === "in") {
        // 調理オブジェクト -> アクション のコネクタ
        let from = cookObjects[cookObjectConnector.from.cookObjectName];
        let to = actions[cookObjectConnector.to.actionName];
        // 始点、終点
        fromX = from.drawing.posX;
        fromY = from.drawing.posY + from.drawing.height / 2;
        toX = to.drawing.posX + to.drawing.width / 2;
        toY = to.drawing.posY - 10;
        // 制御点(ベジェ曲線用)
        cpX = fromX;
        cpY = toY;
      } else {
        // アクション -> 調理オブジェクト のコネクタ
        let from = actions[cookObjectConnector.from.actionName];
        let to = cookObjects[cookObjectConnector.to.cookObjectName];
        // 始点、終点
        fromX = from.drawing.posX + 30;
        fromY = from.drawing.posY + from.drawing.height / 2;
        toX = to.drawing.posX - to.drawing.width / 2;
        toY = to.drawing.posY;
        // 制御点(ベジェ曲線用)
        cpX = fromX;
        cpY = toY;
      }
      // ベジェ曲線描画
      let pathStr = ["M", fromX, fromY, "S", cpX, cpY, toX, toY].join(" ");
      components.push(
        <path d={pathStr} stroke="orangered" fill="transparent" strokeWidth="0.5" key={i} />
      );
    }

    return components;
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
          {this.renderCookObject()}
          {this.renderCookObjectConnector()}
        </svg>

        {util.test3()}
      </div>
    );
  }
}

export default Workflow;
