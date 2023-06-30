const fs = require('fs')
const path = require('path')
const aes = require('aes256')
const base64 = require('base-64')
const utf8 = require('utf8')

class _AccoutHandle {
    constructor() {}
    /**
     * account_creation for creating accounts after verify same email not used
     * @param {*} req
     * @param {*} res
     */
    account_creation(req, res) {
        let user_det = req.query.q.split(' ')

        fs.readdir(
            path.join(__dirname, '..', 'database', 'accounts'),
            (err, data) => {
                let flag = 0

                for (let iter of data) {
                    if (iter == user_det[1]) {
                        flag = 1
                        res.send('account already registered')
                        break
                    }
                }
                if (flag == 0) {
                    fs.mkdirSync(
                        path.join(
                            __dirname,
                            '..',
                            'database',
                            'accounts',
                            user_det[1],
                        ),
                    )

                    fs.mkdirSync(
                        path.join(
                            __dirname,
                            '..',
                            'database',
                            'accounts',
                            user_det[1],
                            'storage',
                        ),
                    )

                    let obj = {
                        name: user_det[0],
                        email: user_det[1],
                        password: user_det[2],
                        mobile: user_det[4],
                    }

                    fs.writeFileSync(
                        path.join(
                            __dirname,
                            '..',
                            'database',
                            'accounts',
                            user_det[1],
                            'user_account.json',
                        ),
                        JSON.stringify(obj),
                    )

                    res.send(true)
                } else {
                    res.send(false)
                }
            },
        )
    }
    /**
     * cookie_exists checking for logged in user after logged out not able to access maon profile of content without login
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    cookie_exists(req, res, next) {
        if (req.session.user != undefined) {
            next()
        } else {
            res.redirect('/signin')
        }
    }
    /**
     * account_vertification this runs when user sign ed in account
     * @param {*} req
     * @param {*} res
     */
    account_verification(req, res) {
        let incomedata = req.query.q.split(' ')
        let email = incomedata[0].trim()
        let pass = incomedata[1].trim()

        fs.readdir(
            path.join(__dirname, '..', 'database', 'accounts'),
            (err, data) => {
                if (err) {
                    throw err
                }

                let not_user = 0

                for (let i of data) {
                    if (i == email) {
                        let json_str = fs.readFileSync(
                            path.join(
                                __dirname,
                                '..',
                                'database',
                                'accounts',
                                email,
                                'user_account.json',
                            ),
                        )

                        let json = JSON.parse(json_str)
                        if (
                            json.email == email &&
                            json.password == pass
                        ) {
                            let bytes = utf8.encode(
                                `{"email" :"${json.email}","pass" : "${json.mobile}"}`,
                            )

                            let auth_cookie = base64.encode(bytes)

                            req.session.user = {
                                email,
                            }
                            not_user = 1
                            res.cookie('auth', auth_cookie).send(
                                'true',
                            )
                        }
                        break
                    }
                }
                if (not_user == 1) {
                } else {
                    res.send('false')
                }
            },
        )
    }
}
/**
 * exporting the class before call its costructor
 */
exports.AccountHandle = new _AccoutHandle()
