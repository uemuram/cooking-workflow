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
    setHierarchy(recipe, actionName, hierarchy) {
        let action = recipe.actions[actionName];

        // 既にセットされていたら何もしない(分岐した後の合流を考慮)
        if (action.hierarchy && action.hierarchy >= hierarchy) {
            return;
        }
        action.hierarchy = hierarchy;
        // 終了アクションであれば終わり
        if (actionName === "finish") {
            return;
        }
        // 次アクション全てに対して階層+1で再帰呼び出し
        for (let i = 0; i < action.next.length; i++) {
            let nextActionName = action.next[i];
            this.setHierarchy(recipe, nextActionName, hierarchy + 1);
        }
    }

    // 各アクションの広がり(横位置)をセット
    setSpread(recipe, actionName, spread) {
        let action = recipe.actions[actionName];

        // 既にセットされていたら何もしない(分岐した後の合流を考慮)
        if (action.spread != null) {
            return;
        }

        // セット処理
        while (this.checkExistUnderArray(recipe.actionMap, action.hierarchy, spread)) {
            spread++;
        };

        action.spread = spread;
        recipe.actionMap[action.hierarchy][spread] = actionName;

        // 終了アクションであれば終わり
        if (actionName === "finish") {
            return;
        }

        // 次アクション全てに対して階層+1で再帰呼び出し
        for (let i = 0; i < action.next.length; i++) {
            let nextActionName = action.next[i];
            this.setSpread(recipe, nextActionName, spread);
            spread++;
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
        let materials = compiledRecipe.materials;
        let containers = compiledRecipe.containers;

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
        for (let actionName in actions) {
            // 今見ているアクション
            let action = actions[actionName];

            // 階層、広がりをリセットしておく
            action.hierarchy = null;
            action.spread = null;

            if (actionName === "finish") {
                continue;
            }
            // 次アクションが単一の場合は配列にしておく
            if (!this.isArray(action.next)) {
                action.next = [action.next];
            }

            // ソースが単一の場合は配列にしておく
            if (action.source && !this.isArray(action.source)) {
                action.source = [action.source];
            }

            // 各アクションのタイトルをセットする
            this.setActionTitle(materials, containers, action);

            // 次アクションに対してループ
            for (let i = 0; i < action.next.length; i++) {
                let nextActionName = action.next[i];
                console.log(actionName + " -> " + nextActionName);

                let nextAction = actions[nextActionName];

                // 次アクションの実態がない場合はエラー
                if (!nextAction) {
                    console.log("Error : 次アクションなし");
                    continue;
                }

                // コネクタのfrom,toをセット(座標は後でセット)
                connectors.push({
                    from: { actionName: actionName },
                    to: { actionName: nextActionName }
                });

                // 手前アクションをセット
                if (!nextAction.prev) {
                    nextAction.prev = [actionName];
                } else {
                    nextAction.prev.push(actionName);
                }
            }
        }

        // 開始アクションの次のアクションを探す
        for (let actionName in actions) {
            if (!actions[actionName].prev && actionName !== "start") {
                // 開始アクションとのつながり(prev,next)をセット
                actions[actionName].prev = ["start"];
                actions.start.next.push(actionName);
                // コネクタのfrom,toをセット(座標は後でセット)
                connectors.push({
                    from: { actionName: "start" },
                    to: { actionName: actionName }
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
        for (let actionName in actions) {
            let action = actions[actionName];
            let drawing = {};

            // 中心座標
            drawing.posX = c.wfPaddingX + action.spread * c.wfMagnificationX;
            drawing.posY = c.wfPaddingY + action.hierarchy * c.wfMagnificationY;

            // アクション種別に応じた形状設定
            if (actionName === "start" || actionName === "finish") {
                // 開始、終了アクションの場合は丸
                drawing.form = "circle";
                // 半径
                drawing.radius = c.wfActionRadius;
            } else {
                // それ以外は四角
                drawing.form = "square";
                // 大きさ
                drawing.width = c.wfActionWidth;
                drawing.height = c.wfActionHeight;
            }
            action.drawing = drawing;
        };

        // コネクタの座標を計算
        for (let i = 0; i < connectors.length; i++) {
            let connector = connectors[i];
            let fromAction = actions[connector.from.actionName];
            let toAction = actions[connector.to.actionName];

            // コネクタがつなぐオブジェクトの中心座標からの距離を計算
            let fromDistanceY = 0;
            let toDistanceY = 0;
            switch (fromAction.drawing.form) {
                case "circle":
                    fromDistanceY = fromAction.drawing.radius;
                    break;
                case "square":
                    fromDistanceY = fromAction.drawing.height / 2;
                    break;
                default:
                    break;
            }

            switch (toAction.drawing.form) {
                case "circle":
                    toDistanceY = toAction.drawing.radius;
                    break;
                case "square":
                    toDistanceY = toAction.drawing.height / 2;
                    break;
                default:
                    break;
            }
            connector.from.posX = fromAction.drawing.posX;
            connector.from.posY = fromAction.drawing.posY + fromDistanceY;
            connector.to.posX = toAction.drawing.posX;
            connector.to.posY = toAction.drawing.posY - toDistanceY;
        }
        return compiledRecipe;
    }
}
export default Util;