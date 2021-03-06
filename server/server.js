// Adding dependencies
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const env = require('dotenv');
const express = require('express');
const http = require('http');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const path = require("path");

// Configure environment
env.config();
const port = process.env.PORT;

// Adding modules
const admin = require('./admin.js');
const crawl = require('./crawl.js');
const schedule = require('./schedule.js');
const user = require('./user.js');

// Configure app
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Starting http server
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

// Serving static files
app.use(express.static('public'));

// Validate
function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(errors.array()[0]);
    }
    next();
}

// APIs
app.get('/api/schedule/all_courses', schedule.allCourses);

app.get('/api/schedule/all_departments', schedule.allDepartments);

app.put('/api/schedule/select',
    user.authenticateMiddleware,
    body('courseId').isInt({ min: 20000, max: 100000 }).toInt(),
    body('groupId').isInt({ min: 1, max: 100 }).toInt(),
    validate,
    schedule.select);

app.delete('/api/schedule/unselect',
    user.authenticateMiddleware,
    body('courseId').isInt({ min: 20000, max: 100000 }).toInt(),
    body('groupId').isInt({ min: 1, max: 100 }).toInt(),
    validate,
    schedule.unselect);

app.get('/api/schedule/my_selections',
    user.authenticateMiddleware,
    schedule.mySelections);

app.delete('/api/admin/dropsemester',
    user.authenticateAdminMiddleware,
    admin.dropSemester);

app.put('/api/crawl',
    user.authenticateAdminMiddleware,
    crawl.requestCrawl);

app.post('/api/user/signup',
    body('email').isEmail().normalizeEmail().withMessage('پست الکترونیک وارد شده معتبر نیست.'),
    body('password').isLength({ min: 8, max: 32 }).withMessage('گذرواژه باید بین 8 تا 32 کاراکتر داشته باشد.'),
    validate,
    user.signup);

app.post('/api/user/signin',
    body('email').isEmail().normalizeEmail().withMessage('پست الکترونیک وارد شده معتبر نیست.'),
    body('password').isLength({ min: 8, max: 32 }).withMessage('گذرواژه باید بین 8 تا 32 کاراکتر داشته باشد.'),
    validate,
    user.signin);

app.get('/api/user/signout', user.signout);

app.post('/api/user/forget_password/request',
    body('email').isEmail().normalizeEmail().withMessage('پست الکترونیک وارد شده معتبر نیست.'),
    validate,
    user.requestForgetPassword);

app.get('/api/user/forget_password/serve/:token', user.serveForgetPassword);

app.get('/api/user/verify/serve/:token', user.serveVerifyAccount);

app.post('/api/user/change_password',
    body('password').isLength({ min: 8, max: 32 }).withMessage('گذرواژه باید بین 8 تا 32 کاراکتر داشته باشد.'),
    validate,
    user.authenticateMiddleware,
    user.changePassword);

app.get('/api/user/my_account',
    user.authenticateMiddleware,
    user.myAccount);

app.put('/api/user/update_account',
    user.authenticateMiddleware,
    body('firstName').isLength({max: 30}).withMessage('نام وارد شده معتبر نیست.'),
    body('lastName').isLength({max: 30}).withMessage('نام خانوادگی معتبر نیست.'),
    body('stdId').isNumeric().isLength({min: 8, max: 8}).withMessage('شماره دانشجویی معتبر نیست'),
    body('major').isLength({max:50}).withMessage('رشته تحصیلی معتبر نیست.'),
    body('grade').isBoolean(),
    validate,
    user.updateAccount,
);

// Test
app.get('/test/ping', (req, res) => {
    res.send('pong');
});
