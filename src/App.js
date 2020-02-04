import React from 'react';
import './Workflow.css';
import Workflow from './Workflow';
import Util from './Util';
const util = new Util();

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: "",
      recipe: { containers: {}, materials: {}, actions: {} },
      compiledRecipe: { containers: {}, materials: {}, actions: {}, connectors: [] }
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

  renderWorkflow() {
    return <Workflow recipe={this.state.recipe} compiledRecipe={this.state.compiledRecipe} />
  }

  buttonOnClick() {
    console.log("buttonOnClick!");

    // 要素を加工する。配下にも伝搬する。
    let newRecipe = JSON.parse(this.state.value);
    let newCompiledRecipe = util.compileRecipe(newRecipe);

    console.log(JSON.stringify(newCompiledRecipe, null, 2));

    this.setState({ recipe: newRecipe });
    this.setState({ compiledRecipe: newCompiledRecipe });


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
          </form>
          {this.renderWorkflow()}
        </div >
      </div>
    )
  }
}

export default App;
