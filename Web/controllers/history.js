var express = require('express');
var router = express.Router();
var MeetingHistory = require('../code/meetingHistory');
var history = new MeetingHistory();

/* GET home page. */
router.get('/', function (req, res) {
    let meetings = history.getHistory(4);
    res.render('history', {
        data: meetings
    });
});
module.exports = router;