import React from 'react';
import './css/Workflow.css';


class CookObject extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 描画
  drawCookObject() {
    let drawing = this.props.cookObject.drawing


    if (this.props.cookObject.type === "custom") {
      // カスタムの素材、コンテナの場合
      return <g>
        <rect x={drawing.posX - drawing.width / 2} y={drawing.posY - drawing.height / 2}
          width={drawing.width} height={drawing.height}
          rx={10} ry={10}
          stroke="orange" fill="white"
          strokeWidth="2" />
        <foreignObject x={drawing.posX - drawing.width / 2} y={drawing.posY - drawing.height / 2}
          width={drawing.width} height={drawing.height} >
          <div className="CookObjectText">{this.props.cookObject.title}</div>
        </foreignObject>
      </g>
    } else {
      // 標準の素材、コンテナの場合
      return <g>
        <foreignObject x={drawing.posX - drawing.width / 2} y={drawing.posY - drawing.height / 2}
          width={drawing.width} height={drawing.height} >
          <img src={process.env.PUBLIC_URL + drawing.image} alt={this.props.cookObject.title} width={drawing.width} />;
        </foreignObject>
      </g>
    }
  }

  render() {
    return (
      <g>
        {this.drawCookObject()}
      </g>
    );
  }

}

export default CookObject;
