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
    // const styleGenerator = (left,top) => ({
    //   left: left + "px",
    //   top: top + "px",
    //   width: c.wfActionWidth + "px",
    //   height: c.wfActionHeight + "px"
    // });

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

    // return (
    //   <div className="Action"
    //     ref={div => { this.div = div; }}
    //     style={styleGenerator(this.props.action.posX,this.props.action.posY)}
    //   >
    //     {this.props.action.comment}        
    //     {/*
    //     <svg>
    //       <circle cx="100" cy="10" r="20" fill="red" />
    //       <rect x={this.props.x} y={this.props.y} width="30" height="30" fill="blue" />
    //     </svg>
    //     */}
    //   </div>
    // );


  }

  // componentDidMount() {
  //   // 要素の横幅と縦幅を取得
  //   let width = this.div.clientWidth;
  //   let height = this.div.clientHeight;
  //   // 親から受け継いだ関数を呼び出し、縦幅横幅を親に渡す
  //   this.props.updateState(width, height);
  // }

}

export default Action;
