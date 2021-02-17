const sha256 = require('sha256');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { MongoClient } = require("mongodb");

function signup(req, res) {
    if (Object.keys(req.body).length != 2) {
        return res.sendStatus(400);
    }
    MongoClient.connect(process.env.DB_URL, (err1, db) => {
        if (err1) {
            res.sendStatus(500);
            try {
                db.close();
            } catch (e) { }
            return;
        }
        db.collection('User', (err2, users) => {
            if (err2) {
                res.sendStatus(500);
                try {
                    db.close();
                } catch (e) { }
                return;
            }
            users.findOne({ 'email': req.body.email }, (err3, user) => {
                if (err3) {
                    res.sendStatus(500);
                    try {
                        db.close();
                    } catch (e) { }
                    return;
                }
                if (user) {
                    res.status(409);
                    try {
                        db.close();
                    } catch (e) { }
                    return;
                }
                const userObject = {
                    'email': req.body.email,
                    'password': sha256(req.body.password),
                    'role': 'std',
                };
                users.insertOne(userObject, (err4, userInserted) => {
                    if (err4) {
                        res.sendStatus(500);
                        try {
                            db.close();
                        } catch (e) { }
                        return;
                    }
                    res.cookie('token', getToken(req.body.email, 'std'),
                        { 'maxAge': process.env.TOKEN_EXPIRY, 'httpOnly': true });
                    res.sendStatus(200);
                    try {
                        db.close();
                    } catch (e) { }
                });
            });
        });
    });
}

function signin(req, res) {
    if (Object.keys(req.body).length != 2) {
        return res.status(400);
    }
    MongoClient.connect(process.env.DB_URL, (err1, db) => {
        if (err1) {
            res.sendStatus(500);
            try {
                db.close();
            } catch (e) { }
            return;
        }
        db.collection('User').findOne({ 'email': req.body.email }, (err2, user) => {
            if (err2) {
                return res.sendstatus(500);
            }
            if (!user) {
                return res.senStatus(401);
            }
            if (user.password == sha256(req.body.password)) {
                res.cookie('token', getToken(req.body.email, user.role),
                    { 'maxAge': process.env.TOKEN_EXPIRY, 'httpOnly': true });
                res.status(200).send(user.role);
            } else {
                return res.sendStatus(401);
            }
            try {
                db.close();
            } catch (e) { }
        });
    });
}

function signout(req, res) {
    res.cookie('token', '', {expiry: 0});
    res.senStatus(200);
}

function myAccount(req, res) {
    MongoClient.connect(process.env.DB_URL, (err1, db) => {
        if (err1) {
            res.sendStatus(500);
            try {
                db.close();
            } catch (e) { }
            return;
        }
        db.collection('User').findOne({ 'email': req.user.email }, { _id: 0, password: 0 }, (err2, user) => {
            if (err2) {
                res.sendStatus(500);
                try {
                    db.close();
                } catch (e) { }
                return;
            }
            if (!user) {
                return res.sendStatus(401);
            }
            res.send(user)
            try {
                db.close();
            } catch (e) { }
        });
    });
}

function changePassword(req, res) {
    if (Object.keys(req.body).length != 1) {
        return res.status(400).send('درخواست ارسال شده معتبر نیست.');
    }
    MongoClient.connect(process.env.DB_URL, function (err1, db) {
        if (err1) {
            res.sendStatus(500);
            try {
                db.close();
            } catch (e) { }
            return;
        }
        db.collection('User').updateOne({ 'email': req.user.email }, { $set: { 'password': sha256(req.body.password) } }, function (err2, user) {
            if (err2) {
                return res.sendStatus(500);
            }
            if (!user) {
                return res.status(401).send('کاربر مورد نظر یافت نشد');
            }
            res.sendStatus(200);
            try {
                db.close();
            } catch (e) { }
            return;
        });
    });
}

function requestForgetPassword(req, res) {
    if (Object.keys(req.body).length != 1) {
        return res.status(400);
    }
    MongoClient.connect(process.env.DB_URL, function (err1, db) {
        if (err1) {
            res.sendStatus(500);
            try {
                db.close();
            } catch (e) { }
            return;
        }
        db.collection('User').findOne({ 'email': req.body.email }, function (err2, user) {
            if (err2) {
                res.sendStatus(500);
            } else if (!user) {
                res.sendStatus(401);
            } else {
                const token = getToken(req.body.email, user.token);
                const link = `${process.env.URL}/api/user/forget_password/serve/${token}`;
                sendMail(req.body.email, `فراموشی رمز عبور`, formatForgetPasswordEmail(link),
                    (err3, mail) => {
                        if (err3) {
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(200)
                        }
                    });
            }
            try {
                db.close();
            } catch (e) { }
        });
    });
}

function formatForgetPasswordEmail(link) {
    return (` 
    <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
        style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
    
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title>New message</title>
        <!--[if (mso 16)]>
        <style type="text/css">
        a {text-decoration: none;}
        </style>
        <![endif]-->
        <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
        <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
        <o:AllowPNG></o:AllowPNG>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
        <style type="text/css">
        #outlook a {
            padding: 0;
        }
    
        .ExternalClass {
            width: 100%;
        }
    
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
        }
    
        .es-button {
            mso-style-priority: 100 !important;
            text-decoration: none !important;
        }
    
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
    
        .es-desk-hidden {
            display: none;
            float: left;
            overflow: hidden;
            width: 0;
            max-height: 0;
            line-height: 0;
            mso-hide: all;
        }
    
        .es-button-border:hover {
            background: #ffffff !important;
            border-style: solid solid solid solid !important;
            border-color: #3d5ca3 #3d5ca3 #3d5ca3 #3d5ca3 !important;
        }
    
        @media only screen and (max-width:600px) {
    
            p,
            ul li,
            ol li,
            a {
            font-size: 16px !important;
            line-height: 150% !important
            }
    
            h1 {
            font-size: 20px !important;
            text-align: center;
            line-height: 120% !important
            }
    
            h2 {
            font-size: 16px !important;
            text-align: left;
            line-height: 120% !important
            }
    
            h3 {
            font-size: 20px !important;
            text-align: center;
            line-height: 120% !important
            }
    
            h1 a {
            font-size: 20px !important
            }
    
            h2 a {
            font-size: 16px !important;
            text-align: left
            }
    
            h3 a {
            font-size: 20px !important
            }
    
            .es-menu td a {
            font-size: 14px !important
            }
    
            .es-header-body p,
            .es-header-body ul li,
            .es-header-body ol li,
            .es-header-body a {
            font-size: 10px !important
            }
    
            .es-footer-body p,
            .es-footer-body ul li,
            .es-footer-body ol li,
            .es-footer-body a {
            font-size: 12px !important
            }
    
            .es-infoblock p,
            .es-infoblock ul li,
            .es-infoblock ol li,
            .es-infoblock a {
            font-size: 12px !important
            }
    
            *[class="gmail-fix"] {
            display: none !important
            }
    
            .es-m-txt-c,
            .es-m-txt-c h1,
            .es-m-txt-c h2,
            .es-m-txt-c h3 {
            text-align: center !important
            }
    
            .es-m-txt-r,
            .es-m-txt-r h1,
            .es-m-txt-r h2,
            .es-m-txt-r h3 {
            text-align: right !important
            }
    
            .es-m-txt-l,
            .es-m-txt-l h1,
            .es-m-txt-l h2,
            .es-m-txt-l h3 {
            text-align: left !important
            }
    
            .es-m-txt-r img,
            .es-m-txt-c img,
            .es-m-txt-l img {
            display: inline !important
            }
    
            .es-button-border {
            display: block !important
            }
    
            .es-btn-fw {
            border-width: 10px 0px !important;
            text-align: center !important
            }
    
            .es-adaptive table,
            .es-btn-fw,
            .es-btn-fw-brdr,
            .es-left,
            .es-right {
            width: 100% !important
            }
    
            .es-content table,
            .es-header table,
            .es-footer table,
            .es-content,
            .es-footer,
            .es-header {
            width: 100% !important;
            max-width: 600px !important
            }
    
            .es-adapt-td {
            display: block !important;
            width: 100% !important
            }
    
            .adapt-img {
            width: 100% !important;
            height: auto !important
            }
    
            .es-m-p0 {
            padding: 0px !important
            }
    
            .es-m-p0r {
            padding-right: 0px !important
            }
    
            .es-m-p0l {
            padding-left: 0px !important
            }
    
            .es-m-p0t {
            padding-top: 0px !important
            }
    
            .es-m-p0b {
            padding-bottom: 0 !important
            }
    
            .es-m-p20b {
            padding-bottom: 20px !important
            }
    
            .es-mobile-hidden,
            .es-hidden {
            display: none !important
            }
    
            tr.es-desk-hidden,
            td.es-desk-hidden,
            table.es-desk-hidden {
            width: auto !important;
            overflow: visible !important;
            float: none !important;
            max-height: inherit !important;
            line-height: inherit !important
            }
    
            tr.es-desk-hidden {
            display: table-row !important
            }
    
            table.es-desk-hidden {
            display: table !important
            }
    
            td.es-desk-menu-hidden {
            display: table-cell !important
            }
    
            .es-menu td {
            width: 1% !important
            }
    
            table.es-table-not-adapt,
            .esd-block-html table {
            width: auto !important
            }
    
            table.es-social {
            display: inline-block !important
            }
    
            table.es-social td {
            display: inline-block !important
            }
    
            a.es-button,
            button.es-button {
            font-size: 14px !important;
            display: block !important;
            border-left-width: 0px !important;
            border-right-width: 0px !important
            }
        }
        </style>
    </head>
    
    <body
        style="width:100%;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
        <div class="es-wrapper-color" style="background-color:#FAFAFA">
        <!--[if gte mso 9]>
                <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                    <v:fill type="tile" color="#fafafa"></v:fill>
                </v:background>
            <![endif]-->
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top">
            <tr style="border-collapse:collapse">
            <td valign="top" style="padding:0;Margin:0">
                <table class="es-content" cellspacing="0" cellpadding="0" align="center"
                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                <tr style="border-collapse:collapse">
                    <td style="padding:0;Margin:0;background-color:#FAFAFA" bgcolor="#fafafa" align="center">
                    <table class="es-content-body"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"
                        cellspacing="0" cellpadding="0" align="center">
                        <tr style="border-collapse:collapse">
                        <td
                            style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-top:40px;background-color:transparent;background-position:left top"
                            bgcolor="transparent" align="left">
                            <table width="100%" cellspacing="0" cellpadding="0"
                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                            <tr style="border-collapse:collapse">
                                <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                <table
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:left top"
                                    width="100%" cellspacing="0" cellpadding="0" role="presentation">
                                    <tr style="border-collapse:collapse">
                                    <td align="center"
                                        style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0"><img
                                        src="https://nzxygd.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png"
                                        alt
                                        style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"
                                        width="175" height="208"></td>
                                    </tr>
                                    <tr style="border-collapse:collapse">
                                    <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px">
                                        <h1
                                        style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#333333">
                                        فراموشی گذرواژه</h1>
                                    </td>
                                    </tr>
                                    <tr style="border-collapse:collapse">
                                    <td align="center"
                                        style="padding:0;Margin:0;padding-top:25px;padding-left:40px;padding-right:40px">
                                        <p
                                        style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:tahoma, verdana, segoe, sans-serif;line-height:24px;color:#666666">
                                        جهت تغییر گذرواژه، روی لینک زیر کلیک کنید.</p>
                                    </td>
                                    </tr>
                                    <tr style="border-collapse:collapse">
                                    <td align="center"
                                        style="Margin:0;padding-left:10px;padding-right:10px;padding-top:40px;padding-bottom:40px">
                                        <span class="es-button-border"
                                        style="border-style:solid;border-color:#3D5CA3;background:#FFFFFF;border-width:2px;display:inline-block;border-radius:10px;width:auto"><a
                                            href="${link}" class="es-button" target="_blank"
                                            style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';font-size:16px;color:#3D5CA3;border-style:solid;border-color:#FFFFFF;border-width:15px 20px 15px 20px;display:inline-block;background:#FFFFFF;border-radius:10px;font-weight:bold;font-style:normal;line-height:19px;width:auto;text-align:center">تغییر
                                            گذرواژه</a></span></td>
                                    </tr>
                                </table>
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                        <tr style="border-collapse:collapse">
                        <td align="left" style="padding:0;Margin:0;padding-left:10px;padding-right:10px;padding-top:20px">
                            <table cellspacing="0" cellpadding="0" width="100%"
                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                            <tr style="border-collapse:collapse">
                                <td align="left" style="padding:0;Margin:0;width:580px">
                                <table
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:center center"
                                    width="100%" cellspacing="0" cellpadding="0" role="presentation">
                                    <tr style="border-collapse:collapse">
                                    <td class="es-m-txt-c" align="center"
                                        style="padding:0;Margin:0;padding-bottom:5px;padding-top:10px;font-size:0">
                                        <table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0"
                                        role="presentation"
                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                        <tr style="border-collapse:collapse">
                                            <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px"><a
                                                target="_blank" href="https://TWITTER"
                                                style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:16px;text-decoration:none;color:#0B5394"><img
                                                src="https://nzxygd.stripocdn.email/content/assets/img/social-icons/rounded-gray/twitter-rounded-gray.png"
                                                alt="Tw" title="Twitter" width="32" height="32"
                                                style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a>
                                            </td>
                                            <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px"><a
                                                target="_blank" href="https://INSTA"
                                                style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:16px;text-decoration:none;color:#0B5394"><img
                                                src="https://nzxygd.stripocdn.email/content/assets/img/social-icons/rounded-gray/instagram-rounded-gray.png"
                                                alt="Ig" title="Instagram" width="32" height="32"
                                                style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a>
                                            </td>
                                            <td valign="top" align="center" style="padding:0;Margin:0"><a target="_blank"
                                                href="https://GITHUB"
                                                style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-size:16px;text-decoration:none;color:#0B5394"><img
                                                src="https://nzxygd.stripocdn.email/content/assets/img/other-icons/rounded-gray/github-rounded-gray.png"
                                                alt="GitHub" title="GitHub" width="32" height="32"
                                                style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a>
                                            </td>
                                        </tr>
                                        </table>
                                    </td>
                                    </tr>
                                </table>
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                        <tr style="border-collapse:collapse">
                        <td
                            style="Margin:0;padding-top:5px;padding-bottom:20px;padding-left:20px;padding-right:20px;background-position:left top"
                            align="left">
                            <table width="100%" cellspacing="0" cellpadding="0"
                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                            <tr style="border-collapse:collapse">
                                <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                <table width="100%" cellspacing="0" cellpadding="0" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr style="border-collapse:collapse">
                                    <td align="center" style="padding:0;Margin:0">
                                        <p
                                        style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:21px;color:#666666">
                                        ترمیکس، دانشگاه صنعتی شریف، تهران، تهران، با افتخار ساخت ایران<br></p>
                                    </td>
                                    </tr>
                                </table>
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                </table>
            </td>
            </tr>
        </table>
        </div>
    </body>
    
    </html>
    `)
}

function serveForgetPassword(req, res) {
    if (!req.params['token']) {
        res.sendStatus(400);
        return;
    }
    const token = req.params['token'];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
        if (err || user.expiry < +new Date()) {
            return res.sendStatus(403);
        }
        res.cookie('token', getToken(user.email, user.role), { 'maxAge': process.env.TOKEN_EXPIRY, 'httpOnly': true });
        try {
            res.redirect('/user/change_password');
        } catch (e) { }
    });
}

function authenticateMiddleware(req, res, next) {
    const token = req.cookies['token'];
    if (!token) {
        return res.sendStatus(403);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err || user.expiry < +new Date()) {
            return res.sendStatus(403);
        }
        req.user = user;
        res.cookie('token', getToken(user.email, user.role), { 'maxAge': process.env.TOKEN_EXPIRY, 'httpOnly': true });
        next();
    });
}

function authenticateAdminMiddleware(req, res, next) {
    const token = req.cookies['token'];
    if (!token) {
        return res.sendStatus(403);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err || user.expiry < +new Date() || user.role != 'admin') {
            return res.sendStatus(403);
        }
        req.user = user;
        res.cookie('token', getToken(user.email, user.role), { 'maxAge': process.env.TOKEN_EXPIRY, 'httpOnly': true });
        next();
    });
}

function getToken(email, role) {
    const userObject = { 'email': email, 'role': role, 'expiry': +new Date() + process.env.TOKEN_EXPIRY };
    return jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET);
}

function sendMail(emailAddress, subject, bodyText, callBack) {
    const transport = new nodemailer.createTransport({
        'service': 'gmail',
        'auth': {
            'user': process.env.USER,
            'pass': process.env.PASS,
        },
    });
    const mailOption = {
        'from': `Aryan from SeMaster <${process.env.USER}>`,
        'to': emailAddress,
        'subject': subject,
        'html': bodyText,
    };
    transport.sendMail(mailOption, callBack);
}

module.exports = {
    "signup": signup,
    "signin": signin,
    "signout": signout,
    "myAccount": myAccount,
    "changePassword": changePassword,
    "requestForgetPassword": requestForgetPassword,
    "serveForgetPassword": serveForgetPassword,
    "authenticateMiddleware": authenticateMiddleware,
    "authenticateAdminMiddleware": authenticateAdminMiddleware
};
