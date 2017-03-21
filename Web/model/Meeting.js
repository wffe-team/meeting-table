var express = require('express');
var MeetingTable = require('./MeetingTable');

/**
 * 会议
 */
class Meeting {

    /// <param name="title" type="String">会议主题</param>
    /// <param name="userName" type="String">会议使用人</param>
    /// <param name="introduction" type="String">会议简介</param>
    /// <param name="meetingTable" type="MeetingTable">会议桌</param>
    /// <param name="timeRange" type="Array">时间范围</param>
    /// <param name="date" type="String">日期</param>
    constructor(
        title,
        userName,
        introduction,
        meetingTable,
        timeRange,
        date) {
        this.title = title;
        this.userName = userName;
        this.introduction = introduction;
        this.meetingTable = meetingTable;
        this.timeRange = timeRange;
        this.date = date;
        this.id = [this.date, this.timeRange.toString(), this.meetingTable.id];
        this.createDate = new Date().toLocaleString();
    }
}

module.exports = Meeting;
