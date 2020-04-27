'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function createDirectory(dirPath) {

    if (!_fs2.default.existsSync(dirPath)) {
        (0, _mkdirp2.default)(dirPath, function (err) {
            if (err) console.error(err);
        });
    }
};