import express = require('express');

class ConferenceTable{
    
    /// <param name="roomNumber" type="Number">会议桌房号</param>
    /// <param name="number" type="Number">会议桌编号</param>
    constructor(roomNumber,number = 0){
        this.number = number;
        this.roomNumber = roomNumber;
    }
}

module.exports = ConferenceTable;