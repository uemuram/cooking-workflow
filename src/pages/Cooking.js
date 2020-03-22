import React from 'react';
import Workflow from '../components/Workflow';
import CookingUtil from '../functions/CookingUtil';
import Const from '../constants/Const';

const cookingUtil = new CookingUtil();
const c = new Const();

class Cooking extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};

    let recipe1 = c.beefBowlRecipe;
    let recipe2 = c.beefBowlRecipe;
    this.state.recipes = [recipe1, recipe2];

    this.state.compiledRecipes = [];
    let compiledRecipe1 = cookingUtil.compileRecipe(recipe1);
    this.state.compiledRecipes.push(compiledRecipe1);
    let compiledRecipe2 = cookingUtil.compileRecipe(recipe2);
    this.state.compiledRecipes = [compiledRecipe1,compiledRecipe2];
  }

  // アクションを描画する
  renderWorkflow() {
    let workflows = [];

    let workFlowSvgStyle = {
      width: "1000px",
      height: "1000px"
    };


    // 各アクションをコンポーネント化する
    for (let i=0; i<this.state.recipes.length;i++) {
      workflows.push(
        <Workflow recipe={this.state.recipes[i]} compiledRecipe={this.state.compiledRecipes[i]} 
        workFlowSvgStyle={workFlowSvgStyle}
        dispActionDetail={null} dispCookObjectDetail={null} key={i}/>
      );
    }
    return workflows;
  }

  render() {
    return (
      <div className="Flex">
        <div>
          {this.renderWorkflow()}
        </div>
        <div>bbb</div>
      </div>
    );
  }
}

export default Cooking;
