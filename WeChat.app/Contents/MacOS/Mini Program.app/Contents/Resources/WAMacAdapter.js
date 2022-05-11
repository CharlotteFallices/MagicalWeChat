// 生成scrollView uuid
function mac_wx_get_uuid() {
    var s = [];
    var hexDigits = '0123456789abcdef';
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';
    
    var uuid = s.join('');
    return uuid;
}
// 获取元素相对浏览器的x
function mac_wx_get_element_left(element) {
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }
    return actualLeft;
};
// 获取元素相对浏览器的y
function mac_wx_get_element_top(element) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return actualTop;
}
// 获取全部内嵌scrollview的frame
function mac_wx_get_scroll_view_frame(dom) {
    return {
        top: mac_wx_get_element_top(dom),
        left: mac_wx_get_element_left(dom),
        width: dom.clientWidth,
        height: dom.clientHeight,
        scrollWidth: dom.scrollWidth,
        scrollHeight: dom.scrollHeight,
        scrollTop: dom.scrollTop
    };
};

var mac_wx_scrollListener = function(event) {
    var element = event.target;
    var param = {};
    if (element != document) {
        param.scrollId = element.getAttribute('mac-scroll-id');
        param.scrollLeft = element.scrollLeft;
        param.scrollTop = element.scrollTop;
    } else {
        param.scrollLeft = element.documentElement.scrollLeft || element.body.scrollLeft;
        param.scrollTop = element.documentElement.scrollTop || element.body.scrollTop;
    }

    message = {
        event: 'scrollEventListener',
        paramsString: JSON.stringify(param),
        };
    window.webkit.messageHandlers.invokeHandler.postMessage(message);
}
// 获取全部内嵌scrollview的字典
var mac_wx_scroll_view_map = {};
// 获取全部内嵌scrollview的信息
function mac_wx_get_all_wx_scroll_view_frame() {
    document.removeEventListener('scroll', mac_wx_scrollListener);
    document.addEventListener('scroll', mac_wx_scrollListener);

    var wx_scroll_views = document.querySelectorAll('wx-scroll-view>div>div');
    var frame_map = {};
    for (var i = 0; i < wx_scroll_views.length; i++) {
        var element = wx_scroll_views[i];
        if (element.style.overflowX.length || element.style.overflowY.length) {
            var scroll_id = element.getAttribute('mac-scroll-id');
            if (scroll_id != null) {
                frame_map[scroll_id] = mac_wx_get_scroll_view_frame(element);
            } else {
                var uuid = mac_wx_get_uuid();
                element.setAttribute('mac-scroll-id', uuid);
                mac_wx_scroll_view_map[uuid] = element;
                frame_map[uuid] = mac_wx_get_scroll_view_frame(element);
                // console.log('find-new-scroll');
                element.addEventListener('scroll', mac_wx_scrollListener);
            }
        }
    }
    return frame_map;
};

function mac_scroll_to(currentY, targetY) {
    // 计算需要移动的距离
    var needScrollTop = targetY - currentY
    var _currentY = currentY
    setTimeout(function() {
        // 一次调用滑动帧数，每次调用会不一样
        const dist = Math.ceil(needScrollTop / 10)
        _currentY += dist
        window.scrollTo(_currentY, currentY)
        // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
        if (needScrollTop > 10 || needScrollTop < -10) {
               mac_scroll_to(_currentY, targetY)
        } else {
               window.scrollTo(_currentY, targetY)
        }
    }, 1)
}
