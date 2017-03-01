var express = require('express');
var router = express.Router();
var Meeting = require('../model/Meeting');
var MeetingTable = require('../model/MeetingTable');
var MeetingAccessor = require('../code/meetingAccessor');
var accessor = new MeetingAccessor();

router.post('/save', function (req, res) {
    var meeting = new Meeting(
        req.body.title,
        req.body.userName,
        req.body.introduction,
         new MeetingTable(req.body.tableRoom),
        [req.body.startTime, req.body.endTime],
        req.body.date
    );
    //如果有id，则更新
    if (req.body.id) {
        meeting.id = req.body.id;
        accessor.update(meeting).then(_=> {
            res.json({ success: true });
        });
    } else {
        accessor.add(meeting).then(_=> {
            res.json({ success: true, id: meeting.id });
        });
    }
});

router.post('/delete', function (req, res) {
    accessor.remove(req.body.id);
    res.json({ success: true });
});

module.exports = router;