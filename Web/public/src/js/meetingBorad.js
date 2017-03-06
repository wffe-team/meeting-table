"use strict";

wf.require('page').render('meetingBorad', ['UI.Select', 'UI.Modal'], function (UI, instances) {
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