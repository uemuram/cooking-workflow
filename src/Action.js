import React from 'react';
import './Workflow.css';


class Action extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
    this.state.xxx = {
      aaa: "アクション",
      bbb: "234"
    };
  }



  render() {

    const styleGenerator = (left,top) => ({
      left: left + "px",
      top: top + "px"
    });

    return (
      <div className="Action"
        ref={div => { this.div = div; }}
        style={styleGenerator(this.props.left,this.props.top)}
      >
        {this.state.xxx.aaa}
        <svg>
          <circle cx="100" cy="10" r="20" fill="red" />
          <rect x={this.props.x} y={this.props.y} width="30" height="30" fill="blue" />
        </svg>
      </div>
    );
  }

  componentDidMount() {
    // 要素の横幅と縦幅を取得
    let width = this.div.clientWidth;
    let height = this.div.clientHeight;
    // 親から受け継いだ関数を呼び出し、縦幅横幅を親に渡す
    this.props.updateState(width, height);
  }

}

export default Action;
