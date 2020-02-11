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

    return <g>
      <foreignObject x={drawing.posX - 50 / 2} y={drawing.posY - 50 / 2}
        width={50} height={50} >
        <img src={process.env.PUBLIC_URL + drawing.image} alt="onion" width={50} />;
      </foreignObject>
    </g>
  }

  render() {
    return (
      <g>
        {this.drawCookObject()}
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

export default CookObject;
