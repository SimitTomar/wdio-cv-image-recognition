import crypto from 'crypto';
import fs from 'fs';
import sharp from 'sharp';
import _ from 'lodash';
import getPageScreenshot from '../utils/getPageScreenshot';
import options from './paths'
import findDevicePixelRatio from './findDevicePixelRatio';
import getImageSize from './getImageSize';
import createDirectory from './createDirectory';
import chalk from 'chalk';

/**
* @alias browser.selfHealBase
* @param {String=} elementLocator
* @param {Object=} args
*/

// Note: function name must be async to signalize WebdriverIO that this function returns a promise
export default async function async(elementLocator, args) {

    try {

        // Find the Device Pixel Ratio of the screen
        let devicePixelRatio = await findDevicePixelRatio();

        // Get the Path of the Element Locator Directory
        let elementLocatorDir = args.elementLocatorDir.endsWith('/') ? args.elementLocatorDir : args.elementLocatorDir + '/';

        // Form the path of Self Heal Directory
        let selfHealDir = `${elementLocatorDir}selfHeal`;

        // Create the Self Heal Directory
        await createDirectory(selfHealDir)

        // Create a hash of the element name to get a unique string
        let elementName = 'T' + crypto.createHash('md5').update(elementLocator).digest('hex');

        // Form the path of the Element Image Locator with the name of the element's hash
        let elementLocatorImagePath = `${selfHealDir}/${elementName}.png`;

        // Get the Path of the File where the buffer of the Image Locators will be stored
        let selfHealLocatorFilePath = `${selfHealDir}/locators.json`;

        // Create an empty json object for Self Heal Locators
        let selfHealLocatorsJSON = {};


        // Verify if the selfHealLocatorFilePath file exists or not
        if (fs.existsSync(selfHealLocatorFilePath))
            // Read all the existing Image Locator Buffers
            selfHealLocatorsJSON = JSON.parse(fs.readFileSync(selfHealLocatorFilePath));

        try {
            // Wait for the Element to be visible using HTML Locator
            await browser.waitForVisible(elementLocator, args.commandTimeout);
            
        } catch (err) {

            console.log(chalk.red(`${err}, ${chalk.green('Switched to Self Heal Mode!')}`));
            if (selfHealLocatorsJSON.hasOwnProperty(elementName)) {
                // If HTML Locator is not found, then convert the Element Buffer to the Element Locator Image file (.png)
                fs.writeFileSync(elementLocatorImagePath, Buffer.from(selfHealLocatorsJSON[elementName], 'base64'));
                
                // Return the Element Locator Image File Path and isElementDisplayed bool
                return elementLocatorImagePath;
                
            } else {
                console.log(chalk.red(`No key found for ${elementLocator} HTML Element Locator!!`));
                return 'ELEMENT_AND_IMAGE_LOCATOR_NOT_FOUND';
            }
        }


        // Find the x,y coordinates of the Element
        // Find the Width, Height of the Element
        // Save the screenshot of the entire page
        let [elementLocation, elementSize, screenshot] = await Promise.all([
            browser.getLocation(elementLocator),
            browser.getElementSize(elementLocator),
            getPageScreenshot(elementName)
        ]);

        // Get the details (like width, height) of the entire page's screenshot
        let imageSize = await getImageSize(`${options().originalWebpageScreenshotFolder}${elementName}.png`);

        // Find the horizontal margin for the element locator
        let xMarginList = [elementLocation.x, elementSize.width, elementLocation.x, imageSize.width - (elementLocation.x + elementSize.width)];
        xMarginList = xMarginList.filter(function (x) { return x > -1 });
        let xMargin = _.min(xMarginList);

        // Find the vertical margin for the element locator
        let yMarginList = [elementLocation.y, elementSize.height, elementLocation.y, imageSize.height - (elementLocation.y + elementSize.height)];
        yMarginList = yMarginList.filter(function (x) { return x > -1 });
        let yMargin = _.min(yMarginList);

        // Extract the Dimensions of the Element Locator,
        // This will be used for cropping the Element's Image from the entire screenshot
        // Say, for example:
        // x = 100, width = 20, margin = 10
        // left = 100 - 10 = 90
        // width = 20 + (10 * 2) = 40

        // Create the Image Buffer
        await sharp(`${options().originalWebpageScreenshotFolder}${elementName}.png`)
            .extract({
                left: Math.trunc((elementLocation.x - xMargin) * devicePixelRatio),
                top: Math.trunc((elementLocation.y - yMargin) * devicePixelRatio),
                width: Math.trunc((elementSize.width + (xMargin * 2)) * devicePixelRatio),
                height: Math.trunc((elementSize.height + (yMargin * 2)) * devicePixelRatio)
            })
            .toBuffer()
            .then(data => {
                // Add the new {key, value} pair for the element locator (value will be element locator image's buffer)
                selfHealLocatorsJSON[elementName] = Buffer.from(data).toString('base64');

                // Write the selfHealLocatorsJSON in the locators.json
                fs.writeFile(selfHealLocatorFilePath, JSON.stringify(selfHealLocatorsJSON, null, 2), 'utf-8', function (err) {
                    if (err)
                        console.log(err);
                });
            })

            return 'ELEMENT_FOUND';
    }

    catch (err) {

        console.error(chalk.red('Error Found in Self Heal Base', err));
        return 'SELF_HEAL_ERROR';

    }
}