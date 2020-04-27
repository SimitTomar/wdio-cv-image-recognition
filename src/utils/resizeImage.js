import debug from 'debug';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import getImageSize from './getImageSize';
import options from './paths';
import createDirectory from './createDirectory';

const log = debug('wdio-image-text-recognition:resizeImage');

export default async function resizeImage(inputImagePath, imageReductionPerformanceFactor, outputFolder = options().default) {
    let [imageSize, dir] = await Promise.all([
        getImageSize(inputImagePath),
        createDirectory(outputFolder)
    ]);

    log('start Element Resizing');

    return new Promise((resolve, reject) => {
        sharp(inputImagePath)
            .resize(Math.round(imageSize.width / imageReductionPerformanceFactor), Math.round(imageSize.height / imageReductionPerformanceFactor))
            .toBuffer()
            .then(data => {
                fs.writeFileSync(outputFolder + path.basename(inputImagePath), data)
                resolve();
            }).catch(err => {
                reject(err);
            });
        log('end Element Resizing');
    });
}