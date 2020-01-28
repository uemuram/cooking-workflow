import React from 'react';
import './App.css';
import './Workflow.css';
import Workflow from './Workflow';

class App2 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      aaa: "xxx",
      recipe: {}
    }
    // fetch(process.env.REACT_APP_BACKEND_URL + "/api/courses")
    //   .then(response => response.json())
    //   .then(json =>  this.setState( {aaa : json[0].name}));

    fetch(process.env.REACT_APP_BACKEND_URL + "/api/recipies/beefBowl")
      .then(response => response.json())
      .then(json => this.setState({ recipe: json }));
  }

  renderWorkflow() {
    return <Workflow recipe={this.state.recipe} />
  }

  buttonOnClick() {
    console.log("buttonOnClick!");

    // 要素を加工する。配下にも伝搬する。
    let newRecipe = Object.assign({}, this.state.recipe);
    newRecipe.title = newRecipe.title + 'x';
    this.setState({recipe: newRecipe});

    // 普通のアラートを出す。→クライアントサイドで動いているようだ
    // alert("ok!");

    // 全部消す。配下にも伝搬する。
    //this.setState({recipe:{}});
  }

  render() {
    return (
      <div>
        <button onClick={() => this.buttonOnClick()}>何らかのボタン</button>
        <div>
          {this.renderWorkflow()}
        </div>
        <p>
          __test6 : {this.state.recipe.title}
        </p>
        <p>
          __test7 : {this.state.recipe.description}
        </p>
      </div>
    )
  }
}

export default App2;
