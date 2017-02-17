var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/save', function (req, res) {
    var file = "result.txt";
    updateFile(file);
    function updateFile(file) {
        fs.readFile(file, 'utf8', function (err, str) {
            var array = str.split('\r\n');
            //add meeting
            if (req.query.id == undefined) {
                var date = new Date();
                var time = date.getTime();
                var data = {
                    id: time,
                    meetingdate: req.query.meetingdate,
                    meetingtt: req.query.meetingtt,
                    meetingroom: req.query.meetingroom,
                    meetingst: req.query.meetingst,
                    meetinget: req.query.meetinget,
                    meetinguser: req.query.meetinguser
                };
                var str = JSON.stringify(data) + "\r\n";
                // appendFile，如果文件不存在，会自动创建新文件  
                // 如果用writeFile，那么会删除旧文件，直接写新文件  
                fs.appendFile(file, str, function (err) {
                    if (err)
                        console.log("fail " + err);
                    else
                        console.log("写入文件ok");
                });
            }
                //edit meeting
            else {
                var array = str.split('\r\n');
                for (var i = 0; i < array.length; i++) {
                    if (array[i] == "") {
                        continue;
                    }
                    var jsonarr = JSON.parse(array[i]);//字符串转成json
                    //判断各字符串不能为空
                    if (req.query.meetingtt.trim().length == 0 || req.query.meetinguser.trim().length == 0 || req.query.meetingdate.trim().length == 0 || req.query.meetingst.trim().length == 0 || req.query.meetinget.trim().length == 0 || req.query.meetingroom.trim().length == 0) {
                        return;
                    }
                    if (jsonarr.id == req.query.id) {
                        for (var i = 0; i < req.query.meetingroomlist.length; i++) {
                            if (req.query.meetingroomlist[i] != req.query.meetingroom) { return; }
                        }
                        array[i] = JSON.stringify(req.query);
                    }
                }
                var strarray = array.join('\r\n');
                fs.writeFile(file, strarray, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                })
            }
        });
    }
    res.json({ result: "Express" });
});

router.get('/add', function (req, res) {
    var file = "result.txt";
    updateFile(file);
    function updateFile(file) {
        fs.readFile(file, 'utf8', function (err, str) {
            var array = str.split('\r\n');
            //add meeting
            if (req.query.id == undefined) {
                var date = new Date();
                var time = date.getTime();
                var data = {
                    id: time,
                    meetingdate: req.query.meetingdate,
                    meetingtt: req.query.meetingtt,
                    meetingroom: req.query.meetingroom,
                    meetingst: req.query.meetingst,
                    meetinget: req.query.meetinget,
                    meetinguser: req.query.meetinguser
                };
                var str = JSON.stringify(data) + "\r\n";
                // appendFile，如果文件不存在，会自动创建新文件  
                // 如果用writeFile，那么会删除旧文件，直接写新文件  
                fs.appendFile(file, str, function (err) {
                    if (err)
                        console.log("fail " + err);
                    else
                        console.log("写入文件ok");
                });
            }
                //edit meeting
            else {
                var array = str.split('\r\n');
                for (var i = 0; i < array.length; i++) {
                    if (array[i] == "") {
                        continue;
                    }
                    var jsonarr = JSON.parse(array[i]);//字符串转成json
                    //判断各字符串不能为空
                    if (req.query.meetingtt.trim().length == 0 || req.query.meetinguser.trim().length == 0 || req.query.meetingdate.trim().length == 0 || req.query.meetingst.trim().length == 0 || req.query.meetinget.trim().length == 0 || req.query.meetingroom.trim().length == 0) {
                        return;
                    }
                    if (jsonarr.id == req.query.id) {
                        for (var i = 0; i < req.query.meetingroomlist.length; i++) {
                            if (req.query.meetingroomlist[i] != req.query.meetingroom) { return; }
                        }
                        array[i] = JSON.stringify(req.query);
                    }
                }
                var strarray = array.join('\r\n');
                fs.writeFile(file, strarray, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                })
            }
        });
    }
    res.json({ result: "Express" });
});

router.get('/update', function (req, res) {
    var file = "result.txt";
    updateFile(file);
    function updateFile(file) {
        fs.readFile(file, 'utf8', function (err, str) {
            var array = str.split('\r\n');
            //add meeting
            if (req.query.id == undefined) {
                var date = new Date();
                var time = date.getTime();
                var data = {
                    id: time,
                    meetingdate: req.query.meetingdate,
                    meetingtt: req.query.meetingtt,
                    meetingroom: req.query.meetingroom,
                    meetingst: req.query.meetingst,
                    meetinget: req.query.meetinget,
                    meetinguser: req.query.meetinguser
                };
                var str = JSON.stringify(data) + "\r\n";
                // appendFile，如果文件不存在，会自动创建新文件  
                // 如果用writeFile，那么会删除旧文件，直接写新文件  
                fs.appendFile(file, str, function (err) {
                    if (err)
                        console.log("fail " + err);
                    else
                        console.log("写入文件ok");
                });
            }
                //edit meeting
            else {
                var array = str.split('\r\n');
                for (var i = 0; i < array.length; i++) {
                    if (array[i] == "") {
                        continue;
                    }
                    var jsonarr = JSON.parse(array[i]);//字符串转成json
                    //判断各字符串不能为空
                    if (req.query.meetingtt.trim().length == 0 || req.query.meetinguser.trim().length == 0 || req.query.meetingdate.trim().length == 0 || req.query.meetingst.trim().length == 0 || req.query.meetinget.trim().length == 0 || req.query.meetingroom.trim().length == 0) {
                        return;
                    }
                    if (jsonarr.id == req.query.id) {
                        for (var i = 0; i < req.query.meetingroomlist.length; i++) {
                            if (req.query.meetingroomlist[i] != req.query.meetingroom) { return; }
                        }
                        array[i] = JSON.stringify(req.query);
                    }
                }
                var strarray = array.join('\r\n');
                fs.writeFile(file, strarray, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                })
            }
        });
    }
    res.json({ result: "Express" });
});

router.get('/delete', function (req, res) {
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
                        array.splice(i, 1);
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

module.exports = router