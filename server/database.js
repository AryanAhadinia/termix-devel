const { MongoClient } = require("mongodb");
const redis = require("redis");

const redisClient = redis.createClient(process.env.REDIS_PORT);

redisClient.on("error", (err) => {
    redis.createClient(process.env.REDIS_PORT);
});

function courses(callback) {
    redisClient.get('allCourses', (err, res) => {
        if (err || !res) {
            MongoClient.connect(process.env.DB_URL, (err1, db) => {
                if (err1) {
                    callback(err1, undefined);
                } else {
                    db.collection('Course').find({}, { _id: 0 }).toArray((err2, crs) => {
                        if (err2) {
                            callback(err2, undefined);
                        } else {
                            const crsMap = {}
                            for (let i = 0; i < crs.length; i++) {
                                if (crs[i]['depId'] in crsMap) {
                                    crsMap[crs[i]['depId']].push(crs[i]);
                                } else {
                                    crsMap[crs[i]['depId']] = [crs[i]];
                                }
                            }
                            redisClient.set('allCourses', JSON.stringify(crsMap));
                            redisClient.expire('allCourses', 60);
                            callback(undefined, JSON.stringify(crsMap));
                        }
                    });
                }
            });
        } else {
            callback(undefined, res);
        }
    });
}

function departments(callback) {
    redisClient.get('departments', (err, res) => {
        if (err || !res) {
            MongoClient.connect(process.env.DB_URL, (err1, db) => {
                if (err1) {
                    callback(err1, undefined);
                } else {
                    db.collection('Department').find({}, { _id: 0 }).toArray((err2, depts) => {
                        if (err2) {
                            callback(err2, undefined);
                        } else {
                            const deptsMap = {};
                            for (let i = 0; i < depts.length; i++) {
                                deptsMap[depts[i]['depId']] = depts[i]['depName'];
                            }
                            redisClient.set('departments', JSON.stringify(deptsMap));
                            redisClient.expire('departments', 60);
                            callback(undefined, JSON.stringify(deptsMap));
                        }
                    });
                }
            });
        } else {
            callback(undefined, res);
        }
    });
}

function departmentsList(callback) {
    redisClient.get('departmentsList', (err, res) => {
        if (err || !res) {
            departments((err1, res1) => {
                if (err1) {
                    callback(err1, undefined);
                } else {
                    const depslist = [];
                    for (let id in res1) {
                        list.push(res1[id]);
                    }
                    redisClient.set('departmentsList', JSON.stringify(depslist));
                    redisClient.expire('departmentsList', 60);
                    callback(undefined, JSON.stringify(depslist));
                }
            })
        } else {
            callback(undefined, res);
        }
    });
}

function emailPermission(email, callback) {
    redisClient.get(`e:${email}`, (err, result) => {
        if (err || !result) {
            callback(false, true);
            redisClient.set(`e:${email}`, email);
            redisClient.expire(`e:${email}`, 60);
        } else {
            callback(true, false);
        }
    });
}

function selectPermission(email, callback) {
    if (Math.random() > 0.02) {
        return callback(false, true);
    }
    MongoClient.connect(process.env.DB_URL, (err, db) => {
        if (err) {
            return callback(false, true);
        }
        db.collection('Selection').find({ email: email }).toArray((err, selections) => {
            if (selections.length > 100) {
                db.collection('User').updateOne({ email: email }, { $set: { 'banned': true } }, (err1, res) => {});
                redisClient.sadd("banned", email);
                callback(true, false);
            }
            return callback(false, true);
        });
    });
}

function accessPermission(email, callback) {
    redisClient.sismember("banned", email, (err, res) => {
        if (err || res == false) {
            return callback(false, true);
        }
        selectPermission(email, callback);
    });
}

function drop(callback) {
    redisClient.flushall(callback);
}

module.exports = {
    "courses": courses,
    "departments": departments,
    "departmentsList": departmentsList,
    "emailPermission": emailPermission,
    "selectPermission": selectPermission,
    "accessPermission": accessPermission,
    "drop": drop
}