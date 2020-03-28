import React from 'react';
import Workflow from '../components/Workflow';
import Task from '../components/Task';
import CookingUtil from '../functions/CookingUtil';
import Const from '../constants/Const';
import Enum from '../constants/Enum';

const cookingUtil = new CookingUtil();
const c = new Const();
const en = new Enum();

class Cooking extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};

    // レシピの整備(後でタイミングを検討)
    let recipe1 = c.beefBowlRecipe;
    let recipe2 = c.beefBowlRecipe;
    this.state.recipes = [recipe1, recipe2];

    this.state.compiledRecipes = [];
    let compiledRecipe1 = cookingUtil.compileRecipe(recipe1);
    this.state.compiledRecipes.push(compiledRecipe1);
    let compiledRecipe2 = cookingUtil.compileRecipe(recipe2);
    this.state.compiledRecipes = [compiledRecipe1, compiledRecipe2];

    // タスクの整備(後でタイミングを検討)
    let taskList = [];
    taskList.push(compiledRecipe1.actions["cookRice"]);
    taskList.push(compiledRecipe2.actions["cutOnion"]);
    taskList.push(compiledRecipe2.actions["stew2"]);
    taskList.push(compiledRecipe1.actions["makeBroth"]);
    this.state.taskList = taskList;
  }

  selectTask(e) {
    //let actionName = e.currentTarget.getAttribute('data-actionname');
    console.log("selectTask");
  }

  // アクションを描画する
  renderWorkflow() {
    let workflows = [];

    let workFlowSvgStyle = {
      width: "1000px",
      height: "1100px"
    };

    // 各アクションをコンポーネント化する
    for (let i = 0; i < this.state.compiledRecipes.length; i++) {
      let compiledRecipes = this.state.compiledRecipes[i];

      // アクションのステータスを設定
      for (let actionName in compiledRecipes.actions) {
        let action = compiledRecipes.actions[actionName];
        if (action.hierarchy === 1) {
          action.status = en.ActionStatus.READY;
        } else {
          action.status = en.ActionStatus.NOT_READY;
        }
      }

      workflows.push(
        <Workflow recipe={this.state.recipes[i]} compiledRecipe={this.state.compiledRecipes[i]}
          workFlowSvgStyle={workFlowSvgStyle}
          dispActionDetail={null} dispCookObjectDetail={null} key={i} />
      );
    }
    return workflows;
  }

  // タスクを描画する
  renderTask() {
    let Tasks = [];

    for (let i = 0; i < this.state.taskList.length; i++) {
      Tasks.push(
        <Task action={this.state.taskList[i]} selectTask={this.selectTask.bind(this)}
          key={i} />
      )
    }
    return Tasks;
  }

  render() {
    return (
      <div className="Flex">
        <div>
          {this.renderWorkflow()}
        </div>
        <div>
          {this.renderTask()}
        </div>
      </div>
    );
  }
}

export default Cooking;
