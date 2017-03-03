wf.define('meetingTime', [], function () {
    return (function () {
        var startTime = 8;                                                               //开始时间，默认早上8点
        var endTime = 17;                                                                //结束时间，默认下午17点
        var granularity = 10;                                                            //时间粒度，单位：分钟
        var timeItemTemp = '<li data-value="{0}" class="wf-select-option {2}">{1}</li>'; //时间列表模板
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
            
            /// <param name="date" type="String">时间列表所处日期</param>
            /// <param name="value" type="String">时间选中值用于已有会议时间的初始化</param>
            render: function (date,value) {
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
                for (; time <= endTime * 60; time = time + granularity) {
                    var timeStr = convert.toTime(time);
                    result.push(timeItemTemp.format(timeStr, timeStr, timeStr == value ? 'wf-select-option-selected' : ''));
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
wf.define('meetingCheck', [], function () {

    return function () {
        return {
            check: function (currentData, prevData) {
                if (currentData.endTime <= currentData.startTime) {
                    return false;
                }
                if (currentData.date == prevData.date && currentData.tableRoom == prevData.tableRoom) {
                    if (currentData.startTime >= prevData.endTime || currentData.endTime <= prevData.startTime) {
                        return false;
                    }
                }
                return true;
            }
        }   
    };
})
"use strict";
wf.define('meetingCard', [], function () {

    var meeting = wf.require('meeting');
    var meetingTime = wf.require('meetingTime');
    var meetingCheck = wf.require('meetingCheck');

    return function ($trigger, $scope, date) {

        var $saveBtn = $scope.find('.meeting-save');
        var $deleteBtn = $scope.find('.meeting-delete');
        var $startTime = $scope.find('.meeting-startTime');
        var $endTime = $scope.find('.meeting-endTime');
        var SAVED_CLS = 'meeting-saved';
        var EDIT_CLS = 'meeting-edit';
        var EDITING_CLS = 'meeting-editing';
        var MEETING_LIST = '.meeting-list-wrapper';
        var ERROR_CLS = 'meeting-error';
        
        var findByName = (name) => {
            return $scope.find('[name="{0}"]'.format(name));
        };

        var prevData = function () {
            var fields = ['tableRoom', 'startTime', 'endTime'];
            var model = { date: date };
            var prevDataArr = [];
            $saveBtn.parents('.meeting-card').each(function () {
                var cardData = [];
                $(this).find('.wf-select-input').each(function () {
                    var $this = $(this);
                    cardData.push($this.val());
                });
                for (var i = 0; i < cardData.length; i++) {
                    model[fields[i]] = cardData[i];
                }
                prevDataArr.push(model);
            });
            return prevDataArr;
        }
        
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

            var check = meetingCheck();
            var prevDataArr = prevData();
            for (var i = 0; i < prevDataArr.length; i++) {                
                if (check.check(result, prevDataArr[i])) {
                    return result;
                } else {
                    $saveBtn.parent().parent().addClass(ERROR_CLS);
                    setTimeout(function () {
                        $saveBtn.parent().parent().removeClass(ERROR_CLS);
                    }, 2000);                                      
                }                
            }  
        };

        $startTime.find('.time-option')
            .html(meetingTime.render(date, findByName('startTime').val()));
        $endTime.find('.time-option')
            .html(meetingTime.render(date, findByName('endTime').val()));

        $saveBtn.click(function () {
            var data = prapareData();
            if (data) {
                meeting.save(data, rsp=> {
                    if (rsp.success) {
                        //成功
                        if (!data.id) {
                            findByName('id').val(rsp.id);
                        }
                        $saveBtn.parent().parent().addClass(SAVED_CLS);
                        $scope.closest(MEETING_LIST).removeClass(EDITING_CLS);
                    } else {
                        //失败
                    }
                });
            }
        });
        $deleteBtn.click(function () {
            var id = findByName('id').val();
            var uiRemove = function () {
                $scope.closest(MEETING_LIST).removeClass(EDITING_CLS);
                $scope.remove();                
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

        $scope.hover(function () {
            if ($(this).hasClass(SAVED_CLS)) {
                $(this).find('.' + EDIT_CLS).show();
            }
        }, function () {
            $(this).find('.' + EDIT_CLS).hide();
        });
        $scope.find('.' + EDIT_CLS + ' .wf-btn').click(function () {
            $scope.removeClass(SAVED_CLS).closest(MEETING_LIST).addClass(EDITING_CLS);;
            $(this).parent().hide();
        });
        return {
            addTo: function ($container) {
                $container.append($scope);
                $scope.closest(MEETING_LIST).addClass(EDITING_CLS);
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
    $meetingCard.find('[data-rendered]').removeAttr('data-rendered');
    $('.meeting-add').click(function () {
        var $addBtn = $(this);
        var $templete = $meetingCard.clone();
        var date = $addBtn.prev().find('.meeting-date').html();
        var card = meetingCard($addBtn, $templete, date);
        card.addTo($addBtn.prev());
        page.refresh();
    });
    var $cards = $('.meeting-board-wrapper').find('.meeting-card');
    $.each($cards, function () {
        meetingCard('', $(this), $(this).parent().find('.meeting-date').html());
    });
    page.refresh();
});