var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var file = "result.txt";
    readFile(file);
    function readFile(file) {
        fs.readFile(file, 'utf8', function (err, str) {
            if (err)
                console.log("读取文件fail " + err);
            else {  
                // 读取成功时  
                // 输出字节数组  
                var array = str.split('\r\n');
                var arrtotal = [];
                readArr(4);
                function readArr(num) {                    
                    for (var i = 0; i < num; i++) {
                        var arritem = [];
                        var currentdate = new Date();
                        var y = currentdate.getFullYear(), m = currentdate.getMonth() + 1, d = currentdate.getDate();
                        var date = y + "-" + m + "-" + (d + i);
                        var weekdate = new Date(date);
                        //日期排除周六周日
                        if (weekdate.getDay() == 0 || weekdate.getDay() == 6) {
                            date = y + "-" + m + "-" + (d + 2 + i);
                        }
                        for (var j = 0; j < array.length; j++) {
                            if (array[j] == "") { continue; }
                            var jsonarr = JSON.parse(array[j]);//字符串转成json
                            if (jsonarr.meetingdate == date) {
                                arritem.push(jsonarr);
                            }
                        }
                        arritem.sort(sortNumber);
                        arrtotal.push({ date: date, value: arritem });
                    }                   
                }
                function sortNumber(a, b) {
                    if (a.meetingst > b.meetingst){ return 1; }
                    else {return -1;}
                }
                res.render('index', { value: arrtotal });

            }
        });
    }    
});

module.exports = router;