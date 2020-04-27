'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _selfHealBase = require('../utils/selfHealBase');

var _selfHealBase2 = _interopRequireDefault(_selfHealBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = require('../index');
/**
 * @alias browser.selfHealClick
 * @param {String=} elementLocator
 * @param {String=} inputValue
 * @param {Object=} imageArgs
 */

// Note: function name must be async to signalize WebdriverIO that this function returns a promise

exports.default = async function async(elementLocator, inputValue, imageArgs) {

    var args = null;
    var elementLocatorImagePath = null;

    try {

        if (imageArgs) {
            args = override(config.options, imageArgs, true);
        } else {
            args = config.options;
        }

        elementLocatorImagePath = await (0, _selfHealBase2.default)(elementLocator, args);
        if (elementLocatorImagePath === 'ELEMENT_FOUND') {
            await browser.setText(elementLocator, inputValue);
        } else if (elementLocatorImagePath === 'SELF_HEAL_ERROR' || elementLocatorImagePath === 'ELEMENT_AND_IMAGE_LOCATOR_NOT_FOUND') {
            throw new Error(chalk.red('Error occurred while processing selfHealClick command'));
        } else {
            // setting Command timeout to 1 sec since waitForVisible command available inside selfHealBase function
            // has already waited for the requested timeout duration
            args.commandTimeout = 1000;
            await browser.cvSetText(elementPath, inputValue, args);
            if (_fs2.default.existsSync(elementLocatorImagePath)) {
                _fs2.default.unlink(elementLocatorImagePath, function (err) {
                    if (err) return chalk.red(err);
                });
            }
        }
    } catch (err) {
        throw new Error(chalk.red(err));
    }
};