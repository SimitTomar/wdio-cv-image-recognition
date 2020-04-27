import fs from 'fs';
import selfHealBase from '../utils/selfHealBase';
import chalk from 'chalk';

const config = require('../index');

/**
 * @alias browser.selfHealClick
 * @param {String=} elementLocator
 * @param {String=} inputValue
 * @param {Object=} imageArgs
 */

// Note: function name must be async to signalize WebdriverIO that this function returns a promise
export default async function async(elementLocator, inputValue, imageArgs) {

    let args = null;
    let elementLocatorImagePath = null;

    try {

        if(imageArgs){
            args = override(config.options, imageArgs, true);
        } else{
            args = config.options;
        }

        elementLocatorImagePath = await selfHealBase(elementLocator, args);
        if(elementLocatorImagePath === 'ELEMENT_FOUND'){
            await browser.setValue(elementLocator, inputValue);
        } else if(elementLocatorImagePath === 'SELF_HEAL_ERROR' || elementLocatorImagePath === 'ELEMENT_AND_IMAGE_LOCATOR_NOT_FOUND'){
            throw new Error(chalk.red(`Error occurred while processing selfHealClick command`))
        } else{
            // setting Command timeout to 1 sec since waitForVisible command available inside selfHealBase function
            // has already waited for the requested timeout duration
            args.commandTimeout = 1000
            await browser.cvSetValue(elementLocatorImagePath, inputValue, args);
            if (fs.existsSync(elementLocatorImagePath)) {
                fs.unlink(elementLocatorImagePath, function (err) {
                    if (err)
                        return chalk.red(err);
                });
            }
        }
    } catch (err) {
        throw new Error (chalk.red(err));
    }
}