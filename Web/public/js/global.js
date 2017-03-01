"use strict";
wf.define('timeList', [], function () {
    return (function () {
        var startTime = 8;                                                               //开始时间，默认早上8点
        var endTime = 20;                                                                //结束时间，默认下午17点
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
"use strict";

wf.require('page').render('meeting', ['UI.Select'], function (UI, instances) {
    var page = this;
    var conferencer = (_=> {
        var sender = (url, data, callback) => {
            $.post(url, data, (rsp) => {
                if ($.isFunction(callback)) {
                    callback(rsp);
                }
            });
        };
        return {
            save: (meeting, callback) => {
                sender('meeting/save', meeting, callback);
            },
            //避免关键字delete
            remove: (id, callback) => {
                sender('meeting/delete', meeting, callback);
            }
        };
    })();
    var timer = wf.require('timeList');
    var tempCls = 'conferenceTemp';
    var $conferenceTemp = $('.' + tempCls).remove().removeClass(tempCls);
    var prapareData = function ($temp, date, id) {
        var $title = $temp.find('[name="title"]');
        var $userName = $temp.find('[name="userName"]');
        var roomNumber = $temp.find('[name="roomNumber"]').val();
        var startTime = $temp.find('[name="startTime"]').val();
        var endTime = $temp.find('[name="endTime"]').val();
        if (!$title.val()) { $title.focus(); return null; }
        if (!$userName.val()) { $userName.focus(); return null; }
        return {
            title: $title.val(),
            userName: $userName.val(),
            introduction: '',
            tableRoom: roomNumber,
            startTime: startTime,
            endTime: endTime,
            date: date,
            id: id
        }
    };
    $('.meeting-add').click(function () {
        var $addBtn = $(this);
        var $templete = $conferenceTemp.clone();
        var date = $addBtn.prev().find('.meeting-date').html();
        var $startTimeSelect = $templete.find('.wf-select-startTime');
        var $endTimeSelect = $templete.find('.wf-select-endTime');
        var $saveBtn = $templete.find('.wf-btn-save');
        var $deleteBtn = $templete.find('.wf-btn-delete');
        var $board = $('.meeting-board');
        $startTimeSelect.find('.wf-select-options').html(timer.render(date));
        $endTimeSelect.find('.wf-select-options').html(timer.render(date));
        $(this).hide().prev().append($templete);
        $saveBtn.click(function () {
            var id = $board.data('id');
            var data = prapareData($templete, date, id);
            if (data) {
                conferencer.save(data, function (rsp) {
                    if (rsp.success) {
                        console.log('add success');
                        $board.data('id', rsp.id);
                    }
                })
            }
        });
        $deleteBtn.click(function () {
            $templete.remove();
            $addBtn.show();
        })
        page.refresh();
    });
});