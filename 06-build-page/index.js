const fs = require('fs')
const fsPromises = require("fs").promises;
const path = require('path');

const {
    copyFile,
    readdir,
    mkdir,
    open
} = require('node:fs/promises')



const stylesPath = path.join(__dirname, 'styles')
const componentsPath = path.join(__dirname, 'components')
const assetsPath = path.join(__dirname, 'assets')
const templatePath = path.join(__dirname, 'template.html')
const distPath = path.join(__dirname, 'project-dist')
const assetsDistPath = path.join(distPath, 'assets')



createDir()
buildHtml()
buildCss()
copyDir(assetsPath, assetsDistPath)

function createDir() {
    //создать папку
    fs.mkdir(distPath, {
        recursive: true
    }, err => {
        if (err) throw err;
        console.log('Папка project-dist создана');
    });

}

async function buildCss() {

    //очистить файл
    await fsPromises.writeFile(`${distPath}\\style.css`, '', function (err) {
        if (err) throw err;
        console.log('Файл Style.css очищен');
    });

    //объединить стили
    try {
        const files = await readdir(stylesPath, {});
        for (const file of files) {
            try {
                const fileExtension = file.split('.')[1]
                if (fileExtension.toLowerCase() == 'css') {

                    const readableStream = fs.createReadStream(`${stylesPath}\\${file}`, 'utf-8');
                    readableStream.on('data', chunk => {

                        fs.appendFile(
                            path.join(distPath, 'style.css'),
                            chunk,
                            function (error) {
                                if (error) throw error
                            }
                        )
                    });
                    console.log(`файл ${file} скопирован в style.css`);

                }
            } catch (error) {
                console.log(error);
            }
        }

    } catch (err) {
        console.error(err);
    }

}

async function buildHtml() {

    let promise = new Promise((resolve, reject) => {
        resolve(parseHtmlComponents())
    });
    let COMPONENTS_CONTENT = await promise; // будет ждать, пока промис не выполнится 

    fs.readFile(templatePath, 'utf-8', function (err, data) {
        if (err) throw err;
        let htmlArray = data.split(/[\n]+/)
        for (let i = 0; i < htmlArray.length; i++) {
            if (htmlArray[i].includes('{{')) {
                filteredLine = htmlArray[i].split('')
                    .map(char => !['{', '}', ' '].includes(char) ? char : '')
                    .join('')
                let componentName = filteredLine.slice(0, filteredLine.length - 1)
                htmlArray[i] = COMPONENTS_CONTENT[componentName] + '\r'
            }

        }
        fs.writeFile(`${distPath}\\index.html`, '', function (err) {
            if (err) throw err;
            fs.appendFile(
                path.join(distPath, 'index.html'),
                htmlArray.join('\n'),
                function (error) {
                    if (error) throw error
                    console.log('HTML сгенерирован')
                }
            )
        });

    })
}

async function parseHtmlComponents() {

    let COMPONENTS_CONTENT = {}
    try {
        const files = await readdir(componentsPath, {});
        for (const file of files) {
            try {
                const fileName = file.split('.')[0]
                const fileExtension = file.split('.')[1]
                if (fileExtension.toLowerCase() == 'html') {
                    const readableStream = fs.createReadStream(`${componentsPath}\\${file}`, 'utf-8');
                    readableStream.on('data', chunk => {
                        COMPONENTS_CONTENT[fileName] = chunk
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }

    } catch (err) {
        console.error(err);
    }

    return COMPONENTS_CONTENT
}



async function copyDir(src, dest) {
    await fsPromises.mkdir(dest, {
        recursive: true
    });
   
    let entries = await fsPromises.readdir(src, {
        withFileTypes: true
    });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);
        entry.isDirectory() ?
            await copyDir(srcPath, destPath) :
            await fsPromises.copyFile(srcPath, destPath);
    }
}

