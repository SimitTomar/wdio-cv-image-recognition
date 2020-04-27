import sharp from 'sharp';

export default function getImageSize(imagePath) {
    return new Promise((resolve, reject) => {
         sharp(imagePath).metadata()
            .then(info => {
                resolve(info);
            }).catch((err) => {
                reject(err)
            })
    });
}