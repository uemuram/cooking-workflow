import React from 'react';
import Workflow from './Workflow';
import Util from './Util';
import Const from './Const';

const util = new Util();
const c = new Const();

class Cooking extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};

    let recipe1 = c.beefBowlRecipe;
    let recipe2 = c.beefBowlRecipe;
    this.state.recipes = [recipe1, recipe2];

    this.state.compiledRecipes = [];

    console.log("a");
    console.log(recipe1);
    console.log("b");
    let compiledRecipe1 = util.compileRecipe(recipe1);
    console.log("c");
    //console.log(compiledRecipe1);
    //this.state.compiledRecipes.push(compiledRecipe1);
    //let compiledRecipe2 = util.compileRecipe(recipe2);
    //this.state.compiledRecipes = [compiledRecipe1,compiledRecipe2];
    //console.log("c");
    //console.log(compiledRecipe1);
    //console.log("d");

  }

  // アクションを描画する
  renderWorkflow() {
    let workflows = [];

    // 各アクションをコンポーネント化する
    for (let i=0; i<this.state.recipes.length;i++) {
      workflows.push(
        <Workflow recipe={this.state.recipes[i]} compiledRecipe={this.state.compiledRecipe[0]} workFlowSvgStyle={this.state.workFlowSvgStyle}
        dispActionDetail={null} dispCookObjectDetail={null} />
      );
    }
    return workflows;
  }

  render() {
    return (
      <div className="Flex">
        <div>
          {/*this.renderWorkflow()*/}
        </div>
        <div>bbb</div>
      </div>
    );
  }
}

export default Cooking;
