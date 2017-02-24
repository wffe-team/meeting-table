var express = require('express');
var router = express.Router();
var ConferenceAccessor = require('../code/conferenceAccessor');
var accessor = new ConferenceAccessor();
var conferenceTables = require('../data/conferenceTables');

/* GET home page. */
router.get('/', function (req, res) {
    accessor.get(4).then((data) => {
        res.render('index', {
            data: data,
            conferenceTables: conferenceTables
        });
    });
});
module.exports = router;