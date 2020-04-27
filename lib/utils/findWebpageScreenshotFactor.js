"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = async function findWebpageScreenshotFactor() {

    return await browser.execute(function () {
        return window.devicePixelRatio;
    }).then(function (result) {
        return result.value;
    });
};