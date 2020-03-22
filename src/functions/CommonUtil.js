class CommonUtil {
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

    // オブジェクトのディープコピー
    deepCopy(obj) {
        return Object.assign({}, JSON.parse(JSON.stringify(obj)));
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
}
export default CommonUtil;