import fs from 'fs'
import mkdirp from 'mkdirp'

export default async function createDirectory(dirPath) {
    
    if (!fs.existsSync(dirPath)) {
        mkdirp(dirPath, function (err) {
            if (err)
                console.error(err)
        });
    }
}