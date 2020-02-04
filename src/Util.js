// 定数定義
import Const from './Const';
const c = new Const();

class Util {
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
        let currentAction = recipe.actions[currentActionName];

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
        let currentAction = recipe.actions[currentActionName];

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

    // アクションの終了条件を文章で返す
    // 「xx分」「xxまで」などを想定
    getExitConditionStr(action) {
        let str = "";
        if (action.until && action.until.type === "time") {
            str = action.until.value + "分";
        }
        return str;
    }

    // ソースの一覧を文章で表す
    // limitは列挙の上限を示す。limit=2なら、3個以上のソースは「など」で集約する。
    getSourceStr(action, material, limit) {
        let materialNames = [];
        // 素材の一覧を取得
        for (let i = 0; i < action.source.length; i++) {
            materialNames.push(material[action.source[i]].name);
        }
        return materialNames.length > limit ?
            materialNames.slice(0, limit).join(",") + "など" :
            materialNames.slice(0, limit).join(",")
    }

    // アクションのタイトルを設定する
    setActionTitle(material, container, action) {
        // すでにタイトルがセットされている場合はそちらを優先させる
        if (action.title) {
            return;
        }
        let title = "";
        // アクションのタイプに応じてタイトルを設定
        switch (action.type) {
            case "add":
                title = this.getSourceStr(action, material, 2) + "を" +
                    container[action.target].name + "に加える";
                break;
            case "serve":
                title = "盛り付ける";
                break;
            case "cookRice":
                title = material[action.source].name + "を炊く";
                break;
            case "cut":
                title = material[action.source].name + "を切る";
                break;
            case "stew":
                title = this.getExitConditionStr(action) + "煮込む";
                break;
            case "boil":
                title = this.getExitConditionStr(action) + "茹でる";
                break;
            case "bringToABoil":
                title = "沸騰させる";
                break;
            default:
                break;
        }
        action.title = title;
    }

    compileRecipe(recipe) {

        // 変更対象要素
        let compiledRecipe = Object.assign({}, recipe);
        let actions = compiledRecipe.actions;

        // 追加要素の初期化
        // 開始、終了ノード
        actions.start = { next: [] };
        actions.finish = {};
        // アクション要素のマップ(どのアクションがどこにあるか)
        compiledRecipe.actionMap = [];
        // コネクタ情報
        compiledRecipe.connectors = [];
        let connectors = compiledRecipe.connectors;

        // 全アクション走査、初期設定
        for (let currentActionName in actions) {
            // 今見ているアクション
            let currentAction = actions[currentActionName];

            // 階層、広がりをリセットしておく
            currentAction.hierarchy = null;
            currentAction.spread = null;

            if (currentActionName === "finish") {
                continue;
            }
            // 次アクションが単一の場合は配列にしておく
            if (!this.isArray(currentAction.next)) {
                currentAction.next = [currentAction.next];
            }

            // ソースが単一の場合は配列にしておく
            if (currentAction.source && !this.isArray(currentAction.source)) {
                currentAction.source = [currentAction.source];
            }

            // 各アクションのタイトルをセットする
            this.setActionTitle(compiledRecipe.materials, compiledRecipe.containers, currentAction);

            // 次アクションに対してループ
            for (let i = 0; i < currentAction.next.length; i++) {
                let nextActionName = currentAction.next[i];
                console.log(currentActionName + " -> " + nextActionName);

                let nextAction = actions[nextActionName];

                // 次アクションの実態がない場合はエラー
                if (!nextAction) {
                    console.log("Error : 次アクションなし");
                    continue;
                }

                // コネクタのfrom,toをセット(座標は後でセット)
                compiledRecipe.connectors.push({
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
        for (let currentActionName in actions) {
            if (!actions[currentActionName].prev && currentActionName !== "start") {
                // 開始アクションとのつながり(prev,next)をセット
                actions[currentActionName].prev = ["start"];
                actions.start.next.push(currentActionName);
                // コネクタのfrom,toをセット(座標は後でセット)
                connectors.push({
                    from: { actionName: "start" },
                    to: { actionName: currentActionName }
                });
            }
        };

        // 座標計算
        // Y座標の基準値(階層)を計算
        this.setHierarchy(compiledRecipe, "start", 0);
        // X座標の基準値(広がり)を計算
        let maxHierarchy = this.getObjectPropertyMax(actions, "hierarchy");
        for (let i = 0; i <= maxHierarchy; i++) {
            compiledRecipe.actionMap.push([]);
        }
        this.setSpread(compiledRecipe, "start", 0);
        console.log(compiledRecipe.actionMap);
        // 基準値および広がりから、具体的な座標を計算
        for (let currentActionName in actions) {
            let currentAction = actions[currentActionName];
            currentAction.posX = c.wfPaddingX + currentAction.spread * c.wfMagnificationX;
            currentAction.posY = c.wfPaddingY + currentAction.hierarchy * c.wfMagnificationY;
        };

        // コネクタの座標を計算
        for (let i = 0; i < connectors.length; i++) {
            let connector = connectors[i];
            connector.from.posX = actions[connector.from.actionName].posX + c.wfActionWidth / 2;
            connector.from.posY = actions[connector.from.actionName].posY + c.wfActionHeight;
            connector.to.posX = actions[connector.to.actionName].posX + c.wfActionWidth / 2;
            connector.to.posY = actions[connector.to.actionName].posY;
        }
        return compiledRecipe;
    }
}
export default Util;