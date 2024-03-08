// 触发更新视图
// 将要触发更新的具体位置的函数集合
let watchers = new Set();

// 遍历更新
function updateView() {
    console.log("循环遍历更新数据监听！");
    for (let watcher in watchers) {
        watcher();
    }
}

// 传入一个读取函数，通过 defineProperty 把函数添加到 watchers 里
function addWatcher(fn) {
    window.__watcher = fn;
    // 第一次读取
    fn();
    window.__watcher = null;
}


/**
 * 定义响应式主体方法
 */
function reactive(target = {}) {
    // 不是对象或者数组，直接返回
    if (typeof target !== "object" || target === null) {
        return target;
    }

    // proxy 的代理配置，单独拿出来写
    const proxyConf = {
        get(target, key, receiver) {
            // 只处理本身（非原型）的属性
            const ownKeys = Reflect.ownKeys(target);
            // 监听
            if (ownKeys.includes(key)) {
                console.log("get: ", key);
            }

            const result = Reflect.get(target, key, receiver);
            // 第一次读取的时候进行依赖的埋入
            if (window.__watcher) {
                console.log("依赖埋入：", window.__watcher);
                watchers.add(window.__watcher);
            }
            // 深度监听，为了让性能更好，使用递归处理
            return reactive(result);
        },
        set(target, key, val, receiver) {
            // 重复的数据，不处理
            if (val === target[key]) {
                return true;
            }

            const ownKeys = Reflect.ownKeys(target);
            if (ownKeys.includes(key)) {
                console.log("已有的 key: ", key);
            } else {
                console.log("新增的 key: ", key);
            }

            const result = Reflect.set(target, key, val ,receiver);
            console.log("set: " + key + ": " + val);
            // 更新视图
            updateView();
            // 返回是否设置成功的值
            return result;
        },
        deleteProperty(target, key) {
            const result = Reflect.deleteProperty(target, key);
            console.log("delete property: ", key);
            return result;
        }
    };

    // 生成代理对象
    return new Proxy(target, proxyConf);
}

export {
    reactive,
    addWatcher
}