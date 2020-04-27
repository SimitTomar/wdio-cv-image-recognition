'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//TODO: Split through .png
exports.default = async function getElementName(elementLocatorImagePath) {
    return await _path2.default.basename(elementLocatorImagePath).split('.')[0];
};