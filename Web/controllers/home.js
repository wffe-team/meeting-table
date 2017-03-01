var express = require('express');
var router = express.Router();
var MeetingAccessor = require('../code/meetingAccessor');
var accessor = new MeetingAccessor();
var meetingTables = require('../data/meetingTables');

/* GET home page. */
router.get('/', function (req, res) {
    accessor.get(4).then((data) => {
        res.render('index', {
            data: data,
            meetingTables: meetingTables
        });
    });
});
module.exports = router;