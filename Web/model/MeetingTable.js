var express = require('express');

/**
 * 会议桌
 */
module.exports = class MeetingTable {

    /// <param name="id" type="String">会议桌id,房号-序号</param>
    constructor(id) {
        var arr = id.split('-');
        this.id = id;
        this.number = arr[1];
        this.roomNumber = arr[0];
    }

};