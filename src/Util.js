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

    // オブジェクト判定
    isKeyValueObj(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }

    // 配列でなければ配列化して返す
    convertArray(obj) {
        if (!obj) {
            return [];
        }
        else if (this.isArray(obj)) {
            return obj;
        } else {
            return [obj];
        }
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
            materialNames.push(material[action.source[i]].title);
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
                    container[action.target].title + "に加える";
                break;
            case "boil":
                title = this.getExitConditionStr(action) + "茹でる";
                break;
            case "bringToABoil":
                title = "沸騰させる";
                break;
            case "cookRice":
                title = material[action.source].title + "を炊く";
                break;
            case "cut":
                title = material[action.source].title + "を切る";
                break;
            case "peel":
                title = material[action.source].title + "の皮をむく";
                break;
            case "serve":
                title = container[action.target].title + "に盛り付ける";
                break;

            case "stew":
                title = this.getExitConditionStr(action) + "煮込む";
                break;
            default:
                break;
        }
        action.title = title;
    }

    // レシピのアクション部分をコンパイルする
    compileRecipeActions(compiledRecipe) {
        // 要素
        let actions = compiledRecipe.actions;
        let materials = compiledRecipe.materials;
        let containers = compiledRecipe.containers;

        // 追加要素の初期化(アクション関連)
        // 開始、終了ノード
        actions.start = { next: [] };
        actions.finish = { depend: [] };
        // アクション要素のマップ(どのアクションがどこにあるか)
        compiledRecipe.actionMap = [];
        // コネクタ情報
        compiledRecipe.actionConnectors = [];
        let actionConnectors = compiledRecipe.actionConnectors;

        // 全アクション走査、初期設定
        for (let actionName in actions) {
            // 今見ているアクション
            let action = actions[actionName];

            // 階層、広がりをリセットしておく
            action.hierarchy = null;
            action.spread = null;

            if (actionName === "start") {
                continue;
            }

            // 手前アクションがない場合は開始アクションに依存させておく
            if (!action.depend) {
                action.depend = ["start"];
            }
            // 次アクションが単一の場合は配列にしておく
            if (!this.isArray(action.depend)) {
                action.depend = [action.depend];
            }

            // ソースが単一の場合は配列にしておく
            if (action.source && !this.isArray(action.source)) {
                action.source = [action.source];
            }

            // 説明がない場合は空文字を入れておく
            if (!action.description) {
                action.description = "";
            }

            // 各アクションのタイトルをセットする
            this.setActionTitle(materials, containers, action);

            // 手前アクションに対してループ
            for (let i = 0; i < action.depend.length; i++) {
                let dependActionName = action.depend[i];
                // if (!dependActionName) {
                //     dependActionName = "start";
                // }
                console.log(dependActionName + " -> " + actionName);
                let dependAction = actions[dependActionName];

                // 次アクションの実態がない場合はエラー
                if (!dependAction) {
                    console.log("Error : 手前アクションなし");
                    continue;
                }

                // コネクタのfrom,toをセット(座標は後でセット)
                actionConnectors.push({
                    from: { actionName: dependActionName },
                    to: { actionName: actionName }
                });

                // 次アクションをセット
                if (!dependAction.next) {
                    dependAction.next = [actionName];
                } else {
                    dependAction.next.push(actionName);
                }
            }
        }

        // 終了アクションの手前アクションを探す
        for (let actionName in actions) {
            if (!actions[actionName].next && actionName !== "finish") {
                actions[actionName].next = ["finish"];
                actions.finish.depend.push(actionName);
                // コネクタのfrom,toをセット(座標は後でセット)
                actionConnectors.push({
                    from: { actionName: actionName },
                    to: { actionName: "finish" }
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
    }

    // レシピの調理オブジェクト(素材,コンテナをまとめた調理対象オブジェクト)をコンパイルする
    compileRecipeCookObjects(compiledRecipe) {
        // 要素
        let actions = compiledRecipe.actions;
        let materials = compiledRecipe.materials;
        let containers = compiledRecipe.containers;

        // 調理オブジェクト
        compiledRecipe.cookObjects = {};
        let cookObjects = compiledRecipe.cookObjects;

        // アクション名ごとに、紐づいた素材の数をカウントしておく
        let actionSourceMaterialCount = {};

        // アクションのsource,targetから、素材の実体を生成する。
        for (let actionName in actions) {
            if (actionName === "start" || actionName === "finish") {
                continue;
            }

            // 後で使うため初期化
            actionSourceMaterialCount[actionName] = 0;

            let action = actions[actionName];
            // アクションからみてsourceとなっている素材
            if (action.source) {
                for (let i = 0; i < action.source.length; i++) {
                    cookObjects[action.source[i] + "_to_" + actionName] = {
                        keyName: action.source[i],
                        toAction: [actionName]
                    };
                }
            };
            // アクションから見てtargetとなっている素材
            if (action.target) {
                cookObjects[action.target + "_from_" + actionName] = {
                    keyName: action.target,
                    fromAction: [actionName]
                };
            } else if (action.source && action.source.length === 1) {
                // ターゲットとなる素材がない場合は、ソースをそのままターゲットにする
                cookObjects[action.source[0] + "_from_" + actionName] = {
                    keyName: action.source[0],
                    fromAction: [actionName]
                };
            };
        }

        // 素材を集約する(同一の調理オブジェクトを1つにまとめる)
        // 配列の削除が含まれるので後ろからループ
        for (let cookObjectName in cookObjects) {
            let cookObject = cookObjects[cookObjectName];
            // アクションへのインプットになっているもののみを操作対象とする
            if (!cookObject.toAction) {
                continue;
            }
            // 上位のアクション全てに対してマージ処理
            for (let j = 0; j < actions[cookObject.toAction[0]].depend.length; j++) {
                this.margeCookObjects(cookObjects, cookObjectName, cookObject.keyName, actions[cookObject.toAction[0]].depend[j], actions);
            }
        }

        // 集約した調理オブジェクトの情報を、アクション側にも記録しておく
        for (let cookObjectName in cookObjects) {
            let cookObject = cookObjects[cookObjectName];
            if (cookObject.toAction) {
                for (let i = 0; i < cookObject.toAction.length; i++) {
                    let action = actions[cookObject.toAction[i]];
                    if (!action.sourceCookObject) {
                        action.sourceCookObject = [];
                    }
                    action.sourceCookObject.push(cookObjectName);
                }
            }
            if (cookObject.fromAction) {
                for (let i = 0; i < cookObject.fromAction.length; i++) {
                    let action = actions[cookObject.fromAction[i]];
                    if (!action.targetCookObject) {
                        action.targetCookObject = [];
                    }
                    action.targetCookObject.push(cookObjectName);
                }
            }
        }

        // 各素材の描画情報を整備する
        for (let cookObjectName in cookObjects) {
            let drawing = {};
            let cookObject = cookObjects[cookObjectName];
            // 座標計算
            // 素材が重なっている場合はfrom優先
            if (cookObject.fromAction) {
                let nearAction = cookObject.fromAction;
                drawing.posX = actions[nearAction].drawing.posX + c.wfCookObjectActionDistanceX;
                drawing.posY = actions[nearAction].drawing.posY + c.wfCookObjectActionDistanceY;
            } else {
                let nearAction = cookObject.toAction[0];
                // 1つのアクションに複数調理オブジェクトが入力となる場合は、少し座標をずらす
                drawing.posX = actions[nearAction].drawing.posX + c.wfCookObjectActionDistanceX + actionSourceMaterialCount[nearAction] * c.wfOverlapCookObjectMagnificationX;
                drawing.posY = actions[nearAction].drawing.posY - c.wfCookObjectActionDistanceY + actionSourceMaterialCount[nearAction] * c.wfOverlapCookObjectMagnificationY;
                actionSourceMaterialCount[nearAction]++;
            }

            // 画像等セット
            if (materials[cookObject.keyName]) {
                let material = materials[cookObject.keyName];
                cookObject.type = material.type;
                cookObject.title = material.title;
                if (cookObject.type !== "custom") {
                    drawing.image = c.materialImagePath + "/" + c.wfMaterialTypes[material.type].image;
                }
            } else {
                let container = containers[cookObject.keyName];
                cookObject.type = container.type;
                cookObject.title = container.title;
                if (cookObject.type !== "custom") {
                    drawing.image = c.containerImagePath + "/" + c.wfContainerTypes[container.type].image;
                }
            }

            // サイズセット
            drawing.width = c.wfCookObjectWidth;
            drawing.height = c.wfCookObjectHeight;
            cookObject.drawing = drawing;
        }
    }

    // 入出力で重複している調理オブジェクトを1つにまとめる
    margeCookObjects(cookObjects, cookObjectName, keyName, actionName, actions) {
        // 最初なら何もしない
        if (actionName === "start") {
            return;
        }
        // 対象アクションへの入力となる同一調理オブジェクトがあるかチェック
        if (cookObjects[keyName + "_from_" + actionName]) {
            // マージする
            if (!cookObjects[keyName + "_from_" + actionName].toAction) {
                cookObjects[keyName + "_from_" + actionName].toAction = [cookObjects[cookObjectName].toAction[0]];
            } else {
                cookObjects[keyName + "_from_" + actionName].push(cookObjects[cookObjectName].toAction[0]);
            }
            delete cookObjects[cookObjectName];
            return;
        }
        // 指定されたアクションより上を全て走査する。
        for (let i = 0; i < actions[actionName].depend.length; i++) {
            this.margeCookObjects(cookObjects, cookObjectName, keyName, actions[actionName].depend[i], actions);
        }
    }

    // レシピの調理オブジェクトとアクションをつなぐコネクタをコンパイルする
    compileRecipeCookObjectsConnector(compiledRecipe) {
        compiledRecipe.cookObjectConnectors = [];
        let cookObjectConnectors = compiledRecipe.cookObjectConnectors;
        let cookObjects = compiledRecipe.cookObjects;

        // 調理オブジェクトを走査してコネクタを生成
        for (let cookObjectName in cookObjects) {
            let cookObject = cookObjects[cookObjectName];
            // アクションへの入力コネクタ
            if (cookObject.toAction) {
                for (let i = 0; i < cookObject.toAction.length; i++) {
                    let actionName = cookObject.toAction[i];
                    console.log(cookObjectName + " -> " + actionName);
                    let cookObjectConnector = {
                        type: "in",
                        from: {
                            cookObjectName: cookObjectName
                        },
                        to: {
                            actionName: actionName
                        }
                    };
                    cookObjectConnectors.push(cookObjectConnector);
                }
            }
            // アクションからの出力コネクタ
            if (cookObject.fromAction) {
                for (let i = 0; i < cookObject.fromAction.length; i++) {
                    let actionName = cookObject.fromAction[i];
                    console.log(actionName + " -> " + cookObjectName);
                    let cookObjectConnector = {
                        type: "out",
                        from: {
                            actionName: actionName
                        },
                        to: {
                            cookObjectName: cookObjectName
                        }
                    };
                    cookObjectConnectors.push(cookObjectConnector);
                }
            }
        }
    }

    // 各コンテナの名前をセットする
    setContainerTitle(containers) {
        for (let containerNames in containers) {
            let container = containers[containerNames];
            if (!container.title) {
                container.title = c.wfContainerTypes[container.type].title;
            }
        }
    }

    // 各素材の名前をセットする
    setMaterialTitle(materials) {
        for (let materialName in materials) {
            let material = materials[materialName];
            if (!material.title) {
                material.title = c.wfMaterialTypes[material.type].title;
            }
        }
    }

    // 文法エラーオブジェクトを返却
    getSyntaxErrorObj(targetStr, messageStr) {
        return new SyntaxError(targetStr + " : " + messageStr);
    }

    // 文法チェック(必須チェック等)
    checkRecipeGrammar(recipe) {
        // 第1階層必須チェック、型チェック
        if (!recipe.title) {
            throw this.getSyntaxErrorObj("title", "title要素は必須です。");
        };
        if (typeof recipe.title !== "string") {
            throw this.getSyntaxErrorObj("title", "title要素は文字列型の必要があります。");
        };
        if (!recipe.containers) {
            throw this.getSyntaxErrorObj("containers", "containers要素は必須です。");
        };
        if (!this.isKeyValueObj(recipe.containers)) {
            throw this.getSyntaxErrorObj("containers", "containers要素はオブジェクト({})型の必要があります。");
        };
        if (!recipe.materials) {
            throw this.getSyntaxErrorObj("materials", "materials要素は必須です。");
        };
        if (!this.isKeyValueObj(recipe.materials)) {
            throw this.getSyntaxErrorObj("materials", "materials要素はオブジェクト({})型の必要があります。");
        };
        if (!recipe.actions) {
            throw this.getSyntaxErrorObj("actions", "actions要素は必須です。");
        };
        if (!this.isKeyValueObj(recipe.actions)) {
            throw this.getSyntaxErrorObj("actions", "actions要素はオブジェクト({})型の必要があります。");
        };

        // コンテナ必須チェック
        for (let containerName in recipe.containers) {
            let container = recipe.containers[containerName];
            if (!container.type) {
                throw this.getSyntaxErrorObj(containerName, "type要素は必須です。");
            }
            if (container.type !== "custom" && !c.wfContainerTypes[container.type]) {
                throw this.getSyntaxErrorObj(containerName, "コンテナタイプ「" + container.type + "」は存在しません。存在するコンテナタイプ、もしくは「custom」を指定してください。");
            }
            if (container.type === "custom" && !container.title) {
                throw this.getSyntaxErrorObj(containerName, "コンテナタイプが「custom」の場合、title要素は必須です。");
            }
        }

        // 素材必須チェック
        for (let materialName in recipe.materials) {
            let material = recipe.materials[materialName];
            if (!material.type) {
                throw this.getSyntaxErrorObj(materialName, "type要素は必須です。");
            }
            if (material.type !== "custom" && !c.wfMaterialTypes[material.type]) {
                throw this.getSyntaxErrorObj(materialName, "素材タイプ「" + material.type + "」は存在しません。存在する素材タイプ、もしくは「custom」を指定してください。");
            }
            if (material.type === "custom" && !material.title) {
                throw this.getSyntaxErrorObj(materialName, "素材タイプが「custom」の場合、title要素は必須です。");
            }
        }

        // 素材名とコンテナ名の重複チェック
        for (let containerName in recipe.containers) {
            for (let materialName in recipe.materials) {
                if (containerName === materialName) {
                    throw this.getSyntaxErrorObj(containerName, "素材とコンテナの名称が重複しています");
                }
            }
        }

        // アクションチェック
        if (Object.keys(recipe.actions).length === 0) {
            throw this.getSyntaxErrorObj("actions", "1件以上のaction要素が必要です。");
        };
        for (let actionName in recipe.actions) {
            let action = recipe.actions[actionName];
            if (!action.type) {
                throw this.getSyntaxErrorObj(actionName, "type属性が必要です。");
            }
            // 存在チェック
            if (!c.wfActionTypes[action.type]) {
                throw this.getSyntaxErrorObj(actionName, "アクションタイプ「" + action.type + "」は存在しません。存在するアクションタイプ、もしくは「custom」を指定してください。");
            }
            if (action.type === "custom" && !action.title) {
                throw this.getSyntaxErrorObj(actionName, "アクションタイプが「custom」の場合、title要素は必須です。");
            }
            // 依存関係チェック
            let depend = this.convertArray(action.depend);
            for (let i = 0; i < depend.length; i++) {
                if (!recipe.actions[depend[i]]) {
                    throw this.getSyntaxErrorObj(actionName, "依存関係「" + depend[i] + "」は存在しません。");
                }
            }
            this.sourceTargetCheck(actionName, action, recipe, "source");
            this.sourceTargetCheck(actionName, action, recipe, "target");
        }
    }

    // Actionのsource,target属性のチェック
    sourceTargetCheck(actionName, action, recipe, attributeName) {
        let rule;
        let materialCount, containerCount;
        // ソースチェック
        materialCount = 0;
        containerCount = 0;
        rule = c.wfActionTypes[action.type].rules[attributeName];
        let cookObject = this.convertArray(action[attributeName]);
        for (let i = 0; i < cookObject.length; i++) {
            if (recipe.materials[cookObject[i]]) {
                materialCount++;
            } else if (recipe.containers[cookObject[i]]) {
                containerCount++;
            } else {
                throw this.getSyntaxErrorObj(actionName, attributeName + "属性「" + cookObject[i] + "」が、containersまたはmaterialsで定義されていません。");
            }
        }
        if (!rule.allowMaterial && materialCount > 0) {
            throw this.getSyntaxErrorObj(actionName, "アクションタイプ「" + action.type + "」では、" + attributeName + "属性としてmaterialsは許可されません。");
        }
        if (!rule.allowContainer && containerCount > 0) {
            throw this.getSyntaxErrorObj(actionName, "アクションタイプ「" + action.type + "」では、" + attributeName + "属性としてcontainersは許可されません。");
        }
        if (rule.upperLimit !== null && materialCount + containerCount > rule.upperLimit) {
            throw this.getSyntaxErrorObj(actionName, "アクションタイプ「" + action.type + "」では、" + attributeName + "を" + rule.upperLimit + "件以下にする必要があります。");
        }
        if (rule.lowerLimit !== null && materialCount + containerCount < rule.lowerLimit) {
            throw this.getSyntaxErrorObj(actionName, "アクションタイプ「" + action.type + "」では、" + attributeName + "を" + rule.lowerLimit + "件以上にする必要があります。");
        }
    }

    // アクションがループしていないかチェック
    checkRecipeActrionLoop(compiledRecipe) {
        let actions = compiledRecipe.actions;
        // 開始、終了アクションが見つけられない場合
        if (actions.start.next.length === 0) {
            throw this.getSyntaxErrorObj("actions", "アクションの開始地点が見つかりません。依存関係がループしている可能性があります。");
        }
        if (actions.finish.depend.length === 0) {
            throw this.getSyntaxErrorObj("actions", "アクションの終了地点が見つかりません。依存関係がループしている可能性があります。");
        }
        let actionNameList = Object.keys(actions);
        // ループチェック
        this.loopCheck("start", actions, [], actionNameList)
        // startから全経路探索して、一度も通らなかったルートがあった場合、ループがある可能性あり
        if (actionNameList.length > 0) {
            throw this.getSyntaxErrorObj("actions", "成立しない経路があります。依存関係がループしている可能性があります。("
                + actionNameList.join(",") + ")"
            );
        }
    }

    // アクションのループチェックの実体
    loopCheck(actionName, actions, actionHistory, actionNameList) {
        // 一度通過したアクションをリストから消していく
        let index = actionNameList.indexOf(actionName);
        if (index >= 0) {
            actionNameList.splice(index, 1);
        }
        // 終了条件
        if (actionName === "finish") {
            return;
        }
        //現アクションが履歴の中にあれば、アクションが再登場としたと判断してエラー
        if (actionHistory.indexOf(actionName) >= 0) {
            throw this.getSyntaxErrorObj("actions", "アクションの依存関係がループしています。("
                + actionHistory.join("->") + "->" + actionName + ")");
        }
        // アクションの履歴をディープコピーし、現アクションを追加
        const nextActionHistory = actionHistory.concat();
        nextActionHistory.push(actionName);
        // 次アクションを順次呼び出す
        let action = actions[actionName];
        for (let i = 0; i < action.next.length; i++) {
            let nextActionName = action.next[i];
            this.loopCheck(nextActionName, actions, nextActionHistory, actionNameList);
        }
    }

    // レシピをコンパイルする
    compileRecipe(recipe) {
        // コンパイル済みレシピを生成
        let compiledRecipe = Object.assign({}, recipe);
        try {
            // 文法チェック
            this.checkRecipeGrammar(recipe);

            // コンテナの名前をセット
            this.setContainerTitle(compiledRecipe.containers);
            // 素材の名前をセット
            this.setMaterialTitle(compiledRecipe.materials);
            // アクション関連のコンパイル
            this.compileRecipeActions(compiledRecipe);

            // ループチェック
            this.checkRecipeActrionLoop(compiledRecipe)

            // 素材・コンテナ関連のコンパイル
            this.compileRecipeCookObjects(compiledRecipe);
            // 調理オブジェクトのコネクタのコンパイル
            this.compileRecipeCookObjectsConnector(compiledRecipe);
        } catch (e) {
            console.log(compiledRecipe);
            console.log(e);
            throw (e);
        }
        return compiledRecipe;
    }
}
export default Util;