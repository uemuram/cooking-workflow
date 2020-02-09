import React from 'react';
import './css/Workflow.css';

class Action extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 描画
  drawAction() {
    let drawing = this.props.action.drawing
    if (drawing.form === "circle") {
      // 円の場合
      return <g>
        <circle cx={drawing.posX} cy={drawing.posY} r={drawing.radius}
          stroke="blue" fill="white" strokeWidth="2" />
      </g>
    } else if (drawing.form === "square") {
      // 矩形の場合
      return <g>
        <rect x={drawing.posX - drawing.width / 2} y={drawing.posY - drawing.height / 2}
          width={drawing.width} height={drawing.height}
          stroke="green" fill="white"
          strokeWidth="2" />

        <foreignObject x={drawing.posX - drawing.width / 2} y={drawing.posY - drawing.height / 2}
          width={drawing.width} height={drawing.height} >
          <div>{this.props.action.title}</div>
        </foreignObject>
      </g>
    }
  }

  render() {
    return (
      <g>
        {this.drawAction()}
      </g>
    );
  }
}

export default Action;
