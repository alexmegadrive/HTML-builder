const fs = require('fs')
const fsPromises = require("fs").promises;
const path = require('path');
const {
    stdin,
    stdout
} = process;
const {
    copyFile,
    readdir,
    mkdir
} = require('node:fs/promises')

let pathName = path.join(__dirname, 'files')
let pathNew = path.join(__dirname, 'files-copy')

copyFolder()
async function copyFolder() {
    fs.mkdir(pathNew, { recursive: true }, err => {
        if(err) throw err; // не удалось создать папку
        console.log('папка создана');
     });

     try {
        const files = await readdir(pathName, {
        });
        for (const file of files) {
        try {
            await copyFile(`${pathName}\\${file}`, `${pathNew}\\${file}`);
            console.log(`файл ${file} скопирован`);
          } catch(error) {
            console.log(error);
          }
       } 
    
    } catch (err) {
        console.error(err);
    }

}


