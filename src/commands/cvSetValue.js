import findElementLocatorPoints from '../utils/findElementLocatorPoints'
import createDummyElement from '../utils/createDummyElement'
import getPageScreenshot from '../utils/getPageScreenshot'
import getElementName from '../utils/getElementName'
import override from 'json-override';

const config = require('../index');

/**
 * @alias browser.cvEnterImage
 * @param {String=} elementLocatorImagePath
 * @param {String=} inputValue
 * @param {Object=} imageArgs
 */

 

// Note: function name must be async to signalize WebdriverIO that this function returns a promise
export default async function async(elementLocatorImagePath, inputValue, imageArgs) {

    let args = null;
    
    if(imageArgs){
        args = override(config.options, imageArgs, true);
    } else{
        args = config.options;
    }
    

    let elementKey = await getElementName(elementLocatorImagePath);

    if (typeof elementLocatorImagePath !== 'undefined') {
        await browser.waitUntil(async function () {

            await getPageScreenshot(elementKey);

            // find the x,y points for Element on the web page wrt Open CV
            let elementLocatorPoints = await findElementLocatorPoints(elementLocatorImagePath, args.clickPoint, args.imageReductionPerformanceFactor);

            if (elementLocatorPoints != undefined && elementLocatorPoints.maxVal > args.minMatchConfidenceLevel) {
                // create the Dummy Element which will be used to perform this operations
                await browser.execute(createDummyElement, elementKey, elementLocatorPoints);

                //scroll to get the element into view
                await browser.scroll(elementLocatorPoints.x, elementLocatorPoints.y);

                // left click on the Dummy element on its respective x,y coordinates
                await browser.leftClick(`#${elementKey}Dummy`, -1, -1);

                let result = await browser.elementActive();
                
                let activeElement = result.value && (result.value.ELEMENT || result.value["element-6066-11e4-a52e-4f735466cecf"]);
                // Newer versions of the webdriver like Gecko/IEDriver return the element as "element-6066-11e4-a52e-4f735466cecf" (which is documented in the W3C specs) instead of "ELEMENT".
                activeElement ? browser.elementIdValue(activeElement, inputValue) : false;

                return true;
            }

        }, args.commandTimeout, `${elementKey} Element not visible after ${args.commandTimeout} ms`);
    }

    return;
}