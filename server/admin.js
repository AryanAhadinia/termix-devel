const { MongoClient } = require("mongodb");

function dropSemester(req, res) {
    MongoClient.connect(process.env.DB_URL, function (err1, db) {
        if (err1) {
            res.sendStatus(500);
            try {
                db.close();
            } catch (e) { }
            return;
        }
        db.collection('Course').deleteMany({}, function (err2, deletedCourses) {
            if (err2) {
                res.sendStatus(500);
                try {
                    db.close();
                } catch (e) { }
                return;
            }
            db.collection('Selection').deleteMany({}, function (err3, deletedSelections) {
                if (err3) {
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
                try {
                    db.close();
                } catch (e) { }
            });
        });
    });
}

module.exports = {
    "dropSemester": dropSemester
}