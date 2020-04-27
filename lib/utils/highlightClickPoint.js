'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _opencv4nodejs = require('opencv4nodejs');

var _opencv4nodejs2 = _interopRequireDefault(_opencv4nodejs);

var _drawRectangle = require('./drawRectangle');

var _drawRectangle2 = _interopRequireDefault(_drawRectangle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function highlightClickPoint(data, imageReductionPerformanceFactor) {
    var outputImage = data.outputImage;
    var lineWidth = imageReductionPerformanceFactor > 1 ? 2 : 16;
    return await (0, _drawRectangle2.default)(outputImage, data.pointX, data.pointY, 1, 1, new _opencv4nodejs2.default.Vec(0, 0, 255), lineWidth);
};