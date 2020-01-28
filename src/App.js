import React from 'react';
import './Workflow.css';
import Workflow from './Workflow';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: "",
      recipe: {}
    }

    this.handleChange = this.handleChange.bind(this);

    fetch(process.env.REACT_APP_BACKEND_URL + "/api/recipies/beefBowl")
      .then(response => response.json())
      .then(json => {
        this.setState({ recipe: json });
        this.setState({ value : JSON.stringify(json, null, 2)});
      });
  }

  renderWorkflow() {
    return <Workflow recipe={this.state.recipe} />
  }

  buttonOnClick() {
    console.log("buttonOnClick!");

    // 要素を加工する。配下にも伝搬する。
    let newRecipe = JSON.parse(this.state.value);
    this.setState({recipe: newRecipe});

    // 要素を加工する。配下にも伝搬する。
    // let newRecipe = Object.assign({}, this.state.recipe);
    // newRecipe.title = newRecipe.title + 'x';
    // this.setState({recipe: newRecipe});

    // 普通のアラートを出す。→クライアントサイドで動いているようだ
    // alert("ok!");

    // 全部消す。配下にも伝搬する。
    //this.setState({recipe:{}});
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <div>
        <div className="Flex">
          <form>
            <textarea value={this.state.value} onChange={this.handleChange} className="RecipeTextArea" />
            <button onClick={() => this.buttonOnClick()}>何らかのボタン</button>
          </form>
          <div>
            {this.renderWorkflow()}
          </div>
        </div >
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

export default App;
