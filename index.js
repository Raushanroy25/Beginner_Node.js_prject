/**
 * MIT LICENSE Based website
 * @author Raushan roy
 * @Rollno 2218218
 * @projectName PhotoCraft
 * @sessionYear 2018 to 2022
 * @sessionMonth  Dec to july
 * @certification  udemy online tutorialbased cerification
 * @certificateNumber UC-P4RYSOHP
 * @certificateUrl  https://ude.my/UC-P4RYSOHP
 * @description photo share , store and creatrivity based college final year project
 * @CollegeName Swami Devi Dayal Institute of Engineering And technology
 * @Department Computer Science Engineering
 */

/**
 * npm module
 */
const express = require('express')
const https = require('https')
const chalk = require('chalk')
const exphbs = require('express-handlebars')
const fs = require('fs')
const path = require('path')
const cookieParser = require('cookie-parser')
const expsession = require('express-session')
const helmet = require('helmet')
const multer = require('multer')
const base64 = require('base-64')
const utf8 = require('utf8')
const morgan = require('morgan')
const expressfavicon = require('express-favicon')
const os = require('os')
/**
 * Custom module
 */

let { AccountHandle } = require('./node_js/_handle')
let { ranks } = require('./node_js/ranks')
// end of file
let { upload_oper } = require('./node_js/upload')

let { deletePic } = require('./node_js/delete_item')

/**
 * express app created
 *  */

const app = express()

const PORT = 80 // port number can be you can change according

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
    flags: 'a',
})

app.use(morgan('combined', { stream: accessLogStream })) // on the top because logging

app.use(expressfavicon(__dirname + '/views/static/img/favicon.ico'))

app.use(cookieParser()) // cookie parser

app.set('view engine', 'handlebars') // for templating engines

app.engine('handlebars', exphbs()) // its uses templating engine express-handlebars

app.use('/static', express.static(__dirname + '/views/static/')) // serving static file only

app.use('/image', express.static(__dirname + '/database/storage/')) // serving static file image

app.set('trust proxy', 1) //  for helmet js for security proving on attacking network

app.use(helmet()) // helmetjs default security settings

/**
 * @function multer disk storage system
 * @params 1. obj , 2. callback
 * no returns
 */
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '/database/storage/'))
    },
    filename: function(req, file, cb) {
        let save_disk = Date.now() + '-' + file.originalname
        req.session.uploadFilename = save_disk

        cb(null, save_disk)
    },
})

// calling multyer when upload
let upload = multer({
    storage: storage,
})
// express session secret key using SHA256
// hellohowareyoubuddyiamlegend
app.use(
    expsession({
        secret: 'dc1059dece6f0420d044531487bd51b75411316e',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
        },
    }),
)

// for home routing
app.get('/', (req, res) => {
    res.render('home')
})

// for signup
app.get('/signup', (req, res) => {
    res.render('signup', {
        title: 'sign up',
    })
})
// for sign in
app.get('/signin', (req, res) => {
    res.render('signin', {
        title: 'signin',
    })
})
// verfity login user
app.post('/verify', AccountHandle.account_verification)

//verify account creation and create account
app.post('/accounts_create', AccountHandle.account_creation)

// serving dashbaord with checking login with express-seesion
app.get('/dashboard', AccountHandle.cookie_exists, (req, res) => {
    // AccountHandle.cookie_decrypter(req.cookies)
    res.render('dashboard', {
        title: 'dashboard',
        username: JSON.parse(utf8.decode(base64.decode(req.cookies.auth))),
    })
})
// serving ranks webpage with same checking logion

app.get('/ranks', ranks.check_login, (req, res) => {
    res.render('ranks', {
        title: 'Ranks',
        username: JSON.parse(utf8.decode(base64.decode(req.cookies.auth))),
    })
})

// show profile that shows clicked single user profile
app.get('/showprofile/:id', ranks.check_login, (req, res) => {
    res.render('showprofile', {
        title: req.params.id,
        username: JSON.parse(utf8.decode(base64.decode(req.cookies.auth))),
    })
})
// show profile based same working
app.post('/send_profile_user', ranks.showprof, (req, res, next) => {})

// logout functionality
app.get('/logout', (req, res) => {
    res.clearCookie('auth').redirect('/')
    req.session.destroy()
})

/**
 * upload file here to save into disk
 */

app.post(
    '/upload',
    upload.single('avatar'),
    upload_oper.save_to_file,
    (req, res) => {
        console.log(req.query.q)
        res.send(req.session.detail)
        req.session.detail = null
    },
)
/**
 * when user logged in and dashbaord shows user file that has been uploaded
 */
app.post('/list_logged_user', upload_oper.getlists, (req, res) => {
    res.send('okay')
})
/**end */
/**
 * like the photo and its ooperations
 */
app.post('/like', upload_oper.like_dislike, (req, res) => {})
/**
 * unlike photos
 */
app.post('/unlike', upload_oper.unlike)
/** end of unlike pgotos */
/**end of like or dislike */
app.post('/ranks_lists', ranks.detail, (req, res) => {})

/**
 * check who liked your photos
 */
app.post('/liked_', upload_oper.checkLike, (req, res) => {})
/**emd */
app.get('/download', ranks.download, () => {})
/**
 * delete items file
 */
app.post('/delete_f', deletePic.deleteItem, (req, res) => {})

app.post('/visible', deletePic.visible, (req, res) => {})
/**
 * not found page
 */
app.get('*', (req, res) => {
    res.render('not_found')
})

app.listen(PORT, () => {
    if (os.platform() == 'win32') {
        process.stdout.write('\033c')
    } else {
        console.clear()
    }

    let d = new Date()
    let hrs = d.getHours()
    let min = d.getMinutes()
    let sec = d.getSeconds()

    const format = `[${hrs}:${min}:${sec}]`
    console.log(
        chalk.grey(format),
        chalk.yellow('Server is Running on Port'),
        chalk.green(`[${PORT}]`),
        chalk.red(`platform ${os.platform()}`),
        chalk.blue(`Arch ${os.arch()}`),
    )
})
