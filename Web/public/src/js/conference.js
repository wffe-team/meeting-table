"use strict";

wf.require('page').render('conference', ['UI.Checkbox', 'UI.Select'], () => {
    var conferencer = (_=> {
        var sender = (url, data, callback) => {
            $.get(url, data, (rsp) => {
                if ($.isFunction(callback)) {
                    callback(rsp);
                }
            });
        };
        return {
            save: (conference, callback) => {

            },
            remove: (id, callback) => {

            }
        };
    })();

    //保存会议示例，如果有id则为更新
    //conferencer.save({会议数据}, (rsp) => {});
    var $templete = $('.conferenceTemp').clone(true,true).removeClass('conferenceTemp');
    //$('.conferenceTemp').remove();
    $('.meeting-add').click(function () {
        $(this).prev().append($templete);
    });
});