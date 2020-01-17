import React from 'react';
import './App.css';
import './Workflow.css';
import Material from './Material';


class Workflow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }

    this.state.flow = {
      aaa: "123",
      bbb: "234"
    };

    this.state.flow2 = {
      title: "牛丼",
      material: {
        sugar: {
          name: "砂糖",
          quantity: [
            {
              amount: 9,
              unit: "g"
            }
          ]
        },
        soySauce: {
          name: "醤油",
          quantity: [
            {
              amount: 45,
              unit: "ml"
            }
          ]
        }
      },
      action: [
        {
          type: "move",
          source: "sugar",
          target: "pot",
          comment: "砂糖を鍋へ"
        },
        {
          type: "move",
          source: "SoySauce",
          target: "pot",
          comment: "醤油を鍋へ"
        },
        {
          type : "boil",
          source : "xx",
          until : {
            type : "condition",
            state : "boiling"
          },
          comment : "沸騰するまで茹でる"
        }
      ]
    };
  }

  updateState(width, height){
    //alert("updatestate " + width + ":" + height);
    this.setState({width: width});
    this.setState({height: height});
  }

  render() {
    return (
      <div className="Workflow">
        あいうえお
        {this.state.flow.bbb}

        <Material left={30} top={60} updateState={this.updateState.bind(this)} />
        {this.state.width}
        {this.state.height}

        <Material left={300} top={100} updateState={this.updateState.bind(this)} />
        {this.state.width}
        {this.state.height}

        かきくけこ
      </div>
    );
  }
}

export default Workflow;
