var express = require('express');
var router = express.Router();
var ConferenceAccessor = require('../code/conferenceAccessor');
var accessor = new ConferenceAccessor();

/* GET home page. */
router.get('/', function (req, res) {
    accessor.get(4).then((data) => {
        res.render('index', { data: data });
    });
});
module.exports = router;