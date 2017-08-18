var fs = require('fs');
var Meeting = require('../model/Meeting');
var MeetingTable = require('../model/MeetingTable');
var WorkDay = require('../code/workDay');
var file = 'data/meetingData.txt';

/**
 * meeting数据访问
 */
class DataAccessor {

    /// <param name="days" type="Number">天数</param>
    /// <param name="data" type="Array">会议数据</param>
    groupByDay(days, data) {
        if (!days) {
            return data;
        }
        var result = [];
        var workDay = new WorkDay(days);
        workDay.days.forEach((value) => {
            result.push({ date: value, meetings: [] })
        });
        data.forEach((meeting) => {
            if (workDay.days.findIndex(date => date === meeting.date) > -1) {
                result.forEach((item) => {
                    if (item.date == meeting.date) {
                        item.meetings.push(meeting);
                    }
                });
            } 
        });
        return result;
    }

    /// <param name="days" type="Number">展示天数</param>
    get(days) {
        try {
            let meetingStr = fs.readFileSync(file, 'utf8');
            return meetingStr ?
                this.groupByDay(days, JSON.parse('[' + meetingStr + ']')) :
                this.groupByDay(days, []);
        } catch (error) {
            if (error.code === 'ENOENT') {
                fs.writeFileSync(file, '');
                return this.groupByDay(days, []);
            } else {
                console.log('读取文件' + file + '出错');
                throw error;
            }
        }
    }

    /// <param name="text" type="String">会议文本</param>
    set(text) {
        try {
            fs.writeFileSync(file, text);
            return true;
        } catch (error) {
            console.log('写文件' + file + '出错,error' + error);
            return false;
        }
    }

    /// <param name="meeting" type="Meeting">会议</param>
    add(meeting) {
        let meetings = this.get();
        //TODO:检查
        let prefix = meetings.length == 0 ? '' : ',';
        let clash = false;
        if (meetings.length > 0) {
            meetings.forEach(m=> {
                if (meeting.date == m.date &&
                    meeting.meetingTable.id == m.meetingTable.id) {
                    if (!(meeting.timeRange[1] <= m.timeRange[0] ||
                        meeting.timeRange[0] >= m.timeRange[1])) {
                        clash = true;
                        return;
                    }
                }
            });
        }
        if (clash) { return false; }
        try {
            fs.appendFileSync(file, prefix + JSON.stringify(meeting));
            this.sort(meeting);
            return true;
        } catch (error) {
            console.log('append文件' + file + '出错,error' + error);
            return false;
        }
    }    

    ///<param name="meeting" type="Meeting">会议</param>
    sort(meeting) {
        let meetings = this.get();
        let convert = function (time) {
            let splitor = ':';
            let arr = time.split(splitor);
            return parseInt(arr[0]) * 60 + parseInt(arr[1]);
        }
        if (meetings.length > 0) {
            meetings.sort(function (a, b) {
                let prev = convert(a.timeRange[0]);
                let next = convert(b.timeRange[0]);               
                return prev - next;
            });
            let str = JSON.stringify(meetings);
            return this.set(str.slice(1, str.length - 1));
        }
    }

    /// <param name="id" type="String">会议id</param>
    remove(id) {
        let meetings = this.get();
        //TODO:检查
        let removeIndex = meetings.findIndex((value) => {
            return value.id === id;
        });
        meetings.splice(removeIndex, 1);
        let str = JSON.stringify(meetings);
        return this.set(str.slice(1, str.length - 1));

    }

    /// <param name="meeting" type="Meeting">会议</param>
    update(meeting) {
        if (this.remove(meeting.id)) {
            return this.add(meeting);
        } else {
            return false;
        }
    }
}

module.exports = DataAccessor;