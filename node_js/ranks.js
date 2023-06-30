const fs = require('fs')
const path = require('path')

class Ranks {
    constructor() {}
    /**
     * detail this is when user view the rank page where all the pic share to all and user like thme and ranks it
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    detail(req, res, next) {
        fs.readdir(
            path.join(__dirname, '..', 'database', 'accounts'),
            (err, data) => {
                if (err) throw err

                let obj = {
                    arr: [],
                }
                for (let i of data) {
                    let image_file = fs.readdirSync(
                        path.join(
                            __dirname,
                            '..',
                            'database',
                            'accounts',
                            i,
                            'storage',
                        ),
                    )

                    if (image_file.length == 0) {
                    } else {
                        for (let j of image_file) {
                            let user_info = fs
                                .readFileSync(
                                    path.join(
                                        __dirname,
                                        '..',
                                        'database',
                                        'accounts',
                                        i,
                                        'storage',
                                        j,
                                    ),
                                )
                                .toString()

                            obj.arr.push(user_info)
                        }
                    }
                }

                res.send(obj)
            },
        )
    }
    /**
     * check login means before enter into the ranks page login before
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    check_login(req, res, next) {
        if (req.session.user != undefined) {
            next()
        } else {
            res.redirect('/signin')
        }
    }
    /**
     * showprof when user click on sigle user account email then send the json file of all pic that user share and uploaded
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    showprof(req, res, next) {
        let obj = {
            arr: [],
        }
        let json = fs.readdirSync(
            path.join(
                __dirname,
                '..',
                'database',
                'accounts',
                req.query.q.trim(),
                'storage',
            ),
        )

        for (let i of json) {
            let readJson = JSON.parse(
                fs
                    .readFileSync(
                        path.join(
                            __dirname,
                            '..',
                            'database',
                            'accounts',
                            req.query.q.trim(),
                            'storage',
                            i,
                        ),
                    )
                    .toString(),
            )

            obj.arr.push(readJson)
        }
        res.send(JSON.stringify(obj))
    }
    download(req, res, next) {
        let filename = JSON.parse(req.query.q)

        let p = path.join(
            __dirname,
            '..',
            'database',
            'storage',
            filename.filename,
        )

        filename.filename = filename.filename.replace('-', '')

        res.download(p, filename.filename, err => {
            if (err) throw err
        })
    }
}
exports.ranks = new Ranks()
