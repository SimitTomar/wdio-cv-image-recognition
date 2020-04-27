'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getImageSize;

var _sharp = require('sharp');

var _sharp2 = _interopRequireDefault(_sharp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getImageSize(imagePath) {
    return new Promise(function (resolve, reject) {
        (0, _sharp2.default)(imagePath).metadata().then(function (info) {
            resolve(info);
        }).catch(function (err) {
            reject(err);
        });
    });
}