'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = options;
function options() {
    return {
        default: '.tmp/',
        resizedImageLocatorFolder: '.tmp/locators/',
        originalWebpageScreenshotFolder: '.tmp/originalSizePage/',
        sameSizeWebpageFolder: '.tmp/sameSizePage/',
        doubleSizeWebpageFolder: '.tmp/doubleSizePage/',
        halfSizeWebpageFolder: '.tmp/halfSizePage/'
    };
}