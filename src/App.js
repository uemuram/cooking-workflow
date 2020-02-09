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
      recipe: { containers: {}, materials: {}, actions: {} },
      compiledRecipe: { containers: {}, materials: {}, actions: {}, connectors: [], materialObjects: {} }
    }

    this.handleChange = this.handleChange.bind(this);

    /*
        let json = {
          title: "xx料理",
          description: "yyをzzした料理です",
          containers: {},
          materials: {},
          actions: {
            a: {
              next: "c"
            },
            b: {
              next: [
                "d"
              ]
            },
            c: {
              next: ["e", "f"]
            },
            d: {
              next: [
                "g"
              ]
            },
            e: {
              next: "j"
            },
            f: {
              next: ["h", "i"]
            },
            g: {
              next: [
                "finish"
              ]
            },
            h: {
              next: "j"
            },
            i: {
              next: "k"
            },
            j: {
              next: "k"
            },
            k: {
              next: "finish"
            }
          }
        };
        this.state.recipe = json;
        this.state.value = JSON.stringify(json, null, 2);
    */

    fetch(process.env.REACT_APP_BACKEND_URL + "/api/recipies/beefBowl")
      .then(response => response.json())
      .then(json => {
        this.setState({ recipe: json });
        this.setState({ value: JSON.stringify(json, null, 2) });
      });
  }

  buttonOnClick() {
    console.log("buttonOnClick!");

    // 要素を加工する。配下にも伝搬する。
    let newRecipe = JSON.parse(this.state.value);
    let newCompiledRecipe = util.compileRecipe(newRecipe);

    console.log(JSON.stringify(newCompiledRecipe, null, 2));

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
          </form>
          <Workflow recipe={this.state.recipe} compiledRecipe={this.state.compiledRecipe} />
        </div >
      </div>
    )
  }
}

export default App;
