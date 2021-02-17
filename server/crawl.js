const { MongoClient } = require("mongodb");
const request = require("request-promise");
const cheerio = require("cheerio");
const { allDepartments } = require("./schedule");

const database = require("./database");

const serverURL = `http://127.0.0.1:${process.env.PORT}`;

const clockRegex = /^(\d+):(\d+)$/;
const courseIdRegex = /\d{5}/;

const dayMap = {
    "0": "شنبه",
    "1": "يکشنبه",
    "2": "دوشنبه",
    "3": "سه",
    "4": "چهار",
    "5": "پنجشنبه",
    "6": "جمعه",
};

async function requestCrawl(req, res) {
    try {
        database.departments(async (err, departments) => {
            if (err) {
                throw err;
            }
            const db = await MongoClient.connect("mongodb://localhost:27017/SeMesterMaster");
            for (let id in departments) {
                await crawlDepartment(id, departments[id], db);
            }
            res.sendStatus(200);
        });
    } catch (e) {
        res.sendStatus(500);
    }
}

async function crawlDepartment(depId, depName, db) {
    try {
        const result = await request.get(`${serverURL}/edu_muck/${depId}.html`);
        const $ = cheerio.load(result);
        $('body > table > tbody > tr > td > form > table > tbody > tr').each((index, element) => {
            if ($($(element).find("td")[0]).text().match(courseIdRegex)) {
                const courseObject = {
                    "depId": +depId,
                    "courseId": +$($(element).find("td")[0]).text(),
                    "groupId": +$($(element).find("td")[1]).text(),
                    "unit": +$($(element).find("td")[2]).text(),
                    "title": $($(element).find("td")[3]).text().replace(/\s+/g, ' ').trim(),
                    "capacity": +$($(element).find("td")[5]).text(),
                    "instructor": $($(element).find("td")[7]).text().replace(/\s+/g, ' ').trim(),
                    "examTime": $($(element).find("td")[8]).text().replace(/\s+/g, ' ').trim(),
                    "classTimeArray": parseSessions($($(element).find("td")[9]).text().replace(/\s+/g, ' ').trim()),
                    "info": $($(element).find("td")[10]).text().replace(/\s+/g, ' ').trim(),
                    "onRegister": $($(element).find("td")[11]).text().replace(/\s+/g, ' ').trim()
                }
                pushToDatabase(courseObject, db);
            }
        });
    } catch (e) {
        return depId;
    }
}

async function pushToDatabase(course, db) {
    await db.collection('Course').updateOne({ "courseId": course.courseId, "groupId": course.groupId }, course, { "upsert": true });
}

function parseDay(dayText) {
    for (let key in dayMap) {
        if (dayText == dayMap[key]) {
            return key;
        }
    }
    return undefined;
}

function parseSessions(text) {
    try {
        const words = text.split(' ');
        const blocks = [];
        let block;
        let skip = false;
        for (let wordIndex in words) {
            if (!skip) {
                let word = words[wordIndex];
                let day;
                let match;
                block = block || { "days": [], "startHour": "", "startMin": "", "endHour": "", "endMin": "" };
                if (word == 'و' || word == 'تا') {
                    continue;
                }
                if ((match = clockRegex.exec(word))) {
                    if (!block.startHour) {
                        block.startHour = +match[1];
                        block.startMin = +match[2];
                    } else if (!block.endHour) {
                        block.endHour = +match[1];
                        block.endMin = +match[2];
                        blocks.push(block);
                        block = undefined;
                    }
                } else if ((day = parseDay(word)) !== undefined) {
                    block.days.push(+day);
                    if (word == 'سه' || word == 'چهار') {
                        skip = true;
                    }
                }
            } else {
                skip = false;
            }
        }
        return blocks;
    } catch (e) {
        return [];
    }
}

module.exports = {
    "requestCrawl": requestCrawl
}