import cv from 'opencv4nodejs';
import getElementCoordinates from './getElementCoordinates'

export default async function getElementLocatorPoints(elementLocatorImagePath, webPageScreenshotPath, imageReductionPerformanceFactor, devicePixelRatio, clickPoint) {

    let minMax, result = {};

    // Load images
    let images = await Promise.all([cv.imread(elementLocatorImagePath), cv.imread(webPageScreenshotPath)]);
    
    let elementMat = images[0];
    let pageMat = images[1];

    // Match template (the brightest locations indicate the highest match)
    let matched = pageMat.matchTemplate(elementMat, 5);

    // Use minMaxLoc to locate the highest value (or lower, depending of the type of matching method)
    minMax = matched.minMaxLoc();
    
    result = getElementCoordinates(clickPoint, imageReductionPerformanceFactor, devicePixelRatio, minMax, elementMat);
    result.outputImage = pageMat;
    return result;
}