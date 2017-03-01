"use strict";
wf.define('timeList', [], function () {
    return (function () {
        var startTime = 8;                                                               //开始时间，默认早上8点
        var endTime = 17;                                                                //结束时间，默认下午17点
        var granularity = 10;                                                            //时间粒度，单位：分钟
        var timeItemTemp = '<li data-value="{0}" class="wf-select-option">{1}</li>';     //时间列表模板
        var convert = (function () {
            var splitor = ':'
            return {
                toTime: minutes=> {
                    var minute = minutes % 60;
                    return Math.floor(minutes / 60) + splitor + (minute < 10 ? '0' + minute : minute);
                },
                toMinutes: timeStr=> {
                    var arr = timeStr.split(splitor);
                    return parseInt(arr[0]) * 60 + parseInt(arr[1]);
                }
            };
        })();
        return {
            render: function (date) {
                var result = [];
                var currentDate = new Date();
                var currentHour = currentDate.getHours();
                var currentMinutes = currentDate.getMinutes();
                if (currentHour >= endTime) {
                    return timeItemTemp.format('', '下班');
                }
                var time = currentDate.format('yyyy-MM-dd') == date ?
                    currentHour * 60 + Math.ceil(currentMinutes / granularity) * granularity :
                    startTime * 60;
                for (; time < endTime * 60; time = time + granularity) {
                    var timeStr = convert.toTime(time);
                    result.push(timeItemTemp.format(timeStr, timeStr));
                }
                return result.join('');
            }
        };
    })();
})