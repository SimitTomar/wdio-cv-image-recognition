import resizeImage from './resizeImage';
import options from './paths';
const resizedImageLocatorFolder = options().resizedImageLocatorFolder;
const originalWebpageScreenshotFolder = options().originalWebpageScreenshotFolder;
const sameSizeWebpageFolder = options().sameSizeWebpageFolder;
const doubleSizeWebpageFolder = options().doubleSizeWebpageFolder;
const halfSizeWebpageFolder = options().halfSizeWebpageFolder;
import findDevicePixelRatio from './findDevicePixelRatio';

export default async function findDevicePixelRatioAndNormalizeImages(elementLocatorImagePath, elementLocatorName, imageReductionPerformanceFactor) {
    return await Promise.all([
        findDevicePixelRatio(),
        resizeImage(`${elementLocatorImagePath}`, imageReductionPerformanceFactor, `${resizedImageLocatorFolder}`),
        resizeImage(`${originalWebpageScreenshotFolder}${elementLocatorName}`, imageReductionPerformanceFactor, `${sameSizeWebpageFolder}`),
        // double the size of Webpage Screenshot wrt to the resized Element Locator(which is resized by multiplying with the imageReductionPerformanceFactor)
        resizeImage(`${originalWebpageScreenshotFolder}${elementLocatorName}`, imageReductionPerformanceFactor / 2, `${doubleSizeWebpageFolder}`),
        // half the size of Webpage Screenshot wrt to the resized Element Locator(which is resized by multiplying with the imageReductionPerformanceFactor)
        resizeImage(`${originalWebpageScreenshotFolder}${elementLocatorName}`, imageReductionPerformanceFactor * 2, `${halfSizeWebpageFolder}`)
    ]);
}