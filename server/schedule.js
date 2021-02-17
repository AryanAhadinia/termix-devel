const { MongoClient } = require("mongodb");

const database = require("./database.js");

function allCourses(req, res) {
    database.courses((err, result) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.send(result);
        }
    });
}

function allDepartments(req, res) {
    database.departments((err, result) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.send(result);
        }
    });
}

function select(req, res) {
    if (Object.keys(req.body).length != 2) {
        return res.sendStatus(400);
    }
    MongoClient.connect(dbURL, (err1, db) => {
        if (err1) {
            res.sendStatus(500);
            try {
                db.close();
            } catch (e) { }
            return;
        }
        const selectObject = {
            'email': req.user.email,
            'courseId': req.body.courseId,
            'groupId': req.body.groupId
        };
        db.collection('Selection').update(selectObject, selectObject,
            { upsert: true }, (err2, input) => {
                if (err2) {
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
                try {
                    db.close();
                } catch (e) { }
            },
        );
    });
}

function unselect(req, res) {
    if (Object.keys(req.body).length != 2) {
        return res.sendStatus(400);
    }
    MongoClient.connect(dbURL, (err1, db) => {
        if (err1) {
            res.sendStatus(500);
            try {
                db.close();
            } catch (e) { }
            return;
        }
        const courseObject = {
            'email': req.user.email,
            'courseId': req.body.courseId,
            'groupId': req.body.groupId
        };
        db.collection('Selection').deleteOne(courseObject, (err2, deleted) => {
            if (err2) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
            try {
                db.close();
            } catch (e) { }
        });
    });
}

function mySelections(req, res) {
    MongoClient.connect(dbURL, (err1, db) => {
        if (err1) {
            res.sendStatus(500);
            try {
                db.close();
            } catch (e) { }
            return;
        }
        const queryObject = { 'email': req.user.email };
        db.collection('Selection').find(queryObject, { '_id': 0, 'email': 0 }).toArray(
            (err2, mySelections) => {
                if (err2) {
                    res.sendStatus(500);
                } else {
                    res.send(JSON.stringify(mySelections));
                }
                try {
                    db.close();
                } catch (e) { }
            }
        );
    });
}

module.exports = {
    "allCourses": allCourses,
    "allDepartments": allDepartments,
    "select": select,
    "unselect": unselect,
    "mySelections": mySelections,
}
