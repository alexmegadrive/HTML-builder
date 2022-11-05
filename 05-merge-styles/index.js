const fs = require('fs')
const path = require('path');
const {readdir} = require('node:fs/promises')



let stylesPath = path.join(__dirname, 'styles')
let bundlePath = path.join(__dirname, 'project-dist')

mergeCSS()

async function mergeCSS() {

    try {
        const files = await readdir(stylesPath, {});
        for (const file of files) {
            try {
                const fileExtension = file.split('.')[1]
                if (fileExtension.toLowerCase() == 'css') {

                    const readableStream = fs.createReadStream(`${stylesPath}\\${file}`, 'utf-8');
                    readableStream.on('data', chunk => {
                        fs.appendFile(
                            path.join(bundlePath, 'bundle.css'),
                            chunk,
                            function (error) {
                                if (error) throw error
                            }
                        )
                    });
                    console.log(`файл ${file} скопирован в bundles.css`);

                }
            } catch (error) {
                console.log(error);
            }
        }

    } catch (err) {
        console.error(err);
    }





}