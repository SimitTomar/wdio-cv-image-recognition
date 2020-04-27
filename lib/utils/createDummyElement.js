"use strict";

Object.defineProperty(exports, "__esModule", {
        value: true
});
exports.default = createDummyElement;
function createDummyElement(elementLocatorKey, elementPointsOnPage) {

        var dummyElementPointsX = elementPointsOnPage.x + 1;
        var dummyElementPointsY = elementPointsOnPage.y + 1;
        var div = document.createElement('div');
        document.body.append(div);
        div.id = elementLocatorKey + "Dummy";
        div.style.position = "absolute";
        div.style.left = dummyElementPointsX + "px";
        div.style.top = dummyElementPointsY + "px";
}