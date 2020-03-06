import React from 'react';
import './css/Workflow.css';
import Workflow from './Workflow';
import Util from './Util';
import Const from './Const';
const util = new Util();
const c = new Const();

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: "",
      message: "",
      recipeDetail: "",
      recipe: { containers: {}, materials: {}, actions: {} },
      compiledRecipe: {
        containers: {}, materials: {}, actions: {},
        actionConnectors: [], cookObjects: {}, cookObjectConnectors: []
      },
      workFlowSvgStyle: {}
    }

    this.handleChange = this.handleChange.bind(this);

    // バックグラウンドからレシピを取る場合
    // fetch(process.env.REACT_APP_BACKEND_URL + "/api/recipies/beefBowl")
    //   .then(response => response.json())
    //   .then(json => {
    //     this.setState({ recipe: json });
    //     this.setState({ value: JSON.stringify(json, null, 2) });
    //   });

    // 定数値からレシピを取る場合
    let json = c.beefBowlRecipe;
    this.state.recipe = json;
    this.state.value = JSON.stringify(json, null, 2);
  }

  buttonOnClick() {
    console.log("buttonOnClick");
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
    this.setState({ recipeDetail: "" });
    this.setState({ recipe: newRecipe });
    this.setState({ compiledRecipe: newCompiledRecipe });

    // レシピの横幅と縦幅を取得しておく
    let maxWidth = 0, maxHeight;
    for (let actionName in newCompiledRecipe.actions) {
      if (actionName === "start" || actionName === "finish") {
        continue;
      }
      let action = newCompiledRecipe.actions[actionName];
      if (action.drawing.posX + action.drawing.width > maxWidth) {
        maxWidth = action.drawing.posX + action.drawing.width;
      }
    }
    maxHeight = newCompiledRecipe.actions.finish.drawing.posY + newCompiledRecipe.actions.finish.drawing.radius;
    this.setState({ workFlowSvgStyle: { width: maxWidth + 20 + "px", height: maxHeight + 20 + "px" } })
  }

  // テスト用
  buttonOnClick2() {
    // 要素加工のテスト
    let newCompiledRecipe = Object.assign({}, this.state.compiledRecipe);
    newCompiledRecipe.title = "aaa";
    newCompiledRecipe.actions.addOnionToPot.drawing.width += 10;
    newCompiledRecipe.actions.addOnionToPot.drawing.height += 8;
    this.setState({ compiledRecipe: newCompiledRecipe });
  }

  reshapeJson() {
    let recipeStr = JSON.stringify(JSON.parse(this.state.value), null, 2);
    this.setState({ value: recipeStr });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  // アクションの詳細を表示する
  dispActionDetail(e) {
    let actionName = e.currentTarget.getAttribute('data-actionname');
    let action = this.state.compiledRecipe.actions[actionName];
    let detailStr = "";
    detailStr += ("<" + action.title + ">\n");
    detailStr += (action.description + "\n\n");
    detailStr += ("入力 : " + action.sourceCookObject.map(name => this.state.compiledRecipe.cookObjects[name].title).join(",") + "\n");
    detailStr += ("出力 : " + action.targetCookObject.map(name => this.state.compiledRecipe.cookObjects[name].title).join(",") + "\n");
    this.setState({ recipeDetail: detailStr });
  }

  // 調理オブジェクトの詳細を表示する
  dispCookObjectDetail(e) {
    let cookObjectName = e.currentTarget.getAttribute('data-cookobjectname');
    console.log(cookObjectName);
    let cookObject = this.state.compiledRecipe.cookObjects[cookObjectName];
    let detailStr = "";
    detailStr += ("<" + cookObject.title + ">\n");
    detailStr += (cookObject.description + "\n\n");

    if (cookObject.quantity) {
      console.log(cookObject.quantity);
      let quantityList = cookObject.quantity.map(
        quantity => c.wfQuantityUnits[quantity.unit].titlePrefix + quantity.amount +
          c.wfQuantityUnits[quantity.unit].titleSuffix
      ).join("/");
      detailStr += ("分量 : " + quantityList);
    }
    this.setState({ recipeDetail: detailStr });
  }

  render() {
    return (
      <div>
        <header>
          <ul>
            <li>MENU1</li>
            <li>MENU2</li>
            <li>MENU3</li>
            <li>MENU4</li>
          </ul>
        </header>
        <div className="Flex">
          <form>
            <textarea value={this.state.value} onChange={this.handleChange} className="RecipeTextArea" />
            <br />
            <button type="button" onClick={() => this.buttonOnClick()}>レシピフロー表示</button>
            {/*<button type="button" onClick={() => this.buttonOnClick2()}>何らかのボタン2</button>*/}
            <button type="button" onClick={() => this.reshapeJson()}>JSON整形</button>
            <br /><br />
            <textarea readOnly value={this.state.message} className="MessageTextArea" />
            <br />
            <textarea readOnly value={this.state.recipeDetail} className="RecipeDetailTextArea" />
          </form>
          <Workflow recipe={this.state.recipe} compiledRecipe={this.state.compiledRecipe} workFlowSvgStyle={this.state.workFlowSvgStyle}
            dispActionDetail={this.dispActionDetail.bind(this)} dispCookObjectDetail={this.dispCookObjectDetail.bind(this)} />
        </div >
      </div>
    )
  }
}

export default App;
