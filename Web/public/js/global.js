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

wf.define('meeting', [], function () {
    return (_=> {
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
                sender('meeting/delete', { id: id }, callback);
            }
        };
    })();
});
"use strict";
wf.define('meetingCard', [], function () {

    var meeting = wf.require('meeting');
    var timeList = wf.require('timeList');

    return function ($trigger, $scope, date) {

        var $saveBtn = $scope.find('.meeting-save');
        var $deleteBtn = $scope.find('.meeting-delete');
        var $startTime = $scope.find('.meeting-startTime');
        var $endTime = $scope.find('.meeting-endTime');

        var findByName = (name) => {
            return $scope.find('[name="{0}"]'.format(name));
        };

        var prapareData = function () {
            var model = {};
            var result = { date: date };
            var fields = ['id', 'title', 'userName', 'tableRoom', 'startTime', 'endTime'];
            fields.forEach(field=> {
                model[field] = findByName(field);
            });
            if (!model.title.val()) { model.title.focus(); return null; }
            if (!model.userName.val()) { model.userName.focus(); return null; }
            for (var key in model) {
                result[key] = model[key].val();
            }
            return result;
        };

        $startTime.find('.time-option').html(timeList.render(date));
        $endTime.find('.time-option').html(timeList.render(date));

        $saveBtn.click(function () {
            var data = prapareData();
            if (data) {
                meeting.save(data, rsp=> {
                    if (rsp.success) {
                        //成功
                        findByName('id').val(rsp.id);
                    } else {
                        //失败
                    }
                });
            }
        });
        $deleteBtn.click(function () {
            var id = findByName('id').val();
            var uiRemove = function () {
                $scope.remove();
                $trigger.show();
            }
            //删除已有
            if (id) {
                meeting.remove(id, rsp=> {
                    if (rsp.success) {
                        //成功
                        uiRemove();
                    } else {
                        //失败
                    }
                });
            } else {
                uiRemove();
            }
        });

        return {
            addTo: function ($container) {
                $trigger.hide();
                $container.append($scope);
            }
        };
    };
})
"use strict";

wf.require('page').render('meetingBorad', ['UI.Select'], function (UI, instances) {
    var page = this;
    var tempCls = 'meeting-temp';
    var meetingCard = wf.require('meetingCard');    
    var $meetingCard = $('.' + tempCls).remove().removeClass(tempCls);

    $('.meeting-add').click(function () {
        var $addBtn = $(this);
        var $templete = $meetingCard.clone();
        var date = $addBtn.prev().find('.meeting-date').html();
        var card = meetingCard($addBtn, $templete, date);
        card.addTo($addBtn.prev());
        page.refresh();
    });
});