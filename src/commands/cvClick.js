import findElementLocatorPoints from '../utils/findElementLocatorPoints'
import createDummyElement from '../utils/createDummyElement'
import getPageScreenshot from '../utils/getPageScreenshot'
import getElementName from '../utils/getElementName'
import override from 'json-override';

const config = require('../index');

/**
 * @alias browser.cvClickImage
 * @param {String=} elementLocatorImagePath
 * @param {Object=} imageArgs
 */

// Note: function name must be async to signalize WebdriverIO that this function returns a promise
// export default async function async(elementLocatorImagePath, clickPoint = config.options.clickPoint, imageReductionPerformanceFactor = config.options.imageReductionPerformanceFactor, minMatchConfidenceLevel = config.options.minMatchConfidenceLevel, commandTimeout = config.options.commandTimeout) {
export default async function async(elementLocatorImagePath, imageArgs ) {

    let args = null;
    
    if(imageArgs){
        args = override(config.options, imageArgs, true);
    } else{
        args = config.options;
    }

    //TODO: Check elementLocatorImagePath for .png substring
    // Validate arguments for right values (like strings, range etc.)
    if (typeof elementLocatorImagePath !== 'undefined') {

        let elementKey = await getElementName(elementLocatorImagePath);
        await browser.waitUntil(async function () {

            // get Web Page Screenshot
            await getPageScreenshot(elementKey);

            // find the x,y points for Element on the web page wrt Open CV
            let elementLocatorPoints = await findElementLocatorPoints(elementLocatorImagePath, args.clickPoint, args.imageReductionPerformanceFactor)

            if (elementLocatorPoints != undefined && elementLocatorPoints.maxVal > args.minMatchConfidenceLevel) {
            
                // create the Dummy Element which will be used to perform this operations
                await browser.execute(createDummyElement, elementKey, elementLocatorPoints);

                //scroll to get the element into view 
                await browser.scroll(elementLocatorPoints.x, elementLocatorPoints.y);

                // await browser.moveToObject(`#${elementKey}Dummy`, -1, -1);
                await browser.leftClick(`#${elementKey}Dummy`, -1, -1);
                return true;
            }

        }, args.commandTimeout, `${elementKey} Element not visible after ${args.commandTimeout} ms`);
    }

    return;
}