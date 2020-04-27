'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.options = undefined;
exports.init = init;

var _cvClick = require('./commands/cvClick');

var _cvClick2 = _interopRequireDefault(_cvClick);

var _cvSetValue = require('./commands/cvSetValue');

var _cvSetValue2 = _interopRequireDefault(_cvSetValue);

var _selfHealClick = require('./commands/selfHealClick');

var _selfHealClick2 = _interopRequireDefault(_selfHealClick);

var _selfHealSetValue = require('./commands/selfHealSetValue');

var _selfHealSetValue2 = _interopRequireDefault(_selfHealSetValue);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var options = {};

var WDIORecognition = function WDIORecognition(browser) {
    _classCallCheck(this, WDIORecognition);

    if (!browser) {
        throw new Error('A WebdriverIO instance is needed to initialise wdio-image-text-recognition');
    }

    // add commands to WebdriverIO instance
    browser.addCommand("cvClick", _cvClick2.default);
    browser.addCommand("cvSetValue", _cvSetValue2.default);
    browser.addCommand("selfHealClick", _selfHealClick2.default);
    browser.addCommand("selfHealSetValue", _selfHealSetValue2.default);
};

// export init function for initialization


function init(webdriverInstance, opts) {
    // TODO: Create function to Validate opts and then Set Options
    exports.options = options = opts;

    Promise.all([_fsExtra2.default.remove(options.elementMatchPointsDir, function (err) {
        if (err) {
            console.log('Error Occurred while deleting Output Folder', err);
        }
    }), _fsExtra2.default.remove('.tmp', function (err) {
        if (err) {
            console.log('Error Occurred while deleting tmp Folder', err);
        }
    })]);
    return new WDIORecognition(webdriverInstance);
}

exports.options = options;