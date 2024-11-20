function loadHtmlComponent(filePath) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", filePath, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(`Failed to load ${filePath}: ${xhr.status}`);
                }
            }
        };
        xhr.send();
    });
}

function showComponent(filePath, data = {}) {
    return new Promise(async (resolve, reject) => {
        // console.log("传递过程中的数据:", JSON.stringify(data));
        // localStorage.setItem("componentData", { detail: data });

        // 加载外部 HTML 文件
        const htmlContent = await loadHtmlComponent(filePath);

        // 创建组件容器并插入 HTML 内容
        const container = document.createElement('div');
        container.className = 'html-component';
        container.innerHTML = htmlContent;
        document.body.appendChild(container);

        console.error("container: ", container);

        // 提取并执行所有 script 标签中的代码
        const scripts = container.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            const newScript = document.createElement('script');
            if (script.src) {
                // 如果是外部脚本，则重新加载
                newScript.src = script.src;
                document.head.appendChild(newScript);
            } else {
                // 如果是内联脚本，手动执行其内容
                new Function(script.innerHTML)();
            }
        }

        // 创建并触发自定义事件，将数据传递给内部的 HTML
        const dataEvent = new CustomEvent('componentData', { detail: data });
        document.dispatchEvent(dataEvent);

        // 监听 modal 的 "确认" 和 "取消" 操作
        document.addEventListener('modalResolve', (event) => {
            document.body.removeChild(container);  // 移除 modal
            resolve(event.detail.result);  // 返回成功结果
        });

        document.addEventListener('modalReject', (event) => {
            document.body.removeChild(container);  // 移除 modal
            reject(event.detail.result);  // 返回失败结果
        });

        // function dataEventResolveFun(val) {
        //     document.body.removeChild(container);  // 销毁弹窗
        //     resolve(val);  // 触发 promise resolve，继续后续操作
        // }
        //
        // function dataEventRejectFun(val) {
        //     document.body.removeChild(container);  // 销毁弹窗
        //     reject(val);  // 触发 promise reject，终止后续操作
        // }

        // 查找所有 class 为 closeButton 的按钮
        // const closeButtons = container.querySelectorAll('.closeButton');
        // closeButtons.forEach(button => {
        //     button.addEventListener('click', () => {
        //         // 判断按钮是否包含 resolve 或 reject 类
        //         if (button.classList.contains('resolve')) {
        //             document.body.removeChild(container);  // 销毁弹窗
        //             resolve("123");  // 触发 promise resolve，继续后续操作
        //         } else if (button.classList.contains('reject')) {
        //             document.body.removeChild(container);  // 销毁弹窗
        //             reject();  // 触发 promise reject，终止后续操作
        //         }
        //     });
        // });

        // 样式定义
        const style = document.createElement('style');
        style.innerHTML = `
            .html-component {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #fff;
                padding: 20px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                border-radius: 10px;
                z-index: 1000;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    });
}

