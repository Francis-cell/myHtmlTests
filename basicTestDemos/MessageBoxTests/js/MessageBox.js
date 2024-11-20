// 定义默认参数
const defaults = {
    title: null,
    message: '',
    type: '',
    showConfirmButton: true,
    showCancelButton: false,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
};

// 模拟一个消息队列
let msgQueue = [];
let currentMsg = null;

function createMessageBox(options, callback) {
    // 创建容器
    const container = document.createElement('div');
    container.className = 'message-box';

    // 创建标题
    const title = document.createElement('h2');
    title.innerText = options.title || '提示';

    // 创建消息内容
    const message = document.createElement('p');
    message.innerText = options.message;

    // 创建确认按钮
    const confirmButton = document.createElement('button');
    confirmButton.innerText = options.confirmButtonText || '确认';
    confirmButton.onclick = () => {
        // document.body.removeChild(container); // 点击后移除消息框
        callback('confirm');
    };

    // 添加元素到容器中
    container.appendChild(title);
    container.appendChild(message);
    container.appendChild(confirmButton);

    // 创建取消按钮（如果需要）
    if (options.showCancelButton) {
        const cancelButton = document.createElement('button');
        cancelButton.innerText = options.cancelButtonText || '取消';
        cancelButton.className = 'cancel-button';
        cancelButton.onclick = () => {
            // document.body.removeChild(container); // 点击后移除消息框
            callback('cancel');
        };
        container.appendChild(cancelButton);
    }



    // 将容器添加到文档中
    document.body.appendChild(container);

    // 创建并插入样式到页面
    const style = document.createElement('style');
    style.innerHTML = `
        .message-box {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border-radius: 10px;
            padding: 20px 30px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            max-width: 400px;
            width: 100%;
            text-align: center;
            font-family: Arial, sans-serif;
            color: #333;
        }

        .message-box h2 {
            font-size: 18px;
            margin-bottom: 10px;
            color: #333;
        }

        .message-box p {
            font-size: 16px;
            margin-bottom: 20px;
            color: #666;
        }

        .message-box button {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            background-color: #409eff;
            color: white;
            font-size: 14px;
            cursor: pointer;
            margin: 5px;
            outline: none;
        }

        .message-box button:hover {
            background-color: #66b1ff;
        }

        .message-box button.cancel-button {
            background-color: #f56c6c;
        }

        .message-box button.cancel-button:hover {
            background-color: #ff8787;
        }
    `;
    document.head.appendChild(style);

    return container;
}


// 消息框展示
function showNextMsg() {
    if (msgQueue.length > 0) {
        currentMsg = msgQueue.shift();

        const { options, resolve, reject } = currentMsg;

        // 创建并显示消息框
        const messageBox = createMessageBox(options, action => {
            document.body.removeChild(messageBox);
            if (action === 'confirm') {
                resolve(action);
            } else {
                reject(action);
            }
            showNextMsg();
        });
    }
}

// MessageBox 主体
const MessageBox = function(options) {
    return new Promise((resolve, reject) => {
        msgQueue.push({
            options: { ...defaults, ...options },
            resolve,
            reject
        });
        showNextMsg();
    });
};

// MessageBox 提示框
MessageBox.alert = function(message, title, confirmButtonText) {
    return MessageBox({
        title: title || '提示',
        message,
        showCancelButton: false,
        confirmButtonText
    });
};

// MessageBox 确认框
MessageBox.confirm = function(message, title, confirmButtonText, cancelButtonText) {
    return MessageBox({
        title: title || '确认',
        message,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText
    });
};

// export default MessageBox;
