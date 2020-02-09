import React from 'react';
import './css/Workflow.css';


class Material extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 描画
  drawAction() {
    let drawing = this.props.materialObject.drawing

    return <g>
      <circle cx={drawing.posX} cy={drawing.posY} r={20}
        stroke="brown" fill="white" strokeWidth="2" />
    </g>

    // let drawing = this.props.action.drawing
    // if (drawing.form === "circle") {
    //   // 円の場合
    //   return <g>
    //     <circle cx={drawing.posX} cy={drawing.posY} r={drawing.radius}
    //       stroke="blue" fill="white" strokeWidth="2" />
    //   </g>
    // } else if (drawing.form === "square") {
    //   // 矩形の場合
    //   return <g>
    //     <rect x={drawing.posX - drawing.width / 2} y={drawing.posY - drawing.height / 2}
    //       width={drawing.width} height={drawing.height}
    //       stroke="green" fill="white"
    //       strokeWidth="2" />

    //     <foreignObject x={drawing.posX - drawing.width / 2} y={drawing.posY - drawing.height / 2}
    //       width={drawing.width} height={drawing.height} >
    //       <div>{this.props.action.title}</div>
    //     </foreignObject>
    //   </g>
    // }
  }

  // render() {

  //   const styleGenerator = (left,top) => ({
  //     left: left + "px",
  //     top: top + "px"
  //   });

  //   return (
  //     <div className="Material"
  //       ref={div => { this.div = div; }}
  //       style={styleGenerator(this.props.left,this.props.top)}
  //     >
  //       {this.state.xxx.aaa}
  //       <svg>
  //         <circle cx="100" cy="10" r="20" fill="red" />
  //         <rect x={this.props.x} y={this.props.y} width="30" height="30" fill="blue" />
  //       </svg>
  //     </div>
  //   );
  // }

  render() {
    return (
      <g>
        {this.drawAction()}
      </g>
    );
  }

  // componentDidMount() {
  //   // 要素の横幅と縦幅を取得
  //   let width = this.div.clientWidth;
  //   let height = this.div.clientHeight;
  //   // 親から受け継いだ関数を呼び出し、縦幅横幅を親に渡す
  //   this.props.updateState(width, height);
  // }

}

export default Material;
