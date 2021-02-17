const { MongoClient } = require("mongodb");
const { emit } = require("nodemon");
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

function drop(callback) {
    redisClient.flushall(callback);
}

module.exports = {
    "courses": courses,
    "departments": departments,
    "drop": drop
}