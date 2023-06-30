const aes = require('aes256')
const path = require('path')
const fs = require('fs')
const base64 = require('base-64')
const utf8 = require('utf8')

class upload_file {
    constructor() {}
    /**
     * save_to_file means file uploaded and refernce the file path to the user account
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    save_to_file(req, res, next) {
        let bytes = base64.decode(req.cookies.auth)
        let auth_cookie = JSON.parse(utf8.decode(bytes))

        let image_det = JSON.parse(req.query.q)
        let cred = {
            filename: req.session.uploadFilename,
            whoupload: auth_cookie.email,
            card_title: image_det.card_title,
            card_decs: image_det.card_detail,
            wholiked: [],
            whodisliked: [],
            likes: 0,
            dislikes: 0,
            visible: false,
        }

        fs.writeFileSync(
            path.join(
                __dirname,
                '..',
                'database',
                'accounts',
                cred.whoupload,
                'storage',
                cred.filename + '.json',
            ),
            JSON.stringify(cred),
        )

        req.session.uploadFilename = null
        req.session.detail = cred
        next()
    }
    /**
     * getlists it will send all the file of user that has been logged in account all file list
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    getlists(req, res, next) {
        let bytes = base64.decode(req.cookies.auth)
        let auth_cookie = JSON.parse(utf8.decode(bytes))

        req.session.listofids = {
            arr: [],
        }

        fs.readdir(
            path.join(
                __dirname,
                '..',
                'database',
                'accounts',
                auth_cookie.email,
                'storage',
            ),
            (err, data) => {
                if (err) throw err

                for (let i of data) {
                    let j = fs
                        .readFileSync(
                            path.join(
                                __dirname,
                                '..',
                                'database',
                                'accounts',
                                auth_cookie.email,
                                'storage',
                                i,
                            ),
                        )
                        .toString()
                    req.session.listofids.arr.push(j)
                }
                res.send(req.session.listofids)
            },
        )
    }
    /**
     * like_dislike this is for only like the photo and then update useraccount like feild
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    like_dislike(req, res, next) {
        let bytes = JSON.parse(utf8.decode(base64.decode(req.cookies.auth)))

        let q = JSON.parse(req.query.q)

        let data = JSON.parse(
            fs
                .readFileSync(
                    path.join(
                        __dirname,
                        '..',
                        'database',
                        'accounts',
                        q.email,
                        'storage',
                        q.filename + '.json',
                    ),
                )
                .toString(),
        )

        let flag = 0
        // if (data.wholiked.length == 0) {
        //     flag = 0
        // }
        for (let i of data.wholiked) {
            if (i == bytes.email) {
                flag = 1
                break
            } else {
            }
        }

        if (flag == 1) {
            res.send(JSON.stringify(data))
        } else {
            data.likes = data.likes + 1

            data.wholiked.push(bytes.email)

            fs.writeFileSync(
                path.join(
                    __dirname,
                    '..',
                    'database',
                    'accounts',
                    q.email,
                    'storage',
                    q.filename + '.json',
                ),
                JSON.stringify(data),
            )

            res.send(JSON.stringify(data))
        }
    }
    /**
     * checkLike this will when the all profile see it will check that user liked or not
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    checkLike(req, res, next) {
        let bytes = JSON.parse(base64.decode(utf8.decode(req.cookies.auth)))

        let json_c = JSON.parse(req.query.q)

        let flag = 0

        for (let i of json_c.filedata.wholiked) {
            if (bytes.email == i) {
                flag = 1
                break
            }
        }
        if (flag == 1) {
            res.send({ liked: true })
        } else {
            res.send({ liked: false })
        }
    }
    /**
     * unlike this will unlike your like photos
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    unlike(req, res, next) {
        let bytes = JSON.parse(utf8.decode(base64.decode(req.cookies.auth)))

        let q = JSON.parse(req.query.q)

        let json_unlike = JSON.parse(
            fs
                .readFileSync(
                    path.join(
                        __dirname,
                        '..',
                        'database',
                        'accounts',
                        q.email,
                        'storage',
                        q.filename + '.json',
                    ),
                )
                .toString(),
        )

        json_unlike.wholiked.splice(json_unlike.wholiked.indexOf(q.email), 1)

        json_unlike.likes = json_unlike.likes - 1

        fs.writeFileSync(
            path.join(
                __dirname,
                '..',
                'database',
                'accounts',
                q.email,
                'storage',
                q.filename + '.json',
            ),
            JSON.stringify(json_unlike),
        )

        res.send(JSON.stringify(json_unlike))
    }
}
exports.upload_oper = new upload_file()
