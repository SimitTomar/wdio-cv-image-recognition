'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _resizeImage = require('./resizeImage');

var _resizeImage2 = _interopRequireDefault(_resizeImage);

var _paths = require('./paths');

var _paths2 = _interopRequireDefault(_paths);

var _findDevicePixelRatio = require('./findDevicePixelRatio');

var _findDevicePixelRatio2 = _interopRequireDefault(_findDevicePixelRatio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resizedImageLocatorFolder = (0, _paths2.default)().resizedImageLocatorFolder;
var originalWebpageScreenshotFolder = (0, _paths2.default)().originalWebpageScreenshotFolder;
var sameSizeWebpageFolder = (0, _paths2.default)().sameSizeWebpageFolder;
var doubleSizeWebpageFolder = (0, _paths2.default)().doubleSizeWebpageFolder;
var halfSizeWebpageFolder = (0, _paths2.default)().halfSizeWebpageFolder;

exports.default = async function findDevicePixelRatioAndNormalizeImages(elementLocatorImagePath, elementLocatorName, imageReductionPerformanceFactor) {
    return await Promise.all([(0, _findDevicePixelRatio2.default)(), (0, _resizeImage2.default)('' + elementLocatorImagePath, imageReductionPerformanceFactor, '' + resizedImageLocatorFolder), (0, _resizeImage2.default)('' + originalWebpageScreenshotFolder + elementLocatorName, imageReductionPerformanceFactor, '' + sameSizeWebpageFolder),
    // double the size of Webpage Screenshot wrt to the resized Element Locator(which is resized by multiplying with the imageReductionPerformanceFactor)
    (0, _resizeImage2.default)('' + originalWebpageScreenshotFolder + elementLocatorName, imageReductionPerformanceFactor / 2, '' + doubleSizeWebpageFolder),
    // half the size of Webpage Screenshot wrt to the resized Element Locator(which is resized by multiplying with the imageReductionPerformanceFactor)
    (0, _resizeImage2.default)('' + originalWebpageScreenshotFolder + elementLocatorName, imageReductionPerformanceFactor * 2, '' + halfSizeWebpageFolder)]);
};