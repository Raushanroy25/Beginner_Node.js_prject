const chalk = require('chalk')
const os = require('os')
const fs = require('fs')
const path = require('path')
const emoji = require('node-emoji')

class stop_info {
    constructor() {
        let d = new Date()
        let hrs = d.getHours()
        let min = d.getMinutes()
        let sec = d.getSeconds()

        const format = `[${hrs}:${min}:${sec}]`

        let json_package = JSON.parse(
            fs.readFileSync(path.join(__dirname, '..', 'package.json')),
        )

        let p_name = ''

        let d_obj = json_package.dependencies

        for (let i in d_obj) {
            p_name =
                p_name +
                `\n${chalk.grey(i)} - ${chalk.grey(d_obj[i])} ${emoji.emojify(
                    ':heavy_check_mark:',
                )}`
        }
        let t = `
            
        `
        let star = `
            ${chalk.green('\nPACKAGES HAS BEEN INSTALLED LIST BELOW')}
            ${chalk.grey(
                '\n*********************************************************************',
            )}
                                                                            
                ${p_name}                                                        
                                                                             
            ${chalk.grey(
                '\n*********************************************************************',
            )}
        `
        console.log(star)
    }
}

const stop = new stop_info()
