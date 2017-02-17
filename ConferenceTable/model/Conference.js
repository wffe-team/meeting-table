import express = require('express');
import ConferenceTable = require('ConferenceTable');

/**
 * 会议
 */
class Conference{
    
    /// <param name="title" type="String">会议主题</param>
    /// <param name="userName" type="String">会议使用人</param>
    /// <param name="introduction" type="String">会议简介</param>
    /// <param name="conferenceTable" type="ConferenceTable">会议桌</param>
    /// <param name="timeRange" type="Array">时间范围</param>
    constructor(title,userName,introduction,conferenceTable,timeRange){
        this.title = title;
        this.user = user;
        this.introduction = introduction;
        this.conferenceTable = conferenceTable;
        this.timeRange = timeRange;
    }
}

module.exports = Conference;