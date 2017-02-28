"use strict";

wf.require('page').render('conference', ['UI.Select'], function (UI, instances) {
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
            save: (conference, callback) => {
                sender('conference/save', conference, callback);
            },
            //避免关键字delete
            remove: (id, callback) => {
                sender('conference/delete', conference, callback);
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