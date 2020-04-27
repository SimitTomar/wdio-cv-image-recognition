import cv from 'opencv4nodejs';
import drawRectangle from './drawRectangle';

export default async function highlightClickPoint(data, imageReductionPerformanceFactor) {
    let outputImage = data.outputImage;
    let lineWidth = imageReductionPerformanceFactor > 1 ? 2 : 16
    return await drawRectangle(outputImage, data.pointX, data.pointY, 1, 1, new cv.Vec(0, 0, 255), lineWidth)
}