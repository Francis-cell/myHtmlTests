class GlobalLoading {
    constructor() {
        this.createLoadingElement();  // 初始化时创建加载动画元素
        this.isLoading = false;  // 跟踪加载状态
    }

    // 动态创建加载动画的 HTML 和 CSS
    createLoadingElement() {
        // 创建全屏遮罩层
        this.overlayElement = document.createElement('div');
        this.overlayElement.id = 'global-loading-overlay';
        this.overlayElement.style.display = 'none';  // 初始隐藏

        // 创建加载容器
        this.loadingElement = document.createElement('div');
        this.loadingElement.id = 'global-loading';
        this.loadingElement.style.display = 'none';  // 初始隐藏

        // 创建加载动画的具体内容 (旋转动画和文字)
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';

        // 创建加载中的文字
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.textContent = '加载中...';

        // 添加样式
        const style = document.createElement('style');
        style.innerHTML = `
          #global-loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);  // 半透明背景遮罩
            z-index: 9998;
          }
          #global-loading {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            text-align: center;
          }
          .loading-spinner {
            border: 16px solid #f3f3f3;
            border-top: 16px solid #3498db;
            border-radius: 50%;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
            margin-bottom: 10px;
          }
          .loading-text {
            font-size: 18px;
            color: #fff;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;

        // 将样式插入到文档头部
        document.head.appendChild(style);

        // 将 spinner 和加载文本插入到 loading 容器中
        this.loadingElement.appendChild(spinner);
        this.loadingElement.appendChild(loadingText);


    }

    // 显示加载动画和遮罩层
    show() {
        if (!this.isLoading) {
            // 将 loading 容器和遮罩层插入到 body 中
            document.body.appendChild(this.overlayElement);
            document.body.appendChild(this.loadingElement);
            this.loadingElement.style.display = 'block';
            this.overlayElement.style.display = 'block';
            this.isLoading = true;
        }

        // 等待浏览器完成当前帧的渲染
        return new Promise((resolve) => {
            requestAnimationFrame(() => resolve());
        });
    }

    // 隐藏加载动画和遮罩层
    hide() {
        if (this.isLoading) {
            this.loadingElement.style.display = 'none';
            this.overlayElement.style.display = 'none';
            // 将 loading 容器和遮罩层从 body 中移除
            document.body.removeChild(this.overlayElement);
            document.body.removeChild(this.loadingElement);
            this.isLoading = false;
        }
    }

    // 异常处理时关闭动画
    handleError(error) {
        console.error('加载时出现异常:', error);
        this.hide();
    }

    // 新增方法，用于处理长时间运行的任务
    // 修改后的 processLongRunningTask 方法
    processLongRunningTask(taskFunction, chunkSize = 100, interval = 10) {
        return new Promise((resolve, reject) => {
            let index = 0;
            let shouldContinue = true;

            const processChunk = () => {
                try {
                    // 执行任务的一小部分
                    for (let i = 0; i < chunkSize; i++) {
                        if (!shouldContinue) {
                            resolve();
                            return;
                        }
                        // 如果 taskFunction 返回 false，则停止执行
                        if (taskFunction(index++) === false) {
                            shouldContinue = false;
                        }
                    }
                    // 如果任务应该继续，则使用 setTimeout 递归调用 processChunk
                    if (shouldContinue) {
                        setTimeout(processChunk, interval);
                    }
                } catch (error) {
                    reject(error);
                }
            };

            processChunk();
        });
    }

    // functions 返回 false 则停止动画
    runWithLambdaFunction(functions) {
        this.processLongRunningTask(functions).then(() => {
            this.hide();
        }).catch((error) => {
            this.handleError(error);
        });
    }
}
