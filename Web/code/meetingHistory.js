var fs = require('fs');
var Meeting = require('../model/Meeting');
var WorkDay = require('../code/workDay');
var file = 'data/meetingData.txt';

class DataHistory {
    getHistory(days) {
        let meetingStr = fs.readFileSync(file, 'utf8');
        var workDay = new WorkDay(days);
        let convert = function (date) {
            let num = date.replace(/-/g,'');
            return parseInt(num);
        }
        var result = [];
        if (!meetingStr) { result = [];}
        var data = JSON.parse('[' + meetingStr + ']');
        data.sort(function (a, b) {
            return convert(a.date) - convert(b.date);
        });
        data.forEach((meeting) => {
            if (workDay.days.findIndex(date => date==meeting.date) < 0) {
                result.push(meeting);
            } 
        });
        return result;
    }
}
module.exports = DataHistory;