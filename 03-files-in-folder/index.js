const fs = require('fs')
const fsPromises = require("fs").promises;
const path = require('path');
const {
    stdin,
    stdout
} = process;
const {
    copyFile,
    readdir
} = require('node:fs/promises')


pathName = path.join(__dirname, 'secret-folder')

getInfo()

async function getInfo() {
    try {
        const files = await readdir(pathName, {
            withFileTypes: true
        });
        for (const file of files)
            if (file.isFile() == true) {

                (async () => {
                    try {
                        const stats = await fsPromises.stat(pathName + '\\' + file.name)
                        const fileData = file.name.split('.')
                        console.log(`${fileData[0]} - ${fileData[1]} - ${stats.size} bytes`);
                    } catch (error) {
                        console.log(error);
                    }
                })();
            }
    } catch (err) {
        console.error(err);
    }
}