var fs = require('fs');
var Meeting = require('../model/Meeting');
var WorkDay = require('../code/workDay');
var file = 'data/meetingData.txt';

class DataHistory {
    getHistory(days) {
        let meetingStr = fs.readFileSync(file, 'utf8');
        var workDay = new WorkDay(days);
        var result = [];
        if (!meetingStr) { result = [];}
        var data = JSON.parse('[' + meetingStr + ']');
        data.forEach((meeting) => {
            if (workDay.days.findIndex(date => date==meeting.date) < 0) {
                result.push(meeting);
            } 
        });
        return result;
    }
}
module.exports = DataHistory;