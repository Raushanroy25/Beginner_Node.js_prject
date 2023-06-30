const chalk = require('chalk')
const os = require('os')
const emoji = require('node-emoji')
class stop_info {
    constructor() {
        let d = new Date()
        let hrs = d.getHours()
        let min = d.getMinutes()
        let sec = d.getSeconds()

        let PORT = 5000

        const format = `[${hrs}:${min}:${sec}]`

        let t = `
            ${chalk.grey(format)} ${chalk.yellow(
            'Server is Running on Port',
        )} ${chalk.green(`[${PORT}]`)} ${chalk.red(
            `platform ${os.platform()}`,
        )} ${chalk.blue(`Arch ${os.arch()}`)} ${emoji.emojify(
            ':heavy_check_mark:',
        )}
        `
        let star = `${chalk.yellow('\nAuthor Aniket Raj')}
            ${chalk.grey(
                '*********************************************************************',
            )}
                                                                            
                ${t}                                                        
                                                                             
            ${chalk.grey(
                '*********************************************************************',
            )}
        `
        console.log(star)
    }
}

const stop = new stop_info()
