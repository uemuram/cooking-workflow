import React from 'react';
import './css/Workflow.css';
import Workflow from './Workflow';
import Util from './Util';
const util = new Util();

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: "",
      message: "",
      recipe: { containers: {}, materials: {}, actions: {} },
      compiledRecipe: { containers: {}, materials: {}, actions: {}, connectors: [], materialObjects: {} }
    }

    this.handleChange = this.handleChange.bind(this);

    fetch(process.env.REACT_APP_BACKEND_URL + "/api/recipies/beefBowl")
      .then(response => response.json())
      .then(json => {
        this.setState({ recipe: json });
        this.setState({ value: JSON.stringify(json, null, 2) });
      });
  }

  buttonOnClick() {
    console.log("buttonOnClick!");

    // JSON形式として正しいかのみチェック
    let newRecipe;
    try {
      newRecipe = JSON.parse(this.state.value);
    } catch (e) {
      this.setState({ message: e.message });
      return;
    }

    // レシピをコンパイルする
    let newCompiledRecipe;
    try {
      newCompiledRecipe = util.compileRecipe(newRecipe);
    } catch (e) {
      this.setState({ message: e.message });
      return;
    }

    // コンパイル成功した場合はデータ更新
    console.log(JSON.stringify(newCompiledRecipe, null, 2));
    this.setState({ message: "" });
    this.setState({ recipe: newRecipe });
    this.setState({ compiledRecipe: newCompiledRecipe });
  }

  // テスト用
  buttonOnClick2() {
    console.log("buttonOnClick2!");
    // 要素加工のテスト
    let newCompiledRecipe = Object.assign({}, this.state.compiledRecipe);
    newCompiledRecipe.title = "aaa";
    newCompiledRecipe.actions.addOnionToPot.drawing.width += 10;
    this.setState({ compiledRecipe: newCompiledRecipe });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <div>
        <div className="Flex">
          <form>
            <textarea value={this.state.value} onChange={this.handleChange} className="RecipeTextArea" />
            <br />
            <button type="button" onClick={() => this.buttonOnClick()}>何らかのボタン</button>
            <button type="button" onClick={() => this.buttonOnClick2()}>何らかのボタン2</button>
            <br /><br />
            <textarea readOnly value={this.state.message} className="MessageTextArea" />
          </form>
          <Workflow recipe={this.state.recipe} compiledRecipe={this.state.compiledRecipe} />
        </div >
      </div>
    )
  }
}

export default App;
