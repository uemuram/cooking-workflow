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

    // 配列判定
    isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    setHierarchy(recipe) {
        console.log("a : " + recipe.title);
        recipe.title = recipe.title + " abc";
    }

    compileRecipe(recipe) {
        console.log(recipe.title);
        let compiledRecipe = Object.assign({}, recipe);

        // 開始、終了ノードを作る
        compiledRecipe.action.start = { next: [] };
        compiledRecipe.action.finish = {};

        // ひとつ前のアクションへのリンクを各アクションに貼る
        let action = compiledRecipe.action
        for (let currentActionName in action) {
            // 今見ているアクション
            let currentAction = action[currentActionName];

            // 階層をリセットしておく
            currentAction.hierarchy = 0;

            if (currentActionName === "finish") {
                continue;
            }
            // 次アクションを配列化
            if (!this.isArray(currentAction.next)) {
                currentAction.next = [currentAction.next];
            }

            // 次アクションに対してループ
            for (let i = 0; i < currentAction.next.length; i++) {
                let nextActionName = currentAction.next[i];
                console.log(currentActionName + " -> " + nextActionName);

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

        // 開始アクションの次のアクションを探す
        for (let currentActionName in action) {
            if (!action[currentActionName].prev && currentActionName !== "start") {
                action[currentActionName].prev = ["start"];
                action.start.next.push(currentActionName);
            }
        };

        this.setHierarchy(compiledRecipe);
        console.log("b : " + compiledRecipe.title);

        return compiledRecipe;
    }
}
export default Util;