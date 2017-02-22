var express = require('express');
var router = express.Router();
var Conference = require('../model/Conference');
var ConferenceTable = require('../model/ConferenceTable');
var ConferenceAccessor = require('../code/conferenceAccessor');
var accessor = new ConferenceAccessor();

router.get('/save', function (req, res) {
    accessor.add(new Conference(
        req.query.meetingtt,
        req.query.meetinguser,
        '',
         new ConferenceTable(231),
        [req.query.meetingst, req.query.meetinget],
        req.query.meetingdate
    )).then(_=> {
        res.json({ success:true });
    });
});

router.get('/delete', function (req, res) {
    accessor.remove(req.query.id);
    res.json({ success: true });
});

module.exports = router;