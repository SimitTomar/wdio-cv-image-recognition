import cv from 'opencv4nodejs';
import drawRectangle from './drawRectangle';

export default async function highlightImage(data, imageReductionPerformanceFactor) {
    //convert data into Array if it is not the case
    data = data instanceof Array ? data : [data]

    let outputImage = data[0].outputImage;
    let lineWidth = imageReductionPerformanceFactor > 1 ? 1 : 2
    for (let i = 0; i < data.length; i++)
        outputImage = await drawRectangle(outputImage, data[i].rectX, data[i].rectY, data[i].rectWidth, data[i].rectHeight, new cv.Vec(0, 255, 0), lineWidth)

    return outputImage;
}