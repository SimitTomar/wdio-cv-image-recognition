import cv from 'opencv4nodejs';

export default async function drawRectangle(image, x, y, width, height, color, lineWidth) {
    image.drawRectangle(
        new cv.Rect(x, y, width, height),
        color,
        lineWidth,
        cv.LINE_8
    );
    return image;
}