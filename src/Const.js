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
        this.wfMagnificationX = 205;
        this.wfMagnificationY = 125;

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

        // 調理オブジェクトとアクションオブジェクト用のコネクタの、先頭矢印の設定
        // 斜め面の長さ
        this.wfCookObjectConnectorHeadLength = 9;
        // 矢印の幅広さ(先端の角度)
        this.wfCookObjectConnectorHeadSpread = 0.95;
        // 入力コネクタの角度
        this.wfCookObjectConnectorHeadAngleIn = 0;
        // 出力コネクタの角度
        this.wfCookObjectConnectorHeadAngleOut = 2.75;
        // 矢印の点の座標(in)
        this.wfCookObjectConnectorHeadInX1 = this.wfCookObjectConnectorHeadLength * Math.cos(this.wfCookObjectConnectorHeadAngleIn - this.wfCookObjectConnectorHeadSpread / 2);
        this.wfCookObjectConnectorHeadInY1 = this.wfCookObjectConnectorHeadLength * Math.sin(this.wfCookObjectConnectorHeadAngleIn - this.wfCookObjectConnectorHeadSpread / 2);
        this.wfCookObjectConnectorHeadInX2 = this.wfCookObjectConnectorHeadLength * Math.cos(this.wfCookObjectConnectorHeadAngleIn + this.wfCookObjectConnectorHeadSpread / 2);
        this.wfCookObjectConnectorHeadInY2 = this.wfCookObjectConnectorHeadLength * Math.sin(this.wfCookObjectConnectorHeadAngleIn + this.wfCookObjectConnectorHeadSpread / 2);
        // 矢印の点の座標(out)
        this.wfCookObjectConnectorHeadOutX1 = this.wfCookObjectConnectorHeadLength * Math.cos(this.wfCookObjectConnectorHeadAngleOut - this.wfCookObjectConnectorHeadSpread / 2);
        this.wfCookObjectConnectorHeadOutY1 = this.wfCookObjectConnectorHeadLength * Math.sin(this.wfCookObjectConnectorHeadAngleOut - this.wfCookObjectConnectorHeadSpread / 2);
        this.wfCookObjectConnectorHeadOutX2 = this.wfCookObjectConnectorHeadLength * Math.cos(this.wfCookObjectConnectorHeadAngleOut + this.wfCookObjectConnectorHeadSpread / 2);
        this.wfCookObjectConnectorHeadOutY2 = this.wfCookObjectConnectorHeadLength * Math.sin(this.wfCookObjectConnectorHeadAngleOut + this.wfCookObjectConnectorHeadSpread / 2);

        // 調理オブジェクトが重なった場合の座標差分倍率
        this.wfOverlapCookObjectMagnificationX = 16;
        this.wfOverlapCookObjectMagnificationY = 7;

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

        // 標準の分量単位
        this.wfQuantityUnits = {
            "go": {
                titlePrefix: "",
                titleSuffix: "合"
            },
            "ml": {
                titlePrefix: "",
                titleSuffix: "ml"
            },
            "tbsp": {
                titlePrefix: "大さじ",
                titleSuffix: ""
            },
            "cm": {
                titlePrefix: "",
                titleSuffix: "cm"
            },
            "g": {
                titlePrefix: "",
                titleSuffix: "g"
            },
            "pieces": {
                titlePrefix: "",
                titleSuffix: "個"
            }
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

        // 標準のアクション
        this.wfActionTypes = {
            "custom": {
                content: "カスタム",
                rules: {
                    source: {
                        upperLimit: null,
                        lowerLimit: null,
                        allowMaterial: true,
                        allowContainer: true
                    },
                    target: {
                        upperLimit: 1,
                        lowerLimit: null,
                        allowMaterial: true,
                        allowContainer: true
                    }
                }
            },
            "add": {
                content: "加える",
                rules: {
                    source: {
                        upperLimit: null,
                        lowerLimit: 1,
                        allowMaterial: true,
                        allowContainer: false
                    },
                    target: {
                        upperLimit: 1,
                        lowerLimit: 1,
                        allowMaterial: false,
                        allowContainer: true
                    }
                }
            },
            "boil": {
                content: "茹でる",
                rules: {
                    source: {
                        upperLimit: 1,
                        lowerLimit: 1,
                        allowMaterial: false,
                        allowContainer: true
                    },
                    target: {
                        upperLimit: 0,
                        lowerLimit: 0,
                        allowMaterial: false,
                        allowContainer: false
                    }
                }
            },
            "bringToABoil": {
                content: "沸騰させる",
                rules: {
                    source: {
                        upperLimit: 1,
                        lowerLimit: 1,
                        allowMaterial: false,
                        allowContainer: true
                    },
                    target: {
                        upperLimit: 0,
                        lowerLimit: 0,
                        allowMaterial: false,
                        allowContainer: false
                    }
                }
            },
            "cookRice": {
                content: "炊く",
                rules: {
                    source: {
                        upperLimit: 1,
                        lowerLimit: 1,
                        allowMaterial: true,
                        allowContainer: false
                    },
                    target: {
                        upperLimit: 0,
                        lowerLimit: 0,
                        allowMaterial: true,
                        allowContainer: false
                    }
                }
            },
            "cut": {
                content: "切る",
                rules: {
                    source: {
                        upperLimit: 1,
                        lowerLimit: 1,
                        allowMaterial: true,
                        allowContainer: false
                    },
                    target: {
                        upperLimit: 0,
                        lowerLimit: 0,
                        allowMaterial: false,
                        allowContainer: false
                    }
                }
            },
            "peel": {
                content: "皮をむく",
                rules: {
                    source: {
                        upperLimit: 1,
                        lowerLimit: 1,
                        allowMaterial: true,
                        allowContainer: false
                    },
                    target: {
                        upperLimit: 0,
                        lowerLimit: 0,
                        allowMaterial: false,
                        allowContainer: false
                    }
                }
            },
            "serve": {
                content: "盛り付ける",
                rules: {
                    source: {
                        upperLimit: null,
                        lowerLimit: 1,
                        allowMaterial: true,
                        allowContainer: true
                    },
                    target: {
                        upperLimit: 1,
                        lowerLimit: 1,
                        allowMaterial: false,
                        allowContainer: true
                    }
                }
            },
            "stew": {
                content: "煮込む",
                rules: {
                    source: {
                        upperLimit: 1,
                        lowerLimit: 1,
                        allowMaterial: false,
                        allowContainer: true
                    },
                    target: {
                        upperLimit: 0,
                        lowerLimit: 0,
                        allowMaterial: false,
                        allowContainer: false
                    }
                }
            },
        }

        this.beefBowlRecipe = {
            title: "牛丼",
            description: "薄く切った牛肉とタマネギなどを醤油などで甘辛く煮込み、丼に盛った飯の上に載せた料理",
            containers: {
                pot1: {
                    type: "pot",
                },
                riceBowl1: {
                    type: "riceBowl",
                    description: "一般的などんぶり"
                }
            },
            materials: {
                rice1: {
                    type: "rice",
                    quantity: [
                        {
                            amount: 1,
                            unit: "go"
                        }
                    ]
                },
                water1: {
                    type: "water",
                    quantity: [
                        {
                            amount: 150,
                            unit: "ml"
                        }
                    ]
                },
                sugar1: {
                    type: "sugar",
                    quantity: [
                        {
                            amount: 1,
                            unit: "tbsp"
                        }
                    ]
                },
                soySauce1: {
                    type: "soySauce",
                    description: "一般的なこいくち醤油",
                    quantity: [
                        {
                            amount: 3,
                            unit: "tbsp"
                        }
                    ]
                },
                mirin1: {
                    type: "mirin",
                    quantity: [
                        {
                            amount: 3,
                            unit: "tbsp"
                        }
                    ]
                },
                ginger_tube1: {
                    type: "ginger_tube",
                    quantity: [
                        {
                            amount: 1,
                            unit: "cm"
                        }
                    ]
                },
                beefRib: {
                    title: "牛バラ肉",
                    type: "beef",
                    description: "薄く細切りの牛バラ肉",
                    quantity: [
                        {
                            amount: 200,
                            unit: "g"
                        }
                    ]
                },
                onion1: {
                    type: "onion",
                    quantity: [
                        {
                            amount: 0.5,
                            unit: "pieces"
                        },
                        {
                            amount: 100,
                            unit: "g"
                        }
                    ]
                }

            },
            actions: {
                cookRice: {
                    type: "cookRice",
                    source: "rice1",
                    description: "炊飯器で米を炊く。"
                },
                makeBroth: {
                    title: "煮汁を作る",
                    type: "add",
                    source: [
                        "water1",
                        "sugar1",
                        "soySauce1",
                        "mirin1",
                        "ginger_tube1"
                    ],
                    target: "pot1",
                    description: "各調味料を計量し、鍋に入れる。"
                },
                cutBeefRib: {
                    type: "cut",
                    source: "beefRib",
                    description: "長辺5センチ程度になるようにカットする。大きさを揃えておくと、味の染み込み具合や食感を均一にできる。"
                },
                peelOnion: {
                    type: "peel",
                    source: "onion1",
                    description: "2分割して固いところを切り落とした後、素手で皮をむく。"
                },
                cutOnion: {
                    type: "cut",
                    source: "onion1",
                    description: "繊維と平行に、幅1センチ程度になるようにスライスする。",
                    depend: "peelOnion"
                },
                boil: {
                    type: "bringToABoil",
                    source: "pot1",
                    description: "調味料が入った鍋を強火で沸騰させる。",
                    depend: "makeBroth"
                },
                addBeefRibToPot: {
                    type: "add",
                    source: "beefRib",
                    target: "pot1",
                    description: "中火に変更し、牛肉を加えて解きほぐす。",
                    depend: ["cutBeefRib", "boil"]
                },
                stew1: {
                    type: "stew",
                    source: "pot1",
                    until: {
                        type: "time",
                        value: 5
                    },
                    description: "中火のまま5分間煮込む。灰汁が気になる場合は取り除いておく。",
                    depend: "addBeefRibToPot"
                },
                addOnionToPot: {
                    type: "add",
                    source: "onion1",
                    target: "pot1",
                    description: "玉ねぎを鍋に投入する。",
                    depend: ["cutOnion", "stew1"]
                },
                stew2: {
                    type: "stew",
                    source: "pot1",
                    until: {
                        type: "time",
                        value: 10
                    },
                    description: "弱火に変更して煮込む。玉ねぎの透明度が増し、その後茶色く変色していくことを確認する。",
                    depend: "addOnionToPot"
                },
                serve: {
                    type: "serve",
                    source: [
                        "rice1",
                        "pot1"
                    ],
                    target: "riceBowl1",
                    description: "どんぶりにご飯と具材を盛り付ける。",
                    depend: ["cookRice", "stew2"]
                }
            }
        };
    }

}
export default Const;