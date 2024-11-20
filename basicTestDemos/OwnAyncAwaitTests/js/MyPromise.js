// 自定义 myPromise 实现
function myPromise(executor) {
    let state = 'pending';  // 状态：'pending', 'fulfilled', 'rejected'
    let value = null;       // 成功或失败的结果值
    let handlers = [];      // 存储 then 的回调
    let catchers = [];      // 存储 catch 的回调

    function resolve(result) {
        if (state !== 'pending') return;
        state = 'fulfilled';
        value = result;
        handlers.forEach(handler => handler(value));
    }

    function reject(error) {
        if (state !== 'pending') return;
        state = 'rejected';
        value = error;
        catchers.forEach(catcher => catcher(value));
    }

    this.then = function (onSuccess) {
        return new myPromise((resolve, reject) => {
            handlers.push((value) => {
                if (onSuccess) {
                    try {
                        const result = onSuccess(value);
                        resolve(result);
                    } catch (err) {
                        reject(err);
                    }
                } else {
                    resolve(value);
                }
            });

            if (state === 'fulfilled') {
                handlers.forEach(handler => handler(value));
            }
        });
    };

    this.catch = function (onError) {
        return new myPromise((resolve, reject) => {
            catchers.push((value) => {
                if (onError) {
                    try {
                        const result = onError(value);
                        resolve(result);
                    } catch (err) {
                        reject(err);
                    }
                } else {
                    reject(value);
                }
            });

            if (state === 'rejected') {
                catchers.forEach(catcher => catcher(value));
            }
        });
    };

    try {
        executor(resolve, reject);
    } catch (err) {
        reject(err);
    }
}

// 添加 resolve 和 reject 静态方法到 myPromise
myPromise.resolve = function(value) {
    return new myPromise((resolve) => resolve(value));
};

myPromise.reject = function(reason) {
    return new myPromise((_, reject) => reject(reason));
};

// 模拟异步操作，使用 myPromise
function delay(time) {
    return new myPromise((resolve) => {
        setTimeout(() => {
            resolve(`延迟了 ${time} 毫秒`);
        }, time);
    });
}

// myAsync 模拟 async/await
function myAsync(generatorFunc) {
    const generator = generatorFunc();

    function handle(result) {
        if (result.done) return myPromise.resolve(result.value); // 确保返回 myPromise

        return result.value.then(value => {
            return handle(generator.next(value));
        }).catch(err => {
            return handle(generator.throw(err));
        });
    }

    try {
        return handle(generator.next());
    } catch (err) {
        return myPromise.reject(err);
    }
}
