'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _sharp = require('sharp');

var _sharp2 = _interopRequireDefault(_sharp);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _getPageScreenshot = require('../utils/getPageScreenshot');

var _getPageScreenshot2 = _interopRequireDefault(_getPageScreenshot);

var _paths = require('./paths');

var _paths2 = _interopRequireDefault(_paths);

var _findDevicePixelRatio = require('./findDevicePixelRatio');

var _findDevicePixelRatio2 = _interopRequireDefault(_findDevicePixelRatio);

var _getImageSize = require('./getImageSize');

var _getImageSize2 = _interopRequireDefault(_getImageSize);

var _createDirectory = require('./createDirectory');

var _createDirectory2 = _interopRequireDefault(_createDirectory);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @alias browser.selfHealBase
* @param {String=} elementLocator
* @param {Object=} args
*/

// Note: function name must be async to signalize WebdriverIO that this function returns a promise
exports.default = async function async(elementLocator, args) {

    try {

        // Find the Device Pixel Ratio of the screen
        var devicePixelRatio = await (0, _findDevicePixelRatio2.default)();

        // Get the Path of the Element Locator Directory
        var elementLocatorDir = args.elementLocatorDir.endsWith('/') ? args.elementLocatorDir : args.elementLocatorDir + '/';

        // Form the path of Self Heal Directory
        var selfHealDir = elementLocatorDir + 'selfHeal';

        // Create the Self Heal Directory
        await (0, _createDirectory2.default)(selfHealDir);

        // Create a hash of the element name to get a unique string
        var elementName = 'T' + _crypto2.default.createHash('md5').update(elementLocator).digest('hex');

        // Form the path of the Element Image Locator with the name of the element's hash
        var elementLocatorImagePath = selfHealDir + '/' + elementName + '.png';

        // Get the Path of the File where the buffer of the Image Locators will be stored
        var selfHealLocatorFilePath = selfHealDir + '/locators.json';

        // Create an empty json object for Self Heal Locators
        var selfHealLocatorsJSON = {};

        // Verify if the selfHealLocatorFilePath file exists or not
        if (_fs2.default.existsSync(selfHealLocatorFilePath))
            // Read all the existing Image Locator Buffers
            selfHealLocatorsJSON = JSON.parse(_fs2.default.readFileSync(selfHealLocatorFilePath));

        try {
            // Wait for the Element to be visible using HTML Locator
            await browser.waitForVisible(elementLocator, args.commandTimeout);
        } catch (err) {

            console.log(_chalk2.default.red(err + ', ' + _chalk2.default.green('Switched to Self Heal Mode!')));
            if (selfHealLocatorsJSON.hasOwnProperty(elementName)) {
                // If HTML Locator is not found, then convert the Element Buffer to the Element Locator Image file (.png)
                _fs2.default.writeFileSync(elementLocatorImagePath, Buffer.from(selfHealLocatorsJSON[elementName], 'base64'));

                // Return the Element Locator Image File Path and isElementDisplayed bool
                return elementLocatorImagePath;
            } else {
                console.log(_chalk2.default.red('No key found for ' + elementLocator + ' HTML Element Locator!!'));
                return 'ELEMENT_AND_IMAGE_LOCATOR_NOT_FOUND';
            }
        }

        // Find the x,y coordinates of the Element
        // Find the Width, Height of the Element
        // Save the screenshot of the entire page

        var _ref = await Promise.all([browser.getLocation(elementLocator), browser.getElementSize(elementLocator), (0, _getPageScreenshot2.default)(elementName)]),
            _ref2 = _slicedToArray(_ref, 3),
            elementLocation = _ref2[0],
            elementSize = _ref2[1],
            screenshot = _ref2[2];

        // Get the details (like width, height) of the entire page's screenshot


        var imageSize = await (0, _getImageSize2.default)('' + (0, _paths2.default)().originalWebpageScreenshotFolder + elementName + '.png');

        // Find the horizontal margin for the element locator
        var xMarginList = [elementLocation.x, elementSize.width, elementLocation.x, imageSize.width - (elementLocation.x + elementSize.width)];
        xMarginList = xMarginList.filter(function (x) {
            return x > -1;
        });
        var xMargin = _lodash2.default.min(xMarginList);

        // Find the vertical margin for the element locator
        var yMarginList = [elementLocation.y, elementSize.height, elementLocation.y, imageSize.height - (elementLocation.y + elementSize.height)];
        yMarginList = yMarginList.filter(function (x) {
            return x > -1;
        });
        var yMargin = _lodash2.default.min(yMarginList);

        // Extract the Dimensions of the Element Locator,
        // This will be used for cropping the Element's Image from the entire screenshot
        // Say, for example:
        // x = 100, width = 20, margin = 10
        // left = 100 - 10 = 90
        // width = 20 + (10 * 2) = 40

        // Create the Image Buffer
        await (0, _sharp2.default)('' + (0, _paths2.default)().originalWebpageScreenshotFolder + elementName + '.png').extract({
            left: Math.trunc((elementLocation.x - xMargin) * devicePixelRatio),
            top: Math.trunc((elementLocation.y - yMargin) * devicePixelRatio),
            width: Math.trunc((elementSize.width + xMargin * 2) * devicePixelRatio),
            height: Math.trunc((elementSize.height + yMargin * 2) * devicePixelRatio)
        }).toBuffer().then(function (data) {
            // Add the new {key, value} pair for the element locator (value will be element locator image's buffer)
            selfHealLocatorsJSON[elementName] = Buffer.from(data).toString('base64');

            // Write the selfHealLocatorsJSON in the locators.json
            _fs2.default.writeFile(selfHealLocatorFilePath, JSON.stringify(selfHealLocatorsJSON, null, 2), 'utf-8', function (err) {
                if (err) console.log(err);
            });
        });

        return 'ELEMENT_FOUND';
    } catch (err) {

        console.error(_chalk2.default.red('Error Found in Self Heal Base', err));
        return 'SELF_HEAL_ERROR';
    }
};