'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _advancedJsonPath = require('advanced-json-path');

var _advancedJsonPath2 = _interopRequireDefault(_advancedJsonPath);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _paths = require('./paths');

var _paths2 = _interopRequireDefault(_paths);

var _createDirectory = require('./createDirectory');

var _createDirectory2 = _interopRequireDefault(_createDirectory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function getPageScreenshot(elementKey) {
    var pageScreenshot = void 0,
        buf = void 0;
    var browserName = browser.desiredCapabilities.browserName;
    var placeholder = 'This_Is_Browser_Log';
    await (0, _createDirectory2.default)('' + (0, _paths2.default)().originalWebpageScreenshotFolder);

    for (var i = 0; i < 50; i++) {
        try {
            await browser.execute(function () {
                document.head.appendChild(Object.assign(document.createElement('script'), { src: 'https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-alpha.12/dist/html2canvas.min.js' }));
            });

            if (browserName == 'firefox') {
                var logs = await browser.execute(function () {
                    return html2canvas(document.body).then(function (canvas) {
                        return canvas.toDataURL().replace('data:image/png;base64,', '');
                    });
                });
                buf = Buffer.from(logs.value, 'base64');
            } else {

                await browser.execute(function () {
                    html2canvas(document.body).then(function (canvas) {
                        pageScreenshot = canvas.toDataURL();
                        pageScreenshot = pageScreenshot.replace('data:image/png;base64,', '');
                        console.log('This_Is_Browser_Log' + pageScreenshot);
                    });
                });

                var _logs = await browser.log('browser');
                var result = (0, _advancedJsonPath2.default)(JSON.parse(JSON.stringify(_logs.value)), '$..message');

                for (var _i = 0; _i < result.length; _i++) {
                    if (result[_i].toString().includes(placeholder)) {
                        var matches = result[_i].match(/"(.*?)"/);
                        pageScreenshot = matches ? matches[1].replace(placeholder, '') : result[_i].replace(placeholder, '');
                        buf = Buffer.from(pageScreenshot, 'base64');
                        break;
                    }
                }
            }
            if (buf != undefined) break;
        } catch (err) {
            // throw new Error(err.stack)
        }
    }

    _fs2.default.writeFileSync('' + (0, _paths2.default)().originalWebpageScreenshotFolder + elementKey + '.png', buf);
};