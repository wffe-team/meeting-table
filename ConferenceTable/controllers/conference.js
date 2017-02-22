var express = require('express');
var router = express.Router();
var Conference = require('../model/Conference');
var ConferenceTable = require('../model/ConferenceTable');
var DataAccessor = require('../code/dataAccessor');
var accessor = new DataAccessor();

router.get('/', function (req, res) {
    var accessor = new DataAccessor();
    accessor.get(4).then((data) => {
        res.render('conference/index', { data: data });
    });
});

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