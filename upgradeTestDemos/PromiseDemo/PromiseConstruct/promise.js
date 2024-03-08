// 接收一个执行器函数（同步执行）的参数
function Promise(excutor) {
    // 给 promise 对象指定 status 属性，初始值为 pending
    this.status = 'pending';
    // 给 promise 对象指定一个用于存储结果数据的属性
    this.data = null;
    // 每个元素的结构： { onFulfilled() {}, onRejected() {} }
    this.callBacks = [];

    const resolve = (value) => {
        // 状态只能变化一次，判断不是 pending，就直接结束
        if (this.status !== 'pending') {
            return;
        }

        // 将状态设置成 resolved
        this.status = 'resolved';
        // 保存 value 中的值
        this.data = value;

        // 如果有待执行的 callBack 函数，立即异步执行回调函数 onFulfilled
        if (this.callBacks.length > 0) {
            setTimeout(() => {
               this.callBacks.forEach(callBacksObj => {
                  callBacksObj.onFulfilled(value);
               });
            });
        }
    };

    const reject = (reason) => {
        // 状态只能变化一次，判断不是 pending，就直接结束
        if (this.status !== 'pending') {
            return;
        }

        // 将状态设置成 rejected
        this.status = 'rejected';
        // 保存 reason 的值
        this.data = reason;

        // 如果有待执行的 callBack 函数，立即异步执行 onRejected 函数
        if (this.callBacks.length > 0) {
            setTimeout(() => {
               this.callBacks.forEach(callBackObj => {
                  callBackObj.onRejected(reason);
               });
            });
        }
    };

    // 如果执行器执行失败，promise 变成失败状态
    try {
        // 执行器函数接收两个参数（resolve, reject）
        // 立即同步执行执行器函数
        excutor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

// then 方法实现 (返回一个 Promise 对象)
Promise.prototype.then = function (onFulfilled, onRejected) {
    let promise2 = new Promise((resolve, reject) => {
        // 规范 2.2.1.1 onFulfilled 必须是函数类型
        // 规范 2.2.1.2 onRejected 必须是函数类型
        // 指定回调函数的默认值 (向后传递成功的 value)
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        // 指定失败回调（实现异常穿透的关键点）  (向后传递失败的 reason)
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; }


        /** 重复部分封装成 handle */
        const handle = (callBack) => {
            // 如果抛出异常，那 return 的 promise 就失败，reason 就是 error
            try {
                // 执行成功或者失败的回调
                let x = callBack(this.data);
                // 调用 resolvePromise
                resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
                reject(error);
            }
        }


        // 判断状态
        if (this.status === 'resolved') {
            /** 当状态是 resolved 的时候，先改变状态，再执行回调，此时应该立即执行回调函数 */
            setTimeout(() => {
               // try {
               //     // 执行成功的回调 onFulfilled
               //     let x  = onFulfilled(this.data);
               //     // 调用 resolvePromise
               //     resolvePromise(promise2, x, resolve, reject);
               // } catch (e) {
               //     reject(e);
               // }

                handle(onFulfilled);
            });
        } else if (this.status === 'rejected') {
            /** 当状态是 rejected 的时候，先改变状态，再执行回调，此时应该立即执行回调函数 */
            setTimeout(() => {
               // try {
               //     // 执行失败的回调 onRejected
               //     let x = onRejected(this.data);
               //     // 调用 resolvePromise
               //     resolvePromise(promise2, x, resolve, reject);
               // } catch (e) {
               //     reject(e);
               // }

                handle(onRejected);
            });
        } else {
            // pending
            /** 当状态是 pending 的时候，此时状态还没被改变，说明是先指定回调函数，再调整状态，所以需要将回调函数存起来 */
            // 此时还未改变状态，说明是先指定回调函数，再改变状态，所以要把回调函数存储起来
            // callBacks 数组每一项元素是一个 json
            // 如果返回的结果是 promise 类型，那 return 的 promise 的结果就是返回的 promise 对象的结果
            // 所以这个要获取的 promise 执行的结果
            this.callBacks.push({
                // 成功时的调用
                onFulfilled() {
                    // try {
                    //     let x = onFulfilled(this.data);
                    //     resolvePromise(promise2, x, resolve, reject);
                    // } catch (e) {
                    //     reject(e);
                    // }

                    handle(onFulfilled);
                },
                onRejected() {
                    // try {
                    //     let x = onRejected(this.data);
                    //     resolvePromise(promise2, x, resolve, reject);
                    // } catch (e) {
                    //     reject(e);
                    // }

                    handle(onRejected);
                }
            });
        }
    });
    return promise2;
}


// catch 方法定义 (then 的语法糖)
Promise.prototype.catch = function (onRejected){
    return this.then(undefined, onRejected);
}


// resolvePromise 方法定义
function resolvePromise(promise2, x, resolve, reject) {
    // 2.3.1 如果 promise2 和 x 相等，那么 reject promise with a TypeError
    if (promise2 === x) {
        reject(new TypeError("循环引用"));
    }
    // 2.3.3 如果 x 是一个 object 或者 是一个 function
    if (x && typeof x === 'object' || typeof x === 'function') {
        // 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 都调用了，那么第一个调用优先，后面的调用忽略。
        // used保证只执行一次
        let used = false;
        // 2.3.3.1 let then = x.then
        try {
            let then = x.then;
            // 2.3.3.3 如果 then 是一个函数，then.call(x, resolvePromiseFn, rejectPromise)
            if (typeof then === 'function') {
                then.call(x,
                    y => {
                        if (used) {
                            return;
                        }
                        used = true;
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    r => {
                        if (used) {
                            return;
                        }
                        used = true;
                        reject(r);
                    }
                )
            } else {
                // 2.3.3.4 如果 then 不是一个function. fulfill promise with x.
                if (used) {
                    return;
                }
                used = true;
                resolve(x);
            }
        } catch (e) {
            // 2.3.3.2 如果 x.then 这步出错，那么 reject promise with e as the reason..
            if (used) {
                return;
            }
            used = true;
            reject(e);
        }
    } else {
        // 2.3.4 如果 x 不是一个 object 或者 function，fulfill promise with x.
        resolve(x);
    }
}


// resolve 方法 (Promise 成功的时候调用的方法)
// 参数为一般值，则直接返回，参数若为 promise 对象，则返回 promise 对象的结果
Promise.resolve = (value) => {
    if (value instanceof Promise) {
        return value;
    }

    return new Promise((resolve, reject) => {
       try {
           if (value && value.then && typeof value.then === 'function') {
               setTimeout(() => {
                   // value.then(
                   //     value => {
                   //         resolve(value);
                   //     },
                   //     reason => {
                   //         reject(reason);
                   //     }
                   // )

                   value.then(resolve, reject);
               })
           } else {
               resolve(value);
           }
       } catch (e) {
           reject(e);
       }
    });
}


// reject 方法 (Promise 失败的时候调用的方法)
Promise.reject = (reason) => {
    return new Promise((resolve, reject) => {
        reject(reason);
    });
}

// all 方法
Promise.all = (promises) => {
    return new Promise((resolve,  reject) => {
        if (promises && promises.length === 0) {
            resolve([]);
        } else {
            let values = [];
            promises.forEach((fn, index) => {
               Promise.resolve(fn).then(
                   value => {
                       values[index] = value;
                       if (values.length === promises.length) {
                           resolve(values);
                       }
                   },
                   reason => {
                       reject(reason);
                   }
               )
            });
        }
    });
}

// race 方法
Promise.race = (promises) => {
    return new Promise((resolve, reject) => {
       promises.forEach((fn, index) => {
          Promise.resolve(fn).then(
              value => {
                  resolve(value);
              },
              reason => {
                  reject(reason);
              }
          )
       });
    });
}


Promise.defer = Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}

module.exports = Promise;
