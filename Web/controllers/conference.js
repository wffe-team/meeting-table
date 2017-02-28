var express = require('express');
var router = express.Router();
var Conference = require('../model/Conference');
var ConferenceTable = require('../model/ConferenceTable');
var ConferenceAccessor = require('../code/conferenceAccessor');
var accessor = new ConferenceAccessor();

router.post('/save', function (req, res) {
    var conference = new Conference(
        req.body.title,
        req.body.userName,
        req.body.introduction,
         new ConferenceTable(req.body.tableRoom),
        [req.body.startTime, req.body.endTime],
        req.body.date
    );
    //如果有id，则更新
    if (req.body.id) {
        accessor.update(conference).then(_=> {
            res.json({ success: true });
        });
    } else {
        accessor.add(conference).then(_=> {
            res.json({ success: true, id: conference.id });
        });
    }
});

router.post('/delete', function (req, res) {
    accessor.remove(req.body.id);
    res.json({ success: true });
});

module.exports = router;