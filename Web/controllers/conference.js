var express = require('express');
var router = express.Router();
var Conference = require('../model/Conference');
var ConferenceTable = require('../model/ConferenceTable');
var ConferenceAccessor = require('../code/conferenceAccessor');
var accessor = new ConferenceAccessor();

router.get('/save', function (req, res) {
    var conference = new Conference(
        req.query.title,
        req.query.userName,
        req.query.introduction,
         new ConferenceTable(req.query.tableRoom),
        [req.query.startTime, req.query.endTime],
        req.query.date
    );
    //如果有id，则更新
    if (req.query.id) {
        accessor.update(conference).then(_=> {
            res.json({ success: true });
        });
    } else {
        accessor.add(conference).then(_=> {
            res.json({ success: true });
        });
    }
});

router.get('/delete', function (req, res) {
    accessor.remove(req.query.id);
    res.json({ success: true });
});

module.exports = router;