var express = require('express');
var fs = require('fs');
var router = express.Router();
var Conference = require('../model/Conference');
var ConferenceTable = require('../model/ConferenceTable');
var DataAccessor = require('../code/dataAccessor');

/* GET home page. */
router.get('/', function (req, res) {
    var accessor = new DataAccessor();
    accessor.get(4).then((data) => {
        res.render('index', { value: data });
    });
});

module.exports = router;