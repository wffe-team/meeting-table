var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var file = "result.txt";
    delFile(file);

    function delFile(file) {
        fs.readFile(file, 'utf8', function (err, str) {
            if (err)
                console.log("读取文件fail " + err);
            else {
                var strs = str.substring(0, str.length)
                var array = strs.split('\r\n');
                for (var i = 0; i < array.length; i++) {
                    if (array[i] == "") {
                        continue;
                    }
                    var jsonarr = JSON.parse(array[i]);//字符串转成json
                    if (jsonarr.id == req.query.id) {
                        array.splice(i,1);
                    }
                }
                strarray = array.join('\r\n');
                fs.writeFile(file, strarray, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                })
                res.json({ result: "Express" });
            }
        });
    }

});

module.exports = router;