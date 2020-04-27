'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _opencv4nodejs = require('opencv4nodejs');

var _opencv4nodejs2 = _interopRequireDefault(_opencv4nodejs);

var _drawRectangle = require('./drawRectangle');

var _drawRectangle2 = _interopRequireDefault(_drawRectangle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function highlightImage(data, imageReductionPerformanceFactor) {
    //convert data into Array if it is not the case
    data = data instanceof Array ? data : [data];

    var outputImage = data[0].outputImage;
    var lineWidth = imageReductionPerformanceFactor > 1 ? 1 : 2;
    for (var i = 0; i < data.length; i++) {
        outputImage = await (0, _drawRectangle2.default)(outputImage, data[i].rectX, data[i].rectY, data[i].rectWidth, data[i].rectHeight, new _opencv4nodejs2.default.Vec(0, 255, 0), lineWidth);
    }return outputImage;
};