'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conf = require('../index');

exports.default = async function createOutputDirectory(elementLocatorImagePath) {
    var outputDir = elementLocatorImagePath.replace(conf.options.elementLocatorDir, conf.options.elementMatchPointsDir);
    if (!_fs2.default.existsSync(outputDir)) {
        (0, _mkdirp2.default)(_path2.default.dirname(outputDir), function (err) {
            if (err) console.error(err);
        });
    }
    return outputDir;
};