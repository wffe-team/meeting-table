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
        res.json({ success: accessor.update(meeting) });
    } else {
        res.json({ success: accessor.add(meeting), id: meeting.id });
    }
});

router.post('/delete', function (req, res) {
    res.json({ success: accessor.remove(req.body.id) });
});

module.exports = router;