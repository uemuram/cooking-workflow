class Const {
    constructor() {

        this.imageParentPath = "/image";
        this.containerImagePath = this.imageParentPath + "/container";
        this.materialImagePath = this.imageParentPath + "/material";

        // ワークフローの描画開始位置(左上の座標)
        this.wfPaddingX = 100;
        this.wfPaddingY = 30;

        // ワークフローの描画倍率
        this.wfMagnificationX = 180;
        this.wfMagnificationY = 100;

        // ワークフローの基本Actionのサイズ
        this.wfActionWidth = 100;
        this.wfActionHeight = 50;

        // ワークフローの開始、終了アクションの半径
        this.wfActionRadius = 10;

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