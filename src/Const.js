class Const {
    constructor() {

        this.imageParentPath = "/image";
        this.containerImagePath = this.imageParentPath + "/container";
        this.materialImagePath = this.imageParentPath + "/material";


        // ワークフロー描画関連設定
        // ワークフロー全体の描画開始位置(左上の座標)
        this.wfPaddingX = 90;
        this.wfPaddingY = 30;

        // ワークフロー全体の描画倍率
        this.wfMagnificationX = 190;
        this.wfMagnificationY = 120;

        // 基本アクションのサイズ
        this.wfActionWidth = 100;
        this.wfActionHeight = 50;

        // 開始、終了アクションの半径
        this.wfActionRadius = 10;

        //調理オブジェクトのサイズ
        this.wfCookObjectWidth = 40;
        this.wfCookObjectHeight = 40;

        // 調理オブジェクトとアクションオブジェクトの距離
        this.wfCookObjectActionDistanceX = 75;
        this.wfCookObjectActionDistanceY = 45;

        // 調理オブジェクトが重なった場合の座標差分倍率
        this.wfOverlapCookObjectMagnificationX = 10;
        this.wfOverlapCookObjectMagnificationY = 4;


        // 標準のコンテナ
        this.wfContainerTypes = {
            "pot": {
                title: "鍋",
                image: "pot.png",
            },
            "riceBowl": {
                title: "どんぶり",
                image: "riceBowl.png",
            },
        }

        // 標準の素材
        this.wfMaterialTypes = {
            "beef": {
                title: "牛肉",
                category: ["meet"],
                image: "beef.png",
            },
            "ginger_tube": {
                title: "チューブ生姜",
                category: ["vegetable", "seasoning"],
                image: "ginger_tube.png",
            },
            "mirin": {
                title: "本みりん",
                category: ["seasoning"],
                image: "mirin.png",
            },
            "onion": {
                title: "玉ねぎ",
                category: ["vegetable"],
                image: "onion.png",
            }
            ,
            "rice": {
                title: "米",
                category: ["grain"],
                image: "rice.png",
            },
            "soySauce": {
                title: "醤油",
                category: ["seasoning"],
                image: "soySauce.png",
            },
            "sugar": {
                title: "砂糖",
                category: ["seasoning"],
                image: "sugar.png",
            },
            "water": {
                title: "水",
                category: [],
                image: "water.png",
            }
        }

    }

}
export default Const;