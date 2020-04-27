'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getOverrideArgs;

var _jsonOverride = require('json-override');

var _jsonOverride2 = _interopRequireDefault(_jsonOverride);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getOverrideArgs(originalObject, defaultKey, keyToRead) {

    //Load the default data
    var defaultData = originalObject[defaultKey];
    var data = (0, _jsonOverride2.default)(defaultData, originalObject[keyToRead], true);
    return data;
}