'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _opencv4nodejs = require('opencv4nodejs');

var _opencv4nodejs2 = _interopRequireDefault(_opencv4nodejs);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _getElementName = require('./getElementName');

var _getElementName2 = _interopRequireDefault(_getElementName);

var _createDirectory = require('./createDirectory');

var _createDirectory2 = _interopRequireDefault(_createDirectory);

var _paths = require('./paths');

var _paths2 = _interopRequireDefault(_paths);

var _highlightImage = require('./highlightImage');

var _highlightImage2 = _interopRequireDefault(_highlightImage);

var _highlightClickPoint = require('./highlightClickPoint');

var _highlightClickPoint2 = _interopRequireDefault(_highlightClickPoint);

var _getElementLocatorPoints = require('./getElementLocatorPoints');

var _getElementLocatorPoints2 = _interopRequireDefault(_getElementLocatorPoints);

var _findDevicePixelRatioAndNormalizeImages = require('./findDevicePixelRatioAndNormalizeImages');

var _findDevicePixelRatioAndNormalizeImages2 = _interopRequireDefault(_findDevicePixelRatioAndNormalizeImages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = require('../index');


var resizedImageLocatorFolder = (0, _paths2.default)().resizedImageLocatorFolder;
var sameSizeWebpageFolder = (0, _paths2.default)().sameSizeWebpageFolder;
var doubleSizeWebpageFolder = (0, _paths2.default)().doubleSizeWebpageFolder;
var halfSizeWebpageFolder = (0, _paths2.default)().halfSizeWebpageFolder;

var log = (0, _debug2.default)('wdio-image-text-recognition:findElementLocatorPoints');

exports.default = async function findElementLocatorPoints(elementLocatorImagePath, clickPoint, imageReductionPerformanceFactor) {
    var outputDir = elementLocatorImagePath.replace(config.options.elementLocatorDir, config.options.elementMatchPointsDir);

    var _ref = await Promise.all([(0, _getElementName2.default)(elementLocatorImagePath), (0, _createDirectory2.default)(_path2.default.dirname(outputDir))]),
        _ref2 = _slicedToArray(_ref, 2),
        elementLocator = _ref2[0],
        dir = _ref2[1];

    var elementLocatorName = elementLocator + '.png';

    log('start Element Image Points');
    try {
        // resize the Element Locator and Webpage to enhance Performance
        var results = await (0, _findDevicePixelRatioAndNormalizeImages2.default)(elementLocatorImagePath, elementLocatorName, imageReductionPerformanceFactor);

        // match the image locator against the three screenshots (sameSize, doubleSize and halfSize) in parallel
        var promises = [(0, _getElementLocatorPoints2.default)('' + resizedImageLocatorFolder + elementLocatorName, '' + sameSizeWebpageFolder + elementLocatorName, imageReductionPerformanceFactor, results[0], clickPoint), (0, _getElementLocatorPoints2.default)('' + resizedImageLocatorFolder + elementLocatorName, '' + doubleSizeWebpageFolder + elementLocatorName, imageReductionPerformanceFactor, 2, clickPoint), (0, _getElementLocatorPoints2.default)('' + resizedImageLocatorFolder + elementLocatorName, '' + halfSizeWebpageFolder + elementLocatorName, imageReductionPerformanceFactor, 1, clickPoint)];

        results = await Promise.all(promises.map(function (p) {
            return p.catch(function (e) {
                return e;
            });
        }));
        var validResults = results.filter(function (result) {
            return result instanceof Object;
        });

        // pick the result having the highest value of maxVal
        var bestMatchResults = validResults.sort(function (a, b) {
            return parseFloat(b['maxVal']) - parseFloat(a['maxVal']);
        })[0];

        var outputImages = await Promise.all([(0, _highlightImage2.default)(bestMatchResults, imageReductionPerformanceFactor), (0, _highlightClickPoint2.default)(bestMatchResults, imageReductionPerformanceFactor)]);

        _opencv4nodejs2.default.imwrite(outputDir, outputImages[1]);

        log('end Element Image Points');

        var result = {};
        result.x = bestMatchResults.x;
        result.y = bestMatchResults.y;
        result.maxVal = bestMatchResults.maxVal;

        return result;
    } catch (err) {
        console.log(elementLocatorName, err);
    }
};