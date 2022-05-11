(function () {
  var LOG_LEVEL = {
      LOG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
      DEBUG: 4
  }
  var document = window.document
  var canvas = document.getElementById('myCanvas')
  var _console = window.console

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
 console.log("canvas.width:" + canvas.width)
 console.log("canvas.height:" + canvas.height)
 
  var documentCreateElement = document.createElement.bind(document)
  var global = {
    __wxConfig: __wxConfig,
    EventHandler: {
      ontouchstart: null,
      ontouchmove: null,
      ontouchCancel: null,
      ontouchend: null
    },
    requestAnimationFrame: window.requestAnimationFrame.bind(window),
    cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
    setTimeout: window.setTimeout.bind(window),
    clearTimeout: window.clearTimeout.bind(window),
    setInterval: window.setInterval.bind(window),
    clearInterval: window.clearInterval.bind(window),
    Canvas: (function () {
      var firstCanvas = true
      return function () {
        if (firstCanvas) {
          firstCanvas = false
          return canvas
        }
        var newcanvas = documentCreateElement('canvas')
        return newcanvas
      }
    })(),
    Image: window.Image,
    log: function (logJSON) {
      prompt('webgame_log', logJSON);
    },
    // TODO 实现 XMLReader
    XMLReader: function () {
    },
    // TODO 实现 encodeArrayBuffer
    encodeArrayBuffer: function () {
    },
    // TODO 实现 decodeArrayBuffer
    decodeArrayBuffer: function () {
    },
    setPreferredFramesPerSecond: function () {
      console.warn('当前平台不支持 setPreferredFramesPerSecond')
    },
    // TODO 实现 loadFont
    loadFont: function (path) {
    },
    performanceNow: window.performance.now.bind(window.performanceNow)
  };

  global.__wxConfig.devicePixelRatio = window.devicePixelRatio
  global.__wxConfig.screenWidth = window.innerWidth
  global.__wxConfig.screenHeight = window.innerHeight

  function encodeSearchParams(obj) {
    const params = []
    Object.keys(obj).forEach((key) => {
      let value = obj[key]
      // 如果值为undefined我们将其置空
      if (typeof value === 'undefined') {
        value = ''
      }
      params.push([key, value].join('='))
    })
    return params.join('&')
  }

  var _imageSrcGetter = Object.getOwnPropertyDescriptor(window.Image.prototype, 'src').get
  var _imageSrcSetter = Object.getOwnPropertyDescriptor(window.Image.prototype, 'src').set
  Object.defineProperty(window.Image.prototype, 'src', {
    get: function () {
      return _imageSrcGetter.call(this).replace(/^wxpackage:\/\//, '')
    },
    set: function (value) {
      var self = this;
      var baseUrl = window.gameframeBaseUrl;
      self.setAttribute('crossOrigin', 'anonymous');
      if (/^(http|https):\/\//.test(value) || /^\s*data:image\//.test(value) || value === '') 
      {
        var params = {
          appid:global.__wxConfig.appID,
          type :'wxorigin',
          preloadBaseURL: encodeURIComponent(global.__wxConfig.preloadBaseURL),
          resourcePath:encodeURIComponent(value)
        }
        var callUrl =  encodeSearchParams(params);

        _imageSrcSetter.call(self, baseUrl+'?'+callUrl);
      } 
      else if (/^wxfile:\/\//.test(value)) 
      {
        var params = {
          appid:global.__wxConfig.appID,
          type :'wxfile',
          preloadBaseURL: encodeURIComponent(global.__wxConfig.preloadBaseURL),
          resourcePath:encodeURIComponent(value)
        }
        var callUrl =  encodeSearchParams(params);

        _imageSrcSetter.call(self, baseUrl+'?'+callUrl);
      }
      else 
      {
        var params = {
          appid:global.__wxConfig.appID,
          type :'wxpackage',
          preloadBaseURL: encodeURIComponent(global.__wxConfig.preloadBaseURL),
          resourcePath:encodeURIComponent(value)
        }
        var callUrl =  encodeSearchParams(params);

        _imageSrcSetter.call(self, baseUrl+'?'+callUrl);
      }
    }
  });


  ['touchstart', 'touchmove', 'touchcancel', 'touchend'].forEach(function (type) {
    document.addEventListener(type, function (e) {
      var type = e.type
      var listener = global.EventHandler['on' + type]
      if (typeof listener === 'function') {
        var eventObj = {
          changedTouches: e.changedTouches,
          currentTarget: e.currentTarget,
          target: e.target,
          targetTouches: e.targetTouches,
          touches: e.touches,
          type: type
        }
        listener.call(canvas, eventObj)
      }
    })
  })

  var WeixinWorker = {
    create : function(workFile){
      var jsonObject = {
        "functionNmae" : "create",
        "workerFile"     : encodeURIComponent(workFile),
      }
      var wokerJson =  JSON.stringify(jsonObject);
      var result = prompt('webgame_weixinworker', wokerJson);

      if (typeof(result) === "string")
      {
        return Number(result);
      }
      return result;
    },

    postMsgToWorker : function(workerId,msg){

      var jsonObject = {
        "functionNmae" : "postMsgToWorker",
        "workerId"     : workerId,
        "msg"          : msg,
      }

      var wokerJson =  JSON.stringify(jsonObject);
      prompt('webgame_weixinworker', wokerJson);
    },

    terminate : function(workerId){

      var jsonObject = {
        "functionNmae" : "terminate",
        "workerId"     : workerId
      }

      var wokerJson =  JSON.stringify(jsonObject);
      prompt('webgame_weixinworker', wokerJson);
    }
  }

  window.WeixinWorker = WeixinWorker;

  window.NativeGlobal = global
  window.WebGLRenderingContext.prototype.wxSetContextAttributes = function () {
    console.warn('当前版本不支持 wxSetContextAttributes')
  }

})();
