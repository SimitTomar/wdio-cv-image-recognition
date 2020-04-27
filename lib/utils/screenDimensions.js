"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScreenDimensions = function () {
  function ScreenDimensions(options) {
    var browser = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, ScreenDimensions);

    var html = options.html,
        body = options.body,
        window = options.window;
    var isIOS = browser.isIOS;


    this.isIOS = isIOS;
    this.viewportWidth = window.innerWidth || html.clientWidth || 0;
    this.viewportHeight = window.innerHeight || html.clientHeight || 0;

    this.documentWidth = html.scrollWidth;
    this.documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

    var screenMax = Math.max(window.screenWidth, window.screenHeight);
    var screenMin = Math.min(window.screenWidth, window.screenHeight);

    this.screenWidth = this.isLandscape() ? screenMax : screenMin;
    this.screenHeight = this.isLandscape() ? screenMin : screenMax;

    var innerMax = Math.max(window.innerWidth, window.innerHeight);
    var innerMin = Math.min(window.innerWidth, window.innerHeight);

    this.innerWidth = this.isLandscape() ? innerMax : innerMin;
    this.innerHeight = this.isLandscape() ? innerMin : innerMax;

    this.pixelRatio = window.pixelRatio;
    this.orientation = window.orientation;

    if (this.isIOS && this.isLandscape() && this.getViewportHeight() - 20 === this.getInnerHeight()) {
      // iOS 7 has a 20px bug in landscape mode
      this.viewportHeight = this.getInnerHeight();
    }

    if (this.isIOS && this.isLandscape() && this.getDocumentHeight() - 20 === this.getInnerHeight()) {
      // iOS 7 has a 20px bug in landscape mode
      this.documentHeight = this.getInnerHeight();
    }
  }

  _createClass(ScreenDimensions, [{
    key: "getViewportWidth",
    value: function getViewportWidth() {
      return this.viewportWidth;
    }
  }, {
    key: "getViewportHeight",
    value: function getViewportHeight() {
      return this.viewportHeight;
    }
  }, {
    key: "getDocumentWidth",
    value: function getDocumentWidth() {
      return this.documentWidth;
    }
  }, {
    key: "getDocumentHeight",
    value: function getDocumentHeight() {
      return this.documentHeight;
    }
  }, {
    key: "getScreenWidth",
    value: function getScreenWidth() {
      return this.screenWidth;
    }
  }, {
    key: "getScreenHeight",
    value: function getScreenHeight() {
      return this.screenHeight;
    }
  }, {
    key: "getInnerWidth",
    value: function getInnerWidth() {
      return this.innerWidth;
    }
  }, {
    key: "getInnerHeight",
    value: function getInnerHeight() {
      return this.innerHeight;
    }
  }]);

  return ScreenDimensions;
}();

exports.default = ScreenDimensions;


module.exports = ScreenDimensions;