'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _sharp = require('sharp');

var _sharp2 = _interopRequireDefault(_sharp);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _getImageSize = require('./getImageSize');

var _getImageSize2 = _interopRequireDefault(_getImageSize);

var _paths = require('./paths');

var _paths2 = _interopRequireDefault(_paths);

var _createDirectory = require('./createDirectory');

var _createDirectory2 = _interopRequireDefault(_createDirectory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('wdio-image-text-recognition:resizeImage');

exports.default = async function resizeImage(inputImagePath, imageReductionPerformanceFactor) {
    var outputFolder = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (0, _paths2.default)().default;

    var _ref = await Promise.all([(0, _getImageSize2.default)(inputImagePath), (0, _createDirectory2.default)(outputFolder)]),
        _ref2 = _slicedToArray(_ref, 2),
        imageSize = _ref2[0],
        dir = _ref2[1];

    log('start Element Resizing');

    return new Promise(function (resolve, reject) {
        (0, _sharp2.default)(inputImagePath).resize(Math.round(imageSize.width / imageReductionPerformanceFactor), Math.round(imageSize.height / imageReductionPerformanceFactor)).toBuffer().then(function (data) {
            _fs2.default.writeFileSync(outputFolder + _path2.default.basename(inputImagePath), data);
            resolve();
        }).catch(function (err) {
            reject(err);
        });
        log('end Element Resizing');
    });
};