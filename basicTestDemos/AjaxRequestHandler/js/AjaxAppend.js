// 保存原始的 $.ajax 方法
const originalAjax = $.ajax;

// 重写 $.ajax 方法
$.ajax = function(options) {
    // 在请求发送之前可以进行自定义处理
    const beforeSend = options.beforeSend || function() {};
    options.beforeSend = function(xhr, settings) {
        console.log("请求拦截器：请求发送之前");

        // 可在此加入自定义请求头或进行其他请求处理
        xhr.setRequestHeader("Custom-Header", "YourValue");

        // 调用原始的 beforeSend 方法
        return beforeSend.call(this, xhr, settings);
    };

    // 请求成功时的拦截处理
    const success = options.success || function() {};
    options.success = function(data, textStatus, xhr) {
        console.log("请求拦截器：请求成功");

        // 检查返回数据，例如判断是否有特殊状态码
        if (data.statusCode === 401) {
            alert("用户未授权，请重新登录！");
            // 可以在这里进行重定向等操作
        } else {
            // 调用原始的 success 方法
            success.call(this, data, textStatus, xhr);
        }
    };

    // 请求失败时的拦截处理
    const error = options.error || function() {};
    options.error = function(xhr, textStatus, errorThrown) {
        console.log("请求拦截器：请求失败");

        // 可根据状态码进行不同的处理
        if (xhr.status === 500) {
            alert("服务器内部错误，请稍后再试！");
        } else {
            // 调用原始的 error 方法
            error.call(this, xhr, textStatus, errorThrown);
        }
    };

    // 调用原始的 $.ajax 方法并传入修改后的选项
    return originalAjax.call(this, options);
};