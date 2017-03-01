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