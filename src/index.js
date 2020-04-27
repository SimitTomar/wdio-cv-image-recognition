import cvClick from './commands/cvClick';
import cvSetValue from './commands/cvSetValue';
import selfHealClick from './commands/selfHealClick';
import selfHealSetValue from './commands/selfHealSetValue';
import fs_extra from 'fs-extra';
let options = {}

class WDIORecognition {
    constructor(browser) {
        if (!browser) {
            throw new Error('A WebdriverIO instance is needed to initialise wdio-image-text-recognition')
        }

        // add commands to WebdriverIO instance
        browser.addCommand("cvClick", cvClick);
        browser.addCommand("cvSetValue", cvSetValue);
        browser.addCommand("selfHealClick", selfHealClick);
        browser.addCommand("selfHealSetValue", selfHealSetValue);

    }
}

// export init function for initialization
export function init(webdriverInstance, opts) {
    // TODO: Create function to Validate opts and then Set Options
    options = opts;

    Promise.all([
        fs_extra.remove(options.elementMatchPointsDir, err => { 
            if(err){
                console.log('Error Occurred while deleting Output Folder', err);
            }
        }),
        fs_extra.remove('.tmp', err => {
            if(err){
                console.log('Error Occurred while deleting tmp Folder', err);
            }
         })
    ])
    return new WDIORecognition(webdriverInstance);

}



export {
    options
}