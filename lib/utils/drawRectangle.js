'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _opencv4nodejs = require('opencv4nodejs');

var _opencv4nodejs2 = _interopRequireDefault(_opencv4nodejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function drawRectangle(image, x, y, width, height, color, lineWidth) {
    image.drawRectangle(new _opencv4nodejs2.default.Rect(x, y, width, height), color, lineWidth, _opencv4nodejs2.default.LINE_8);
    return image;
};