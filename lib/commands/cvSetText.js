'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _findElementLocatorPoints = require('../utils/findElementLocatorPoints');

var _findElementLocatorPoints2 = _interopRequireDefault(_findElementLocatorPoints);

var _createDummyElement = require('../utils/createDummyElement');

var _createDummyElement2 = _interopRequireDefault(_createDummyElement);

var _getPageScreenshot = require('../utils/getPageScreenshot');

var _getPageScreenshot2 = _interopRequireDefault(_getPageScreenshot);

var _getElementName = require('../utils/getElementName');

var _getElementName2 = _interopRequireDefault(_getElementName);

var _jsonOverride = require('json-override');

var _jsonOverride2 = _interopRequireDefault(_jsonOverride);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = require('../index');

/**
 * @alias browser.cvEnterImage
 * @param {String=} elementLocatorImagePath
 * @param {String=} inputValue
 * @param {Object=} imageArgs
 */

// Note: function name must be async to signalize WebdriverIO that this function returns a promise

exports.default = async function async(elementLocatorImagePath, inputValue, imageArgs) {

    var args = null;

    if (imageArgs) {
        args = (0, _jsonOverride2.default)(config.options, imageArgs, true);
    } else {
        args = config.options;
    }

    var elementKey = await (0, _getElementName2.default)(elementLocatorImagePath);

    if (typeof elementLocatorImagePath !== 'undefined') {
        await browser.waitUntil(async function () {

            await (0, _getPageScreenshot2.default)(elementKey);

            // find the x,y points for Element on the web page wrt Open CV
            var elementLocatorPoints = await (0, _findElementLocatorPoints2.default)(elementLocatorImagePath, args.clickPoint, args.imageReductionPerformanceFactor);

            if (elementLocatorPoints != undefined && elementLocatorPoints.maxVal > args.minMatchConfidenceLevel) {
                // create the Dummy Element which will be used to perform this operations
                await browser.execute(_createDummyElement2.default, elementKey, elementLocatorPoints);

                //scroll to get the element into view
                await browser.scroll(elementLocatorPoints.x, elementLocatorPoints.y);

                // left click on the Dummy element on its respective x,y coordinates
                await browser.leftClick('#' + elementKey + 'Dummy', -1, -1);

                var result = await browser.elementActive();

                var activeElement = result.value && (result.value.ELEMENT || result.value["element-6066-11e4-a52e-4f735466cecf"]);
                // Newer versions of the webdriver like Gecko/IEDriver return the element as "element-6066-11e4-a52e-4f735466cecf" (which is documented in the W3C specs) instead of "ELEMENT".
                activeElement ? browser.elementIdValue(activeElement, inputValue) : false;

                return true;
            }
        }, args.commandTimeout, elementKey + ' Element not visible after ' + args.commandTimeout + ' ms');
    }

    return;
};