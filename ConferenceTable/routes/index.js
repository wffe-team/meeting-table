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
                var strs = str.substring(0, str.length)
                var array = strs.split('\r\n');
                var arr = [], arr1 = [], arr2 = [], arr3 = [], arr4 = [];
                var date = new Date();
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                var d = date.getDate();
                var td = y + "-" + m + "-" + d;//今天
                var tm = y + "-" + m + "-" + (d + 1);//明天
                var atm = y + "-" + m + "-" + (d + 2);//后天
                var gtm = y + "-" + m + "-" + (d + 3);//大后天
                for (var i = 0; i < array.length; i++) {
                    if (array[i] == "") {
                        continue;
                    }

                    var jsonarr = JSON.parse(array[i]);//字符串转成json

                    if (jsonarr.meetingdate == td) {
                        arr1.push(jsonarr);
                    } else if (jsonarr.meetingdate == tm) {
                        arr2.push(jsonarr);
                    } else if (jsonarr.meetingdate == atm) {
                        arr3.push(jsonarr);
                    } else if (jsonarr.meetingdate == gtm) {
                        arr4.push(jsonarr);
                    }
                }
                arr1.sort(sortNumber);
                arr2.sort(sortNumber);
                arr3.sort(sortNumber);
                arr4.sort(sortNumber);
                function sortNumber(a, b) {
                    if (a.meetingst > b.meetingst)
                        return 1;
                    else {
                        return -1;
                    }
                }
                arr.push({ date: td, value: arr1 });//今天所有会议数组
                arr.push({ date: tm, value: arr2 });//明天所有会议数组
                arr.push({ date: atm, value: arr3 });//后天所有会议数组
                arr.push({ date: gtm, value: arr4 });//大后天所有会议数组

                res.render('index', { value: arr });

            }
        });
    }    
});

module.exports = router;