import JSONPath from 'advanced-json-path'
import fs from 'fs';
import options from './paths'
import createDirectory from './createDirectory';

export default async function getPageScreenshot(elementKey) {
    let pageScreenshot, buf;
    let browserName = browser.desiredCapabilities.browserName;
    let placeholder = 'This_Is_Browser_Log';
    await createDirectory(`${options().originalWebpageScreenshotFolder}`)

    for (let i = 0; i < 50; i++){
        try {
            await browser.execute(function () {
                document.head.appendChild(Object.assign(
                    document.createElement('script'),
                    { src: 'https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-alpha.12/dist/html2canvas.min.js' }
                ));
            })

            if (browserName == 'firefox') {
                let logs = await browser.execute(function () {
                    return html2canvas(document.body).then(function (canvas) {
                        return canvas.toDataURL().replace('data:image/png;base64,', '');
                    });
                })
                buf = Buffer.from(logs.value, 'base64');
            }
            else {

                await browser.execute(function () {
                    html2canvas(document.body).then(function (canvas) {
                        pageScreenshot = canvas.toDataURL();
                        pageScreenshot = pageScreenshot.replace('data:image/png;base64,', '');
                        console.log('This_Is_Browser_Log' + pageScreenshot);
                    });
                })

                let logs = await browser.log('browser');
                let result = JSONPath(JSON.parse(JSON.stringify(logs.value)), '$..message')

                for (let i = 0; i < result.length; i++) {
                    if (result[i].toString().includes(placeholder)) {
                        const matches = result[i].match(/"(.*?)"/);
                        pageScreenshot = matches ? matches[1].replace(placeholder, '') : result[i].replace(placeholder, '');
                        buf = Buffer.from(pageScreenshot, 'base64');
                        break;
                    }
                }
            }
            if (buf != undefined)
                break;
            
        } catch (err) {
            // throw new Error(err.stack)
        }
    }

    fs.writeFileSync(`${options().originalWebpageScreenshotFolder}${elementKey}.png`, buf);
}