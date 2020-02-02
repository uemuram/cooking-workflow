// 定数定義
import Const from './Const';
const c = new Const();

class Util {
    test1() {
        return "test1";
    };

    test2() {
        console.log("test2");
    };

    test3() {
        console.log("render!");
    };

    // 配列判定
    isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    // 複数オブジェクト内の指定した要素の最大値を返す
    // parentObj = { aaa : {xx:10 , yy:20} , bbb : {xx:30 , yy:5}} であれば、
    // getObjectPropertyMax(parentObj , "yy") -> 20を返す
    getObjectPropertyMax(parentObj, targetPropertyName) {
        let i = 0;
        let max;
        for (let key in parentObj) {
            // 今見ているオブジェクト
            let obj = parentObj[key];
            if (i === 0 || obj[targetPropertyName] > max) {
                max = obj[targetPropertyName];
            }
            i++;
        }
        return max;
    }

    // 2次元配列を受け取り、指定された箇所より下側に要素があるかどうかを返す
    checkExistUnderArray(array, h, s) {
        for (let i = h + 1; i < array.length; i++) {
            //console.log(array[i][s])
            if (array[i][s]) {
                return true
            };
        }
        return false;
    }

    // 各アクションの階層(縦位置)をセット
    setHierarchy(recipe, currentActionName, currentHierarchy) {
        let currentAction = recipe.action[currentActionName];

        // 既にセットされていたら何もしない(分岐した後の合流を考慮)
        if (currentAction.hierarchy && currentAction.hierarchy >= currentHierarchy) {
            return;
        }
        currentAction.hierarchy = currentHierarchy;
        // 終了アクションであれば終わり
        if (currentActionName === "finish") {
            return;
        }
        // 次アクション全てに対して階層+1で再帰呼び出し
        for (let i = 0; i < currentAction.next.length; i++) {
            let nextActionName = currentAction.next[i];
            this.setHierarchy(recipe, nextActionName, currentHierarchy + 1);
        }
    }



    // 各アクションの広がり(横位置)をセット
    setSpread(recipe, currentActionName, currentSpread) {
        let currentAction = recipe.action[currentActionName];

        // 既にセットされていたら何もしない(分岐した後の合流を考慮)
        if (currentAction.spread != null) {
            return;
        }

        // セット処理
        while (this.checkExistUnderArray(recipe.actionMap, currentAction.hierarchy, currentSpread)) {
            currentSpread++;
        };

        currentAction.spread = currentSpread;
        recipe.actionMap[currentAction.hierarchy][currentSpread] = currentActionName;

        // 終了アクションであれば終わり
        if (currentActionName === "finish") {
            return;
        }

        // 次アクション全てに対して階層+1で再帰呼び出し
        for (let i = 0; i < currentAction.next.length; i++) {
            let nextActionName = currentAction.next[i];
            this.setSpread(recipe, nextActionName, currentSpread);
            currentSpread++;
        }
    }

    compileRecipe(recipe) {
        console.log(recipe.title);
        let compiledRecipe = Object.assign({}, recipe);

        // 追加要素の初期化
        // 開始、終了ノード
        compiledRecipe.action.start = { next: [] };
        compiledRecipe.action.finish = {};
        // アクション要素のマップ(どのアクションがどこにあるか)
        compiledRecipe.actionMap = [];
        // コネクタ情報
        compiledRecipe.connector = [];

        // ひとつ前のアクションへのリンクを各アクションに貼る
        let action = compiledRecipe.action
        for (let currentActionName in action) {
            // 今見ているアクション
            let currentAction = action[currentActionName];

            // 階層、広がりをリセットしておく
            currentAction.hierarchy = null;
            currentAction.spread = null;

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

                let nextAction = action[nextActionName];

                // 次アクションの実態がない場合はエラー
                if (!nextAction) {
                    console.log("Error : 次アクションなし");
                    continue;
                }

                // コネクタのfrom,toをセット(座標は後でセット)
                compiledRecipe.connector.push({
                    from: { actionName: currentActionName },
                    to: { actionName: nextActionName }
                });

                // 手前アクションをセット
                if (!nextAction.prev) {
                    nextAction.prev = [currentActionName];
                } else {
                    nextAction.prev.push(currentActionName);
                }

            }
        }

        // 開始アクションの次のアクションを探す
        for (let currentActionName in action) {
            if (!action[currentActionName].prev && currentActionName !== "start") {
                // 開始アクションとのつながり(prev,next)をセット
                action[currentActionName].prev = ["start"];
                action.start.next.push(currentActionName);
                // コネクタのfrom,toをセット(座標は後でセット)
                compiledRecipe.connector.push({
                    from: { actionName: "start" },
                    to: { actionName: currentActionName }
                });
            }
        };

        // 座標計算
        // Y座標の基準値(階層)を計算
        this.setHierarchy(compiledRecipe, "start", 0);
        // X座標の基準値(広がり)を計算
        let maxHierarchy = this.getObjectPropertyMax(compiledRecipe.action, "hierarchy");
        for (let i = 0; i <= maxHierarchy; i++) {
            compiledRecipe.actionMap.push([]);
        }
        this.setSpread(compiledRecipe, "start", 0);
        console.log(compiledRecipe.actionMap);
        // 基準値および広がりから、具体的な座標を計算
        for (let currentActionName in action) {
            let currentAction = action[currentActionName];
            currentAction.posX = c.wfPaddingX + currentAction.spread * c.wfMagnificationX;
            currentAction.posY = c.wfPaddingY + currentAction.hierarchy * c.wfMagnificationY;
        };

        // コネクタの座標を計算
        for (let i = 0; i < compiledRecipe.connector.length; i++) {
            let connector = compiledRecipe.connector[i];
            connector.from.posX = compiledRecipe.action[connector.from.actionName].posX + c.wfActionWidth / 2;
            connector.from.posY = compiledRecipe.action[connector.from.actionName].posY+ c.wfActionHeight;
            connector.to.posX = compiledRecipe.action[connector.to.actionName].posX+ c.wfActionWidth / 2;
            connector.to.posY = compiledRecipe.action[connector.to.actionName].posY;
        }
        return compiledRecipe;
    }
}
export default Util;