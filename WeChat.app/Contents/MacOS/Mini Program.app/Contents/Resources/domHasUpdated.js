/////监听DOM节点变化/////

// 防抖
function debounce(fn, ms) {
    var exist;
    var self = this;
    return function () {
        if (exist) {
            clearTimeout(exist);
        }
        var arg = arguments;
        exist = setTimeout(function () {
                           fn.apply(this, arg);
                           exist = null;
                           }, ms)
    }
}

// 发送视图更新消息
function send_dom_update_message() {
    // console.log('domHasUpdated');
    message = {
    event: 'domHasUpdated',
    paramsString: '',
    };
    window.webkit.messageHandlers.invokeHandler.postMessage(message);
}

var debounce_dom_update_message = debounce(send_dom_update_message, 400);

// Firefox和Chrome早期版本中带有前缀
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

var MutationObserver = window.WebKitMutationObserver
// 选择目标节点
var target = document.body;

// 创建观察者对象
var observer = new MutationObserver(function(mutations) {
                                    debounce_dom_update_message();
//                                    mutations.forEach(function(mutation) {
//                                                      debounce_dom_update_message();
//                                                      });
                                    });
// 配置观察选项:
var config={
    'childList' : true,//子节点的变动
    'attributes' : true,//属性的变动
    'characterData' : true,//节点内容或节点文本的变动
    'subtree' : true,//所有后代节点的变动
    'attributeOldValue' : false,//表示观察attributes变动时，是否需要记录变动前的属性
    'characterDataOldValue' : false//表示观察characterData变动时，是否需要记录变动前的值
};
// 传入目标节点和观察选项
observer.observe(target, config);
