import path from 'path';

//TODO: Split through .png
export default async function getElementName(elementLocatorImagePath) {
    return await path.basename(elementLocatorImagePath).split('.')[0];
}