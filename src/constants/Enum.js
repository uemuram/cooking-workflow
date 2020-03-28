class Enum {
    constructor() {

        // アクションの状態
        this.ActionStatus = {
            'READY' : 0,
            'NOT_READY' : 1,
            'DONE' : 2
        };

        // アクションの選択状態
        this.ActionSelected = {
            'NOT_SELECTED' : 0,
            'SELECTED' : 1
        };


    }
}
export default Enum;