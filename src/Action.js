import React from 'react';
import './Workflow.css';
import Const from './Const';
const c = new Const();

class Action extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <g>

        <rect x={this.props.action.posX} y={this.props.action.posY}
          width={c.wfActionWidth} height={c.wfActionHeight} 
          stroke="green" fill="white"
          strokeWidth="2" />

        <foreignObject x={this.props.action.posX +2} y={this.props.action.posY}
          width={c.wfActionWidth} height={c.wfActionHeight} >
          <div>{this.props.action.comment}</div>
        </foreignObject>

      </g>
    );
  }
}

export default Action;
