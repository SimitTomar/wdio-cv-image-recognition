'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _opencv4nodejs = require('opencv4nodejs');

var _opencv4nodejs2 = _interopRequireDefault(_opencv4nodejs);

var _getElementCoordinates = require('./getElementCoordinates');

var _getElementCoordinates2 = _interopRequireDefault(_getElementCoordinates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function getElementLocatorPoints(elementLocatorImagePath, webPageScreenshotPath, imageReductionPerformanceFactor, devicePixelRatio, clickPoint) {

    var minMax = void 0,
        result = {};

    // Load images
    var images = await Promise.all([_opencv4nodejs2.default.imread(elementLocatorImagePath), _opencv4nodejs2.default.imread(webPageScreenshotPath)]);

    var elementMat = images[0];
    var pageMat = images[1];

    // Match template (the brightest locations indicate the highest match)
    var matched = pageMat.matchTemplate(elementMat, 5);

    // Use minMaxLoc to locate the highest value (or lower, depending of the type of matching method)
    minMax = matched.minMaxLoc();

    result = (0, _getElementCoordinates2.default)(clickPoint, imageReductionPerformanceFactor, devicePixelRatio, minMax, elementMat);
    result.outputImage = pageMat;
    return result;
};