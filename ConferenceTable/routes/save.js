var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {    
    var file = "result.txt";
    readFile(file);
    writeFile(file);
    function writeFile(file) {  
        // 测试用的中文  
        var data = {
            id: req.query.meetingdate + req.query.meetingst + req.query.meetingroom,
            meetingdate: req.query.meetingdate,
            meetingtt: req.query.meetingtt,
            meetingroom: req.query.meetingroom,
            meetingst: req.query.meetingst,
            meetinget: req.query.meetinget,
            meetinguser: req.query.meetinguser
        };
        var str = JSON.stringify(data)+"\r\n";
        // appendFile，如果文件不存在，会自动创建新文件  
        // 如果用writeFile，那么会删除旧文件，直接写新文件  
        fs.appendFile(file, str, function (err) {
            if (err)
                console.log("fail " + err);
            else
                console.log("写入文件ok");
        });
    }

    function readFile(file) {
        fs.readFile(file,'utf8', function (err, str) {
            if (err)
                console.log("读取文件fail " + err);
            else {  
                // 读取成功时  
                // 输出字节数组  
                var strs = str.substring(1, str.length)
                var array = strs.split('\r\n');
                //for (var i = 0; i < array.length; i++) {
                //    var json = JSON.parse(array[i])
                //}
                //var json = JSON.parse(array[0]);
                //console.log(json.meetingst);
            }
        });
    }

    res.json({ result: "Express" });
    //res.render('index', { title: 'Express' });
});

module.exports = router;