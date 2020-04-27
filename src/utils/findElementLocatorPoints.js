import cv from 'opencv4nodejs';
import debug from 'debug';
import path from 'path';

import getElementName from './getElementName';
import createDirectory from './createDirectory';
import paths from './paths';
const config = require('../index');
import highlightImage from './highlightImage';
import highlightClickPoint from './highlightClickPoint';
import getElementLocatorPoints from './getElementLocatorPoints';
import findDevicePixelRatioAndNormalizeImages from './findDevicePixelRatioAndNormalizeImages';

const resizedImageLocatorFolder = paths().resizedImageLocatorFolder;
const sameSizeWebpageFolder = paths().sameSizeWebpageFolder;
const doubleSizeWebpageFolder = paths().doubleSizeWebpageFolder;
const halfSizeWebpageFolder = paths().halfSizeWebpageFolder;

const log = debug('wdio-image-text-recognition:findElementLocatorPoints');

export default async function findElementLocatorPoints(elementLocatorImagePath, clickPoint, imageReductionPerformanceFactor) {
    let outputDir = elementLocatorImagePath.replace(config.options.elementLocatorDir, config.options.elementMatchPointsDir);
    
    let [elementLocator, dir] = await Promise.all([
        getElementName(elementLocatorImagePath),
        createDirectory(path.dirname(outputDir))
    ]);
    
    let elementLocatorName = `${elementLocator}.png`;

    log('start Element Image Points');
    try {
        // resize the Element Locator and Webpage to enhance Performance
        let results = await findDevicePixelRatioAndNormalizeImages(elementLocatorImagePath, elementLocatorName, imageReductionPerformanceFactor);

        // match the image locator against the three screenshots (sameSize, doubleSize and halfSize) in parallel
        let promises = [
            getElementLocatorPoints(`${resizedImageLocatorFolder}${elementLocatorName}`, `${sameSizeWebpageFolder}${elementLocatorName}`, imageReductionPerformanceFactor, results[0], clickPoint),
            getElementLocatorPoints(`${resizedImageLocatorFolder}${elementLocatorName}`, `${doubleSizeWebpageFolder}${elementLocatorName}`, imageReductionPerformanceFactor, 2, clickPoint),
            getElementLocatorPoints(`${resizedImageLocatorFolder}${elementLocatorName}`, `${halfSizeWebpageFolder}${elementLocatorName}`, imageReductionPerformanceFactor, 1, clickPoint)
        ];

        results = await Promise.all(promises.map(p => p.catch(e => e)));
        let validResults = results.filter(result => (result instanceof Object));

        // pick the result having the highest value of maxVal
        let bestMatchResults = validResults.sort(function (a, b) {
            return parseFloat(b['maxVal']) - parseFloat(a['maxVal'])
        })[0]
        
        let outputImages = await Promise.all([
            highlightImage(bestMatchResults, imageReductionPerformanceFactor),
            highlightClickPoint(bestMatchResults, imageReductionPerformanceFactor)
        ]);
        
        cv.imwrite(outputDir, outputImages[1]);

        log('end Element Image Points');

        let result = {};
        result.x = bestMatchResults.x;
        result.y = bestMatchResults.y;
        result.maxVal = bestMatchResults.maxVal;

        return result;

    } catch (err) {
        console.log(elementLocatorName, err);
    }
}