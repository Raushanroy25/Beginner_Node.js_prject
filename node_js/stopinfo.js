const chalk = require('chalk')
const os = require('os')
const emoji = require('node-emoji')

class stop_info {
    constructor() {
        let d = new Date()
        let hrs = d.getHours()
        let min = d.getMinutes()
        let sec = d.getSeconds()

        const format = `[${hrs}:${min}:${sec}]`

        let t = `
            ${chalk.grey(format)} ${chalk.yellow(
            'Server Has Been Stopped',
        )} ${chalk.red(`platform ${os.platform()}`)} ${chalk.blue(
            `Arch ${os.arch()}`,
        )} ${emoji.emojify(':heavy_multiplication_x:')}
        `
        let star = `
              
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
