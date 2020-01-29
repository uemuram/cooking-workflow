class Util {
    test1() {
        return "test1";
    };

    test2() {
        console.log("test2");
    };

    test3() {
        console.log("test3abcde");
        return "test3xx";
    };

    compileRecipe(recipe) {
        console.log(recipe.title);
        let compiledRecipe = Object.assign({}, recipe);

        // ひとつ前のアクションへのリンクを各アクションに貼る
        let action = compiledRecipe.action
        for (let currentActionName in action) {
            if (action.hasOwnProperty(currentActionName)) {
                let nextActionName = action[currentActionName].next;
                console.log(currentActionName + " -> " + nextActionName);
                // 次のアクションがfinishなら無視
                if (nextActionName === "finish") {
                    continue;
                }
                // 次アクションの実態がない場合はエラー
                if (!action[nextActionName]) {
                    console.log("Error : 次アクションなし");
                    continue;
                }
                // 手前アクションをセット
                if (!action[nextActionName].prev) {
                    action[nextActionName].prev = [currentActionName];
                } else {
                    action[nextActionName].prev.push(currentActionName);
                }
            }
        }
        // 開始アクションを探す
        for (let currentActionName in action) {
            if (action.hasOwnProperty(currentActionName)) {
                if(!action[currentActionName].prev){
                    action[currentActionName].prev = "start";
                }
            }
        };


        return compiledRecipe;
    }
}
export default Util;