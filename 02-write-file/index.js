const fs = require('fs')
const path = require('path');
const { stdin, stdout } = process;

const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout,
})

process.on('exit', () => stdout.write('\nУдачи в изучении Node.js!'));
process.on('SIGINT', () => stdout.write('\nУдачи в изучении Node.js!'));

function writeToFile(message) {
    rl.question(message, (answer) => {
        if (answer == 'exit') {
            process.exit()
        }
        fs.appendFile(
            path.join(__dirname, 'text.txt'),
         `${answer}\n`, 
    function(error) { if(error) throw error })

        writeToFile(message)
    })
}

writeToFile("type text: ")