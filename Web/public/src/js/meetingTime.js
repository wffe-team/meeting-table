wf.define('meetingTime', [], function () {
    return (function () {
        var startTime = 8;                                                               //开始时间，默认早上8点
        var endTime = 17;                                                                //结束时间，默认下午17点
        var granularity = 10;                                                            //时间粒度，单位：分钟
        var splitor = ':'
        var timeItemTemp = '<li data-value="{0}" class="wf-select-option {2}">{1}</li>'; //时间列表模板
        var convert = (function () {
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

            /// <param name="date" type="String">时间列表所处日期</param>
            /// <param name="value" type="String">时间选中值用于已有会议时间的初始化</param>
            render: function (date, value) {
                var result = [];
                var currentDate = new Date();
                var currentHour = currentDate.getHours();
                var currentMinutes = currentDate.getMinutes();
                var valueHour = 24;
                var valueMinutes = 60;
                var isToday = currentDate.format('yyyy-MM-dd') == date;
                if (currentHour >= endTime && isToday) {
                    return timeItemTemp.format('', '下班');
                }
                if (value) {
                    var valueArr = value.split(splitor);
                    valueHour = parseInt(valueArr[0]);
                    valueMinutes = parseInt(valueArr[1]);
                }
                var time = isToday ?
                    Math.min(currentHour, valueHour) * 60 + Math.ceil(Math.min(currentMinutes, valueMinutes) / granularity) * granularity :
                    startTime * 60;
                for (; time <= endTime * 60; time = time + granularity) {
                    var timeStr = convert.toTime(time);
                    result.push(timeItemTemp.format(timeStr, timeStr, time === convert.toMinutes(value) ? 'wf-select-option-selected' : ''));
                }
                return result.join('');
            }
        };
    })();
})