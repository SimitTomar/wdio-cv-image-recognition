export default function getElementCoordinates(clickPoint, imageReductionPerformanceFactor, devicePixelRatio, minMax, elementMat) {
    let percentDistanceFromCornersX, percentDistanceFromCornersY, relativeDistanceFromCornersX, relativeDistanceFromCornersY;;
    const { maxLoc: { x, y } } = minMax;
    let result = {};

    switch (clickPoint) {
        case 'TL':
            percentDistanceFromCornersX = 10;
            percentDistanceFromCornersY = 1.11;
            break;
        case 'TC':
            percentDistanceFromCornersX = 2;
            percentDistanceFromCornersY = 10;
            break;
        case 'TR':
            percentDistanceFromCornersX = 1.11;
            percentDistanceFromCornersY = 10;
            break;
        case 'BL':
            percentDistanceFromCornersX = 10;
            percentDistanceFromCornersY = 1.11;
            break;
        case 'BC':
            percentDistanceFromCornersX = 2;
            percentDistanceFromCornersY = 1.11;
            break;
        case 'BR':
            percentDistanceFromCornersX = 1.11;
            percentDistanceFromCornersY = 1.11;
            break;
        case 'CL':
            percentDistanceFromCornersX = 10;
            percentDistanceFromCornersY = 2;
            break;
        case 'CR':
            percentDistanceFromCornersX = 1.11;
            percentDistanceFromCornersY = 2;
            break;
        default:
            if (clickPoint instanceof Object) {
                relativeDistanceFromCornersX = clickPoint.x;
                relativeDistanceFromCornersY = clickPoint.y;
            } else {
                percentDistanceFromCornersX = 2;
                percentDistanceFromCornersY = 2;
            }
    }

    if (clickPoint instanceof Object) {
        result.x = (Math.round((x + (relativeDistanceFromCornersX / imageReductionPerformanceFactor)) / devicePixelRatio)) * imageReductionPerformanceFactor
        result.y = (Math.round((y + (relativeDistanceFromCornersY / imageReductionPerformanceFactor)) / devicePixelRatio)) * imageReductionPerformanceFactor
        result.pointX = x + (relativeDistanceFromCornersX / imageReductionPerformanceFactor)
        result.pointY = y + (relativeDistanceFromCornersY / imageReductionPerformanceFactor)
    } else {
        result.x = (Math.round((x / devicePixelRatio) + elementMat.cols / (devicePixelRatio * percentDistanceFromCornersX))) * imageReductionPerformanceFactor
        result.y = (Math.round((y / devicePixelRatio) + elementMat.rows / (devicePixelRatio * percentDistanceFromCornersY))) * imageReductionPerformanceFactor
        result.pointX = x + elementMat.cols / percentDistanceFromCornersX
        result.pointY = y + elementMat.rows / percentDistanceFromCornersY
    }

    result.maxVal = minMax['maxVal']
    result.rectX = x;
    result.rectY = y;
    result.rectWidth = elementMat.cols;
    result.rectHeight = elementMat.rows;

    return result;

}