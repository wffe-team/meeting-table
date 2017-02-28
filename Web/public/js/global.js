"use strict";

wf.require('page').render('conference', ['UI.Select'], function() {
    var page = this;
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
    var $conferenceTemp = $('.conferenceTemp');
    var $templete = $conferenceTemp.removeClass('conferenceTemp').clone();
    $conferenceTemp.remove();
    $('.meeting-add').click(function () {
        //准备时间条
        $(this).hide().prev().append($templete);
        page.refresh();
    });
});