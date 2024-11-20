/**
* TDD 测试工具
*/

/**-------------------------- 打印系列工具 ------------------------------*/
/**
 * 打印数组中的元素
 * @param arr 要打印的数组
 */
function printArrayElements(arr) {
    arr.forEach((element, index) => {
        if (typeof element === 'object' && element !== null) {
            console.log(`Element at index ${index}:`, JSON.stringify(element));
        } else {
            console.log(`Element at index ${index}:`, element);
        }
    });
}
/**
 * 对象元素打印
 * @param obj 要打印的对象
 * @param indent 打印之后的元素分隔符
 */
function printObjectElements(obj, indent = '') {
    // 使用for...in循环遍历对象的每个属性
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            // 检查属性值的数据类型
            if (typeof value === 'object' && value !== null) {
                // 如果是数组，打印数组信息
                if (Array.isArray(value)) {
                    console.log(indent + `${key}: [`);
                    value.forEach((item, index) => {
                        if (typeof item === 'object' && item !== null) {
                            console.log(indent + `  ${index}: {`);
                            printObjectElements(item, indent + '    '); // 递归打印对象
                            console.log(indent + `  },`);
                        } else {
                            console.log(indent + `  ${index}:${item},`);
                        }
                    });
                    console.log(indent + `],`);
                } else {
                    // 如果是普通对象，打印对象信息
                    console.log(indent + `${key}: {`);
                    printObjectElements(value, indent + '  '); // 递归打印对象
                    console.log(indent + `},`);
                }
            } else {
                // 如果是基本类型，直接打印
                console.log(indent + `${key}:${value},`);
            }
        }
    }
}

/**-------------------------- 生成模拟数据工具 ------------------------------*/

