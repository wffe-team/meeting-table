var express = require('express');
var router = express.Router();
var MeetingAccessor = require('../code/meetingAccessor');
var MeetingTable = require('../model/MeetingTable');
var accessor = new MeetingAccessor();
var meetingTables = require('../data/meetingTables');

/* GET home page. */
router.get('/', function (req, res) {
    let mts = [];
    meetingTables.forEach(mt=> {
        mts.push(new MeetingTable(mt.roomNumber + '-' + mt.number));
    });
    accessor.get(4).then((data) => {
        res.render('index', {
            data: data,
            meetingTables: mts
        });
    });
});
module.exports = router;